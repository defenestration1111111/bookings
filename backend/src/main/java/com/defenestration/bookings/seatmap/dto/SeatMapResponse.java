package com.defenestration.bookings.seatmap.dto;

import java.util.List;

public record SeatMapResponse(
        AirplaneSummary airplane,
        SeatLayout layout,
        List<Seat> seats) {
}
