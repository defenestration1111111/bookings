package com.defenestration.bookings.booking.dto;

import com.defenestration.bookings.flightsearch.FareClass;
import com.defenestration.bookings.flightsearch.LegAirport;
import java.math.BigDecimal;
import java.time.Instant;

public record BookedSegment(
        int flightId,
        String flightNumber,
        LegAirport fromAirport,
        LegAirport toAirport,
        Instant departureAt,
        Instant arrivalAt,
        FareClass fareConditions,
        String seatNo,
        BigDecimal price) {
}
