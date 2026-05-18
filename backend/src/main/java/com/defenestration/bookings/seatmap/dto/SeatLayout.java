package com.defenestration.bookings.seatmap.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record SeatLayout(
        List<String> columns,
        @JsonProperty("aisles_after") List<String> aislesAfter) {
}
