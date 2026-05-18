package com.defenestration.bookings.booking.exception;

import java.util.List;

public class UnknownFlightException extends RuntimeException {

    private final List<Integer> flightIds;

    public UnknownFlightException(List<Integer> flightIds) {
        super("Unknown flight id(s): " + flightIds);
        this.flightIds = List.copyOf(flightIds);
    }

    public List<Integer> flightIds() {
        return flightIds;
    }
}
