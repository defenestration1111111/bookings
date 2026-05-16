package com.defenestration.bookings.flightsearch;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record FlightSearchRequest(
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String origin,
        @NotBlank @Pattern(regexp = "^[A-Z]{3}$") String destination,
        @NotNull LocalDate departureDate,
        @Min(1) @Max(9) Integer passengerCount,
        SortBy sortBy,
        @Min(0) Integer page,
        @Min(1) @Max(50) Integer pageSize,
        @Valid FlightSearchFilters filters) {
}
