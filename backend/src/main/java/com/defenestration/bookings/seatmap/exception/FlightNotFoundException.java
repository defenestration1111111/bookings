package com.defenestration.bookings.seatmap.exception;

public class FlightNotFoundException extends RuntimeException {

    private final int flightId;

    public FlightNotFoundException(int flightId) {
        super("Flight " + flightId + " not found.");
        this.flightId = flightId;
    }

    public int flightId() {
        return flightId;
    }
}
