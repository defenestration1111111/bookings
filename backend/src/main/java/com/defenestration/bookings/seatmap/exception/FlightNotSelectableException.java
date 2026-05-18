package com.defenestration.bookings.seatmap.exception;

public class FlightNotSelectableException extends RuntimeException {

    private final int flightId;
    private final String currentStatus;

    public FlightNotSelectableException(int flightId, String currentStatus) {
        super("Flight " + flightId + " is in status '" + currentStatus
                + "' and does not allow seat selection.");
        this.flightId = flightId;
        this.currentStatus = currentStatus;
    }

    public int flightId() {
        return flightId;
    }

    public String currentStatus() {
        return currentStatus;
    }
}
