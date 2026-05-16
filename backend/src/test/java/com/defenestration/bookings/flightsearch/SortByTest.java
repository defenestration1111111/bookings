package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;

class SortByTest {

    private static ItineraryRow row(String label, BigDecimal price, int durationMinutes, Instant depAt) {
        ItineraryRow r = mock(ItineraryRow.class, label);
        lenient().when(r.getPrice()).thenReturn(price);
        lenient().when(r.getTotalTripTimeMinutes()).thenReturn(durationMinutes);
        lenient().when(r.getFirstDepartureAt()).thenReturn(depAt);
        return r;
    }

    @Test
    void priceAscOrdersByPriceCheapestFirst() {
        ItineraryRow a = row("a", new BigDecimal("300"), 0, Instant.EPOCH);
        ItineraryRow b = row("b", new BigDecimal("100"), 0, Instant.EPOCH);
        ItineraryRow c = row("c", new BigDecimal("200"), 0, Instant.EPOCH);

        List<ItineraryRow> sorted = List.of(a, b, c).stream().sorted(SortBy.PRICE_ASC.comparator()).toList();

        assertThat(sorted).containsExactly(b, c, a);
    }

    @Test
    void priceDescOrdersByPriceExpensiveFirst() {
        ItineraryRow a = row("a", new BigDecimal("300"), 0, Instant.EPOCH);
        ItineraryRow b = row("b", new BigDecimal("100"), 0, Instant.EPOCH);
        ItineraryRow c = row("c", new BigDecimal("200"), 0, Instant.EPOCH);

        List<ItineraryRow> sorted = List.of(a, b, c).stream().sorted(SortBy.PRICE_DESC.comparator()).toList();

        assertThat(sorted).containsExactly(a, c, b);
    }

    @Test
    void durationAscOrdersByTotalTripTime() {
        ItineraryRow a = row("a", BigDecimal.ONE, 500, Instant.EPOCH);
        ItineraryRow b = row("b", BigDecimal.ONE, 120, Instant.EPOCH);
        ItineraryRow c = row("c", BigDecimal.ONE, 300, Instant.EPOCH);

        List<ItineraryRow> sorted = List.of(a, b, c).stream().sorted(SortBy.DURATION_ASC.comparator()).toList();

        assertThat(sorted).containsExactly(b, c, a);
    }

    @Test
    void departureAscOrdersByFirstDepartureChronologically() {
        Instant t0 = Instant.parse("2026-06-01T08:00:00Z");
        Instant t1 = Instant.parse("2026-06-01T12:00:00Z");
        Instant t2 = Instant.parse("2026-06-01T22:00:00Z");
        ItineraryRow a = row("a", BigDecimal.ONE, 0, t2);
        ItineraryRow b = row("b", BigDecimal.ONE, 0, t0);
        ItineraryRow c = row("c", BigDecimal.ONE, 0, t1);

        List<ItineraryRow> sorted = List.of(a, b, c).stream().sorted(SortBy.DEPARTURE_ASC.comparator()).toList();

        assertThat(sorted).containsExactly(b, c, a);
    }
}
