package com.defenestration.bookings.flightsearch;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Comparator;

public enum SortBy {
    @JsonProperty("priceAsc") PRICE_ASC(Comparator.comparing(ItineraryRow::getPrice)),
    @JsonProperty("priceDesc") PRICE_DESC(Comparator.comparing(ItineraryRow::getPrice).reversed()),
    @JsonProperty("durationAsc") DURATION_ASC(Comparator.comparingInt(ItineraryRow::getTotalTripTimeMinutes)),
    @JsonProperty("departureAsc") DEPARTURE_ASC(Comparator.comparing(ItineraryRow::getFirstDepartureAt));

    private final Comparator<ItineraryRow> comparator;

    SortBy(Comparator<ItineraryRow> comparator) {
        this.comparator = comparator;
    }

    public Comparator<ItineraryRow> comparator() {
        return comparator;
    }
}
