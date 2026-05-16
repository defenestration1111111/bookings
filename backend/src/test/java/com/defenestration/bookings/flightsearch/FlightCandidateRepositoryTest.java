package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;

import com.defenestration.bookings.TestcontainersConfiguration;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

/**
 * Repository-level tests against the priced_leg_v view. See flight_search_small.sql
 * for the seeded routes/flights; assertions reference flight ids from that file.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Import(TestcontainersConfiguration.class)
@Sql("/db/fixtures/flight_search_small.sql")
class FlightCandidateRepositoryTest {

    private static final LocalDate DATE = LocalDate.of(2026, 6, 1);
    private static final int TOD_MIN = 0;
    private static final int TOD_MAX = 1439;
    private static final BigDecimal NO_PRICE_MIN = BigDecimal.ZERO;
    private static final BigDecimal NO_PRICE_MAX = new BigDecimal("9999999.99");
    private static final List<String> ALL_FARES = List.of("Economy", "Comfort", "Business");
    private static final int WIDE_MAX_TOTAL_MIN = 60 * 60;

    @Autowired
    private FlightCandidateRepository repository;

    @Test
    void searchDirectReturnsScheduledFlightsExpandedByFareClass() {
        List<ItineraryRow> rows = repository.searchDirect(
                "LHR", "JFK", DATE,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        // Scheduled direct flights are 1, 2, 3. Flight 4 is Cancelled and excluded by flight_leg_v.
        // Each appears once per fare class.
        assertThat(rows).hasSize(9);
        assertThat(distinctChains(rows)).containsExactlyInAnyOrder(
                List.of(1), List.of(2), List.of(3));
        assertThat(rows).allMatch(r -> r.getStopovers() == 0);
    }

    @Test
    void searchDirectFareClassFilterLimitsResults() {
        List<ItineraryRow> rows = repository.searchDirect(
                "LHR", "JFK", DATE,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, List.of("Economy"));

        assertThat(rows).hasSize(3);
        assertThat(rows).allMatch(r -> "Economy".equals(r.getFareClass()));
    }

    @Test
    void searchDirectPriceFilterDropsExpensiveFares() {
        // Direct LHR-JFK fares: Economy 500, Comfort 900, Business 2000.
        List<ItineraryRow> rows = repository.searchDirect(
                "LHR", "JFK", DATE,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, new BigDecimal("600"), ALL_FARES);

        assertThat(rows).hasSize(3);
        assertThat(rows).allMatch(r -> "Economy".equals(r.getFareClass()));
    }

    @Test
    void searchDirectDepartureTimeOfDayFilterExcludesEarlyAndLateFlights() {
        // dep_local_min at LHR (BST = UTC+1 in June):
        //   flight 1 → 11:00 → 660
        //   flight 2 → 15:00 → 900
        //   flight 3 → 23:00 → 1380
        // Window 800-1300 → only flight 2.
        List<ItineraryRow> rows = repository.searchDirect(
                "LHR", "JFK", DATE,
                800, 1300, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        assertThat(distinctChains(rows)).containsExactly(List.of(2));
    }

    @Test
    void searchDirectExcludesCancelledFlights() {
        // Direct sanity check: even with the widest filters, flight 4 (Cancelled) never appears.
        List<ItineraryRow> rows = repository.searchDirect(
                "LHR", "JFK", DATE,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        assertThat(distinctChains(rows)).doesNotContain(List.of(4));
    }

    @Test
    void searchOneStopReturnsAllReachableChains() {
        List<ItineraryRow> rows = repository.searchOneStop(
                "LHR", "JFK", DATE, WIDE_MAX_TOTAL_MIN,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        // Flight 8 arrives at 23:00Z on 2026-06-01; flight 12 departs at 16:00Z that same day,
        // so 8+12 is not a valid forward-in-time chain. Only 8+9 (next-morning departure) joins.
        // 5+7 is excluded by the 45-min minimum-connection JOIN predicate.
        assertThat(distinctChains(rows)).containsExactlyInAnyOrder(
                List.of(5, 6), List.of(5, 9), List.of(5, 12), List.of(8, 9));
        assertThat(rows).allMatch(r -> r.getStopovers() == 1);
    }

    @Test
    void searchOneStopExcludesConnectionsShorterThanFortyFiveMinutes() {
        // Flight 7 leaves AMS 20 minutes after flight 5 lands → JOIN predicate excludes it.
        List<ItineraryRow> rows = repository.searchOneStop(
                "LHR", "JFK", DATE, WIDE_MAX_TOTAL_MIN,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        assertThat(distinctChains(rows)).doesNotContain(List.of(5, 7));
    }

    @Test
    void searchOneStopRespectsMaxTotalMinutes() {
        // 5+6 total = 10.5h = 630 min; all other chains are longer. Cap at 720 → only 5+6.
        List<ItineraryRow> rows = repository.searchOneStop(
                "LHR", "JFK", DATE, 720,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        assertThat(distinctChains(rows)).containsExactly(List.of(5, 6));
    }

    @Test
    void searchOneStopPriceFilterAppliesToSumOfLegPrices() {
        // Economy leg prices: LHR-AMS 100 + AMS-JFK 400 = 500.
        // Comfort: 200 + 800 = 1000. Business: 400 + 1800 = 2200.
        // priceMax 600 → only Economy chains pass.
        List<ItineraryRow> rows = repository.searchOneStop(
                "LHR", "JFK", DATE, WIDE_MAX_TOTAL_MIN,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, new BigDecimal("600"), ALL_FARES);

        assertThat(rows).allMatch(r -> "Economy".equals(r.getFareClass()));
    }

    @Test
    void searchTwoStopReturnsLhrCdgAmsJfkChains() {
        List<ItineraryRow> rows = repository.searchTwoStop(
                "LHR", "JFK", DATE, WIDE_MAX_TOTAL_MIN,
                TOD_MIN, TOD_MAX, TOD_MIN, TOD_MAX,
                NO_PRICE_MIN, NO_PRICE_MAX, ALL_FARES);

        // Two-stop ingredients in the fixture chain LHR→CDG→AMS→JFK. Last leg can be flight 9
        // (next-morning, 17.5h layover at AMS) or flight 12 (90-min layover at AMS).
        assertThat(distinctChains(rows)).containsExactlyInAnyOrder(
                List.of(10, 11, 9), List.of(10, 11, 12));
        assertThat(rows).allMatch(r -> r.getStopovers() == 2);
    }

    private static List<List<Integer>> distinctChains(List<ItineraryRow> rows) {
        return rows.stream()
                .map(r -> Arrays.asList(r.getFlightIds()))
                .distinct()
                .toList();
    }
}
