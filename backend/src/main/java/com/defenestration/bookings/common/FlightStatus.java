package com.defenestration.bookings.common;

import java.util.Set;
import java.util.stream.Collectors;

public enum FlightStatus {
    SCHEDULED("Scheduled"),
    ON_TIME("On Time"),
    DELAYED("Delayed"),
    BOARDING("Boarding"),
    DEPARTED("Departed"),
    ARRIVED("Arrived"),
    CANCELLED("Cancelled");

    public static final Set<String> BOOKABLE_SQL_VALUES =
            Set.of(SCHEDULED, ON_TIME, DELAYED, BOARDING).stream()
                    .map(FlightStatus::sqlValue)
                    .collect(Collectors.toUnmodifiableSet());

    private final String sqlValue;

    FlightStatus(String sqlValue) {
        this.sqlValue = sqlValue;
    }

    public String sqlValue() {
        return sqlValue;
    }
}
