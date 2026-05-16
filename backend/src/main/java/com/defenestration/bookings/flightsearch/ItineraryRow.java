package com.defenestration.bookings.flightsearch;

import java.math.BigDecimal;
import java.time.Instant;

public interface ItineraryRow {

    Integer[] getFlightIds();

    String getFareClass();

    BigDecimal getPrice();

    Integer getTotalTripTimeMinutes();

    Integer getFlightTimeMinutes();

    Integer getTotalLayoverMinutes();

    Integer getStopovers();

    Instant getFirstDepartureAt();
}
