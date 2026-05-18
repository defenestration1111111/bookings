package com.defenestration.bookings.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PassengerInfo(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName) {
}
