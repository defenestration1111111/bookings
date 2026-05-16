package com.defenestration.bookings.flightsearch;

import java.time.Instant;

public interface LegDetailRow {

    Integer getFlightId();

    String getFlightNumber();

    String getFromCode();

    String getFromCity();

    String getToCode();

    String getToCity();

    Instant getDepartureAt();

    Instant getArrivalAt();

    Integer getDurationMinutes();

    Boolean getNextDayArrival();
}
