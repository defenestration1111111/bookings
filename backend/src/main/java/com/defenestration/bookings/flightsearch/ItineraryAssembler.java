package com.defenestration.bookings.flightsearch;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ItineraryAssembler {

    private static final String CURRENCY = "USD";

    private final LegDetailsRepository repository;

    public ItineraryAssembler(LegDetailsRepository repository) {
        this.repository = repository;
    }

    public List<Itinerary> assemble(List<ItineraryRow> rows) {
        if (rows.isEmpty()) {
            return List.of();
        }
        List<Integer> flightIds = rows.stream()
                .flatMap(r -> Arrays.stream(r.getFlightIds()))
                .toList();
        Map<Integer, LegDetailRow> legsByFlightId = repository.fetchLegDetails(flightIds).stream()
                .collect(Collectors.toMap(LegDetailRow::getFlightId, Function.identity()));
        return rows.stream()
                .map(r -> assembleOne(r, legsByFlightId))
                .toList();
    }

    private static Itinerary assembleOne(ItineraryRow row, Map<Integer, LegDetailRow> legsByFlightId) {
        FareClass fareClass = FareClass.fromSql(row.getFareClass());
        List<Leg> legs = Arrays.stream(row.getFlightIds())
                .map(id -> toLeg(legsByFlightId.get(id)))
                .toList();
        return new Itinerary(
                itineraryId(row.getFlightIds(), fareClass),
                fareClass,
                row.getPrice(),
                CURRENCY,
                row.getTotalTripTimeMinutes(),
                row.getFlightTimeMinutes(),
                row.getTotalLayoverMinutes(),
                row.getStopovers(),
                legs);
    }

    private static Leg toLeg(LegDetailRow r) {
        return new Leg(
                r.getFlightNumber(),
                new LegAirport(r.getFromCode().trim(), r.getFromCity()),
                new LegAirport(r.getToCode().trim(), r.getToCity()),
                r.getDepartureAt(),
                r.getArrivalAt(),
                r.getDurationMinutes(),
                r.getNextDayArrival());
    }

    private static String itineraryId(Integer[] flightIds, FareClass fareClass) {
        String key = Arrays.stream(flightIds).map(String::valueOf).collect(Collectors.joining(","))
                + "|" + fareClass.sqlValue();
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(key.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash, 0, 8);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
