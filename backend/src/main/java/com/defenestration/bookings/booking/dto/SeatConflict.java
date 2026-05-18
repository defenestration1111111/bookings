package com.defenestration.bookings.booking.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public record SeatConflict(
        int flightId,
        @JsonInclude(JsonInclude.Include.NON_NULL) String seatNo,
        Reason reason) {

    public enum Reason {
        @JsonProperty("seatTaken") SEAT_TAKEN,
        @JsonProperty("flightNotBookable") FLIGHT_NOT_BOOKABLE
    }

    public static SeatConflict seatTaken(int flightId, String seatNo) {
        return new SeatConflict(flightId, seatNo, Reason.SEAT_TAKEN);
    }

    public static SeatConflict flightNotBookable(int flightId) {
        return new SeatConflict(flightId, null, Reason.FLIGHT_NOT_BOOKABLE);
    }
}
