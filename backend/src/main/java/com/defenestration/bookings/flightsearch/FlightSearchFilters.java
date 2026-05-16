package com.defenestration.bookings.flightsearch;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;

public record FlightSearchFilters(
        @Valid PriceRange priceRange,
        List<FareClass> fareClasses,
        @Valid MinuteRange departureMinutesRange,
        @Valid MinuteRange arrivalMinutesRange,
        @Min(0) @Max(2) Integer maxStopovers,
        @Min(1) @Max(60) Integer maxTotalTravelTimeHours) {
}
