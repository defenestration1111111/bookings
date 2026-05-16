package com.defenestration.bookings.flightsearch;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flights")
public class FlightSearchController {

    private final FlightSearchService service;

    public FlightSearchController(FlightSearchService service) {
        this.service = service;
    }

    @PostMapping("/search")
    public FlightSearchResponse search(@Valid @RequestBody FlightSearchRequest request) {
        return service.search(request);
    }
}
