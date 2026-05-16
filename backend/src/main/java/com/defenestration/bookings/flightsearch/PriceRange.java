package com.defenestration.bookings.flightsearch;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PriceRange(
        @NotNull @DecimalMin("0") BigDecimal min,
        @NotNull @DecimalMin("0") BigDecimal max) {
}
