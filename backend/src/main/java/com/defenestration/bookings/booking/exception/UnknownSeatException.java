package com.defenestration.bookings.booking.exception;

public class UnknownSeatException extends RuntimeException {

    private final int flightId;
    private final String seatNo;

    public UnknownSeatException(int flightId, String seatNo) {
        super("Seat " + seatNo + " does not exist on the aircraft for flight " + flightId + ".");
        this.flightId = flightId;
        this.seatNo = seatNo;
    }

    public int flightId() {
        return flightId;
    }

    public String seatNo() {
        return seatNo;
    }
}
