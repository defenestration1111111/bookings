package com.defenestration.bookings.seatmap.service;

import com.defenestration.bookings.common.FlightStatus;
import com.defenestration.bookings.seatmap.dto.SeatMapResponse;
import com.defenestration.bookings.seatmap.exception.FlightNotFoundException;
import com.defenestration.bookings.seatmap.exception.FlightNotSelectableException;
import com.defenestration.bookings.seatmap.repository.SeatMapContextRow;
import com.defenestration.bookings.seatmap.repository.SeatMapRepository;
import com.defenestration.bookings.seatmap.repository.SeatRow;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SeatMapService {

    private final SeatMapRepository repository;
    private final SeatMapAssembler assembler;

    public SeatMapService(SeatMapRepository repository, SeatMapAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    public SeatMapResponse getSeatMap(int flightId) {
        SeatMapContextRow ctx = repository.findContext(flightId)
                .orElseThrow(() -> new FlightNotFoundException(flightId));

        if (!FlightStatus.BOOKABLE_SQL_VALUES.contains(ctx.getStatus())) {
            throw new FlightNotSelectableException(flightId, ctx.getStatus());
        }

        List<SeatRow> seats = repository.findSeats(flightId);
        return assembler.assemble(ctx, seats);
    }
}
