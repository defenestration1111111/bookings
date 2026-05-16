package com.defenestration.bookings.flightsearch;

import java.util.List;

public record FlightSearchResponse(
        int page,
        int pageSize,
        int totalResults,
        int totalPages,
        List<Itinerary> results) {
}
