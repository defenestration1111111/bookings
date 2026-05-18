package com.defenestration.bookings.seatmap.controller;

import com.defenestration.bookings.seatmap.dto.SeatMapResponse;
import com.defenestration.bookings.seatmap.service.SeatMapService;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flights")
@Validated
public class SeatMapController {

    private final SeatMapService service;

    public SeatMapController(SeatMapService service) {
        this.service = service;
    }

    @GetMapping("/{flightId}/seats")
    public SeatMapResponse getSeatMap(@PathVariable("flightId") @Min(1) int flightId) {
        return service.getSeatMap(flightId);
    }
}
