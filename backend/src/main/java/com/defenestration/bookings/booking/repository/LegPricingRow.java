package com.defenestration.bookings.booking.repository;

import java.math.BigDecimal;
import java.time.Instant;

public interface LegPricingRow {

    int getFlightId();

    String getSeatNo();

    /** Null when the flight id does not exist. */
    String getStatus();

    String getFlightNumber();

    String getFromCode();

    String getFromCity();

    String getToCode();

    String getToCity();

    Instant getDepartureAt();

    Instant getArrivalAt();

    /** Null when the seat does not exist on the airframe for this flight's route. */
    String getFareConditions();

    /** Null when no route_fares row covers this (route, fare_conditions). */
    BigDecimal getPrice();
}
