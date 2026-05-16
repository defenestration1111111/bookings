package com.defenestration.bookings.flightsearch;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MinuteRange(
        @NotNull @Min(0) @Max(1439) Integer min,
        @NotNull @Min(0) @Max(1439) Integer max) {
}
