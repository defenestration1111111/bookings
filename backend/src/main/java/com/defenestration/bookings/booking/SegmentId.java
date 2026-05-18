package com.defenestration.bookings.booking;

import java.io.Serializable;
import java.util.Objects;

public class SegmentId implements Serializable {

    private String ticketNo;
    private Integer flightId;

    public SegmentId() {
    }

    public SegmentId(String ticketNo, Integer flightId) {
        this.ticketNo = ticketNo;
        this.flightId = flightId;
    }

    public String getTicketNo() {
        return ticketNo;
    }

    public Integer getFlightId() {
        return flightId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SegmentId other)) return false;
        return Objects.equals(ticketNo, other.ticketNo)
                && Objects.equals(flightId, other.flightId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ticketNo, flightId);
    }
}
