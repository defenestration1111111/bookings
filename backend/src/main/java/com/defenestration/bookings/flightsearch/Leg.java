package com.defenestration.bookings.flightsearch;

import java.time.Instant;

public record Leg(
        String flightNumber,
        LegAirport fromAirport,
        LegAirport toAirport,
        Instant departureAt,
        Instant arrivalAt,
        int durationMinutes,
        boolean nextDayArrival) {
}
