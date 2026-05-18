package com.defenestration.bookings.booking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record BookingRequest(
        @NotNull @Valid PassengerInfo passenger,
        @NotNull @Size(min = 1, max = 3) @Valid List<BookingLegRequest> legs,
        @NotNull @Valid MockPayment payment) {
}
