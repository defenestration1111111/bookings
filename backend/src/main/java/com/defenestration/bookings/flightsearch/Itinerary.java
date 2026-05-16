package com.defenestration.bookings.flightsearch;

import java.math.BigDecimal;
import java.util.List;

public record Itinerary(
        String id,
        FareClass fareClass,
        BigDecimal price,
        String currency,
        int totalTripTimeMinutes,
        int flightTimeMinutes,
        int totalLayoverMinutes,
        int stopovers,
        List<Leg> legs) {
}
