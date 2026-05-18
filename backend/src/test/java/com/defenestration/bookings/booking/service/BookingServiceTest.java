package com.defenestration.bookings.booking.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import com.defenestration.bookings.TestcontainersConfiguration;
import com.defenestration.bookings.booking.dto.BookingLegRequest;
import com.defenestration.bookings.booking.dto.BookingRequest;
import com.defenestration.bookings.booking.dto.BookingResponse;
import com.defenestration.bookings.booking.dto.MockPayment;
import com.defenestration.bookings.booking.dto.PassengerInfo;
import com.defenestration.bookings.booking.dto.SeatConflict;
import com.defenestration.bookings.booking.exception.SeatConflictException;
import com.defenestration.bookings.booking.exception.UnknownFlightException;
import com.defenestration.bookings.booking.exception.UnknownSeatException;
import com.defenestration.bookings.booking.repository.BookingRepository;
import com.defenestration.bookings.booking.repository.SeatTakenRow;
import com.defenestration.bookings.flightsearch.FareClass;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Sql("/db/fixtures/booking_small.sql")
class BookingServiceTest {

    @Autowired
    private BookingService service;

    @Autowired
    private BookingRepository repository;

    private static final PassengerInfo PASSENGER = new PassengerInfo("Alice", "Anderson");
    private static final MockPayment PAYMENT = new MockPayment("4111 1111 1111 1111", "12/29", "123");

    @Test
    void createPersistsBookingAndReturnsConfirmedResponse() {
        BookingRequest request = new BookingRequest(
                PASSENGER,
                List.of(new BookingLegRequest(100, "12A")),
                PAYMENT);

        BookingResponse response = service.create(request);

        assertThat(response.bookRef()).matches("[A-Z0-9]{6}");
        assertThat(response.ticketNo()).matches("[0-9]{13}");
        assertThat(response.currency()).isEqualTo("USD");
        assertThat(response.totalAmount()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(response.passenger()).isEqualTo(PASSENGER);

        assertThat(response.segments()).singleElement().satisfies(seg -> {
            assertThat(seg.flightId()).isEqualTo(100);
            assertThat(seg.seatNo()).isEqualTo("12A");
            assertThat(seg.fareConditions()).isEqualTo(FareClass.ECONOMY);
            assertThat(seg.price()).isEqualByComparingTo(new BigDecimal("500.00"));
            assertThat(seg.fromAirport().airportCode()).isEqualTo("LHR");
            assertThat(seg.toAirport().airportCode()).isEqualTo("JFK");
        });

        // Round-trip the INSERT — the seat must now be visible as taken.
        List<SeatTakenRow> taken = repository.findTakenSeats(new int[]{100}, new String[]{"12A"});
        assertThat(taken).hasSize(1);
    }

    @Test
    void createThrowsUnknownFlightWhenFlightIdMissing() {
        BookingRequest request = new BookingRequest(
                PASSENGER,
                List.of(new BookingLegRequest(999_999, "12A")),
                PAYMENT);

        assertThatExceptionOfType(UnknownFlightException.class)
                .isThrownBy(() -> service.create(request))
                .satisfies(ex -> assertThat(ex.flightIds()).containsExactly(999_999));
    }

    @Test
    void createThrowsUnknownSeatWhenSeatNotOnAirframe() {
        BookingRequest request = new BookingRequest(
                PASSENGER,
                List.of(new BookingLegRequest(100, "99Z")),
                PAYMENT);

        assertThatExceptionOfType(UnknownSeatException.class)
                .isThrownBy(() -> service.create(request))
                .satisfies(ex -> {
                    assertThat(ex.flightId()).isEqualTo(100);
                    assertThat(ex.seatNo()).isEqualTo("99Z");
                });
    }

    @Test
    void createRejectsCancelledFlightWithFlightNotBookableConflict() {
        BookingRequest request = new BookingRequest(
                PASSENGER,
                List.of(new BookingLegRequest(101, "12A")),
                PAYMENT);

        assertThatExceptionOfType(SeatConflictException.class)
                .isThrownBy(() -> service.create(request))
                .satisfies(ex -> assertThat(ex.conflicts())
                        .singleElement()
                        .satisfies(c -> {
                            assertThat(c.flightId()).isEqualTo(101);
                            assertThat(c.reason()).isEqualTo(SeatConflict.Reason.FLIGHT_NOT_BOOKABLE);
                            assertThat(c.seatNo()).isNull();
                        }));
    }

    @Test
    void createRejectsAlreadyBookedSeatWithSeatTakenConflict() {
        // Fixture pre-books (100, '1A'); the pre-check should catch it.
        BookingRequest request = new BookingRequest(
                PASSENGER,
                List.of(new BookingLegRequest(100, "1A")),
                PAYMENT);

        assertThatExceptionOfType(SeatConflictException.class)
                .isThrownBy(() -> service.create(request))
                .satisfies(ex -> assertThat(ex.conflicts())
                        .singleElement()
                        .satisfies(c -> {
                            assertThat(c.flightId()).isEqualTo(100);
                            assertThat(c.seatNo()).isEqualTo("1A");
                            assertThat(c.reason()).isEqualTo(SeatConflict.Reason.SEAT_TAKEN);
                        }));
    }
}
