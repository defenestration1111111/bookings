package com.defenestration.bookings.booking.exception;

import com.defenestration.bookings.booking.dto.SeatConflict;
import java.util.List;

public class SeatConflictException extends RuntimeException {

    private final List<SeatConflict> conflicts;

    public SeatConflictException(List<SeatConflict> conflicts) {
        super("Booking conflict: " + conflicts.size() + " seat(s) or flight(s) unavailable.");
        this.conflicts = List.copyOf(conflicts);
    }

    public List<SeatConflict> conflicts() {
        return conflicts;
    }
}
