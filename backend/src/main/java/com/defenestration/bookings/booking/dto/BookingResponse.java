package com.defenestration.bookings.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record BookingResponse(
        String bookRef,
        Instant bookDate,
        BigDecimal totalAmount,
        String currency,
        PassengerInfo passenger,
        String ticketNo,
        List<BookedSegment> segments) {
}
