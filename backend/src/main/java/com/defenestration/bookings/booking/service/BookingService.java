package com.defenestration.bookings.booking.service;

import com.defenestration.bookings.booking.dto.BookedSegment;
import com.defenestration.bookings.booking.dto.BookingLegRequest;
import com.defenestration.bookings.booking.dto.BookingRequest;
import com.defenestration.bookings.booking.dto.BookingResponse;
import com.defenestration.bookings.booking.dto.PassengerInfo;
import com.defenestration.bookings.booking.dto.SeatConflict;
import com.defenestration.bookings.booking.exception.SeatConflictException;
import com.defenestration.bookings.booking.exception.UnknownFlightException;
import com.defenestration.bookings.booking.exception.UnknownSeatException;
import com.defenestration.bookings.booking.repository.BookingRepository;
import com.defenestration.bookings.booking.repository.LegPricingRow;
import com.defenestration.bookings.booking.repository.SeatTakenRow;
import com.defenestration.bookings.common.FlightStatus;
import com.defenestration.bookings.flightsearch.FareClass;
import com.defenestration.bookings.flightsearch.LegAirport;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class BookingService {

    private static final String SEAT_UNIQUE_CONSTRAINT = "segments_flight_id_seat_no_key";

    /** Parses the {@code DETAIL:} line of a Postgres unique-violation error. */
    private static final Pattern UNIQUE_VIOLATION_DETAIL =
            Pattern.compile("Key \\(flight_id, seat_no\\)=\\((\\d+),\\s*([^)]+)\\)\\s*already exists");

    private static final String CURRENCY = "USD";

    private final BookingRepository repository;
    private final BookingIdGenerator idGenerator;
    private final TransactionTemplate txTemplate;
    private final Clock clock;

    public BookingService(BookingRepository repository,
                          BookingIdGenerator idGenerator,
                          TransactionTemplate txTemplate,
                          Clock clock) {
        this.repository = repository;
        this.idGenerator = idGenerator;
        this.txTemplate = txTemplate;
        this.clock = clock;
    }

    public BookingResponse create(BookingRequest request) {
        int[] flightIds = request.legs().stream().mapToInt(BookingLegRequest::flightId).toArray();
        String[] seatNos = request.legs().stream().map(BookingLegRequest::seatNo).toArray(String[]::new);

        List<LegPricingRow> rows = repository.fetchLegPricing(flightIds, seatNos);
        validatePresence(rows);
        validateBookable(rows);
        validateSeatsAndPrices(rows);
        preCheckSeatAvailability(flightIds, seatNos);

        String bookRef = idGenerator.bookRef();
        String ticketNo = idGenerator.ticketNo();
        String passengerId = idGenerator.passengerId();
        Instant bookDate = clock.instant();
        BigDecimal totalAmount = rows.stream()
                .map(LegPricingRow::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        try {
            txTemplate.executeWithoutResult(status -> {
                repository.insertBooking(bookRef, bookDate.atZone(clock.getZone()).toOffsetDateTime(), totalAmount);
                repository.insertTicket(ticketNo, bookRef, passengerId,
                        request.passenger().firstName() + " " + request.passenger().lastName());
                for (LegPricingRow r : rows) {
                    repository.insertSegment(ticketNo, r.getFlightId(),
                            r.getFareConditions(), r.getPrice(), r.getSeatNo());
                }
            });
        } catch (DataIntegrityViolationException ex) {
            throw mapDataIntegrityViolation(ex, flightIds, seatNos);
        }

        return buildResponse(bookRef, bookDate, totalAmount, request.passenger(), ticketNo, rows);
    }

    private void validatePresence(List<LegPricingRow> rows) {
        List<Integer> missing = rows.stream()
                .filter(r -> r.getStatus() == null)
                .map(LegPricingRow::getFlightId)
                .toList();
        if (!missing.isEmpty()) {
            throw new UnknownFlightException(missing);
        }
    }

    private void validateBookable(List<LegPricingRow> rows) {
        List<SeatConflict> bad = rows.stream()
                .filter(r -> !FlightStatus.BOOKABLE_SQL_VALUES.contains(r.getStatus()))
                .map(r -> SeatConflict.flightNotBookable(r.getFlightId()))
                .toList();
        if (!bad.isEmpty()) {
            throw new SeatConflictException(bad);
        }
    }

    private void validateSeatsAndPrices(List<LegPricingRow> rows) {
        for (LegPricingRow r : rows) {
            if (r.getFareConditions() == null) {
                throw new UnknownSeatException(r.getFlightId(), r.getSeatNo());
            }
            if (r.getPrice() == null) {
                throw new SeatConflictException(List.of(
                        SeatConflict.flightNotBookable(r.getFlightId())));
            }
        }
    }

    private void preCheckSeatAvailability(int[] flightIds, String[] seatNos) {
        List<SeatTakenRow> taken = repository.findTakenSeats(flightIds, seatNos);
        if (!taken.isEmpty()) {
            List<SeatConflict> conflicts = taken.stream()
                    .map(t -> SeatConflict.seatTaken(t.getFlightId(), t.getSeatNo()))
                    .toList();
            throw new SeatConflictException(conflicts);
        }
    }

    private RuntimeException mapDataIntegrityViolation(
            DataIntegrityViolationException ex, int[] flightIds, String[] seatNos) {
        String chained = chainedMessages(ex);
        if (chained.contains(SEAT_UNIQUE_CONSTRAINT)) {
            // Fresh transaction — the failing one has rolled back.
            List<SeatTakenRow> nowTaken = repository.findTakenSeats(flightIds, seatNos);
            if (!nowTaken.isEmpty()) {
                List<SeatConflict> conflicts = nowTaken.stream()
                        .map(t -> SeatConflict.seatTaken(t.getFlightId(), t.getSeatNo()))
                        .toList();
                return new SeatConflictException(conflicts);
            }
            Matcher m = UNIQUE_VIOLATION_DETAIL.matcher(chained);
            if (m.find()) {
                return new SeatConflictException(List.of(
                        SeatConflict.seatTaken(Integer.parseInt(m.group(1)), m.group(2).trim())));
            }
        }
        return ex;
    }

    private static String chainedMessages(Throwable ex) {
        StringBuilder sb = new StringBuilder();
        for (Throwable t = ex; t != null; t = t.getCause()) {
            if (t.getMessage() != null) {
                sb.append(t.getMessage()).append('\n');
            }
        }
        return sb.toString();
    }

    private BookingResponse buildResponse(String bookRef, Instant bookDate, BigDecimal totalAmount,
                                          PassengerInfo passenger, String ticketNo,
                                          List<LegPricingRow> rows) {
        List<BookedSegment> segments = rows.stream()
                .map(r -> new BookedSegment(
                        r.getFlightId(),
                        r.getFlightNumber(),
                        new LegAirport(r.getFromCode(), r.getFromCity()),
                        new LegAirport(r.getToCode(), r.getToCity()),
                        r.getDepartureAt(),
                        r.getArrivalAt(),
                        FareClass.fromSql(r.getFareConditions()),
                        r.getSeatNo(),
                        r.getPrice()))
                .toList();
        return new BookingResponse(bookRef, bookDate, totalAmount, CURRENCY,
                passenger, ticketNo, segments);
    }
}
