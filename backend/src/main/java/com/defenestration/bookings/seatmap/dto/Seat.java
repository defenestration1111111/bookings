package com.defenestration.bookings.seatmap.dto;

import com.defenestration.bookings.flightsearch.FareClass;
import java.math.BigDecimal;

public record Seat(
        String id,
        int row,
        String letter,
        FareClass seatClass,
        boolean unavailable,
        BigDecimal price) {
}
