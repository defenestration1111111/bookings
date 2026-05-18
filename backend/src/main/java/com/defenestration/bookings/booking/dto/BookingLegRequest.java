package com.defenestration.bookings.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record BookingLegRequest(
        @NotNull @Min(1) Integer flightId,
        @NotBlank @Pattern(regexp = "^[0-9]+[A-Z]$") String seatNo) {
}
