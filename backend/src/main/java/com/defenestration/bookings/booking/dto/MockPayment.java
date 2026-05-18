package com.defenestration.bookings.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MockPayment(
        @NotBlank @Pattern(regexp = "^[0-9 ]{12,23}$") String cardNumber,
        @NotBlank @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$") String expiration,
        @NotBlank @Pattern(regexp = "^[0-9]{3,4}$") String cvv) {
}
