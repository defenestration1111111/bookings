package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class ResolvedFiltersTest {

    private static final LocalDate ANY_DATE = LocalDate.of(2026, 6, 1);

    private static FlightSearchRequest request(SortBy sort, Integer page, Integer pageSize, FlightSearchFilters filters) {
        return new FlightSearchRequest("LHR", "JFK", ANY_DATE, 1, sort, page, pageSize, filters);
    }

    @Test
    void nullFiltersAppliesAllDefaults() {
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, null));

        assertThat(r.maxStopovers()).isEqualTo(2);
        assertThat(r.maxTotalMinutes()).isEqualTo(60 * 60);
        assertThat(r.depTodMin()).isEqualTo(0);
        assertThat(r.depTodMax()).isEqualTo(1439);
        assertThat(r.arrTodMin()).isEqualTo(0);
        assertThat(r.arrTodMax()).isEqualTo(1439);
        assertThat(r.priceMin()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(r.priceMax()).isEqualByComparingTo(new BigDecimal("9999999.99"));
        assertThat(r.sort()).isEqualTo(SortBy.PRICE_ASC);
        assertThat(r.page()).isZero();
        assertThat(r.pageSize()).isEqualTo(20);
    }

    @Test
    void nullFareClassesFallsBackToAllSqlValues() {
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, null));
        assertThat(r.allowedFareConditions()).containsExactlyInAnyOrder("Economy", "Comfort", "Business");
    }

    @Test
    void emptyFareClassesFallsBackToAllSqlValues() {
        FlightSearchFilters f = new FlightSearchFilters(null, List.of(), null, null, null, null);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.allowedFareConditions()).containsExactlyInAnyOrder("Economy", "Comfort", "Business");
    }

    @Test
    void partialFareClassesMapsToSqlValues() {
        FlightSearchFilters f = new FlightSearchFilters(
                null, List.of(FareClass.ECONOMY, FareClass.BUSINESS), null, null, null, null);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.allowedFareConditions()).containsExactly("Economy", "Business");
    }

    @Test
    void explicitSortPageAndPageSizeOverrideDefaults() {
        ResolvedFilters r = ResolvedFilters.from(request(SortBy.DURATION_ASC, 3, 50, null));
        assertThat(r.sort()).isEqualTo(SortBy.DURATION_ASC);
        assertThat(r.page()).isEqualTo(3);
        assertThat(r.pageSize()).isEqualTo(50);
    }

    @Test
    void priceRangePropagated() {
        FlightSearchFilters f = new FlightSearchFilters(
                new PriceRange(new BigDecimal("100"), new BigDecimal("500")),
                null, null, null, null, null);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.priceMin()).isEqualByComparingTo("100");
        assertThat(r.priceMax()).isEqualByComparingTo("500");
    }

    @Test
    void minuteRangesPropagated() {
        FlightSearchFilters f = new FlightSearchFilters(
                null, null, new MinuteRange(360, 720), new MinuteRange(1080, 1300),
                null, null);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.depTodMin()).isEqualTo(360);
        assertThat(r.depTodMax()).isEqualTo(720);
        assertThat(r.arrTodMin()).isEqualTo(1080);
        assertThat(r.arrTodMax()).isEqualTo(1300);
    }

    @Test
    void maxTotalTravelTimeConvertedToMinutes() {
        FlightSearchFilters f = new FlightSearchFilters(null, null, null, null, null, 12);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.maxTotalMinutes()).isEqualTo(12 * 60);
    }

    @Test
    void maxStopoversClampedToTwo() {
        // Request bean validation caps at @Max(2), but ResolvedFilters also enforces it defensively.
        FlightSearchFilters f = new FlightSearchFilters(null, null, null, null, 5, null);
        ResolvedFilters r = ResolvedFilters.from(request(null, null, null, f));
        assertThat(r.maxStopovers()).isEqualTo(2);
    }

}
