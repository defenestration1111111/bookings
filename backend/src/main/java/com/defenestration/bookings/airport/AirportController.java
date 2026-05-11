package com.defenestration.bookings.airport;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/airports")
@Validated
public class AirportController {

    private final AirportService service;

    public AirportController(AirportService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<AirportSummary> search(
            @RequestParam("q") @Size(max = 100) String q,
            @RequestParam(value = "limit", defaultValue = "10") @Min(1) @Max(50) int limit) {
        return service.search(q, limit);
    }
}
