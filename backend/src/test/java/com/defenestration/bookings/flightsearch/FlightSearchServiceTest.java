package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

class FlightSearchServiceTest {

    private static final LocalDate DATE = LocalDate.of(2026, 6, 1);

    private final FlightCandidateRepository repository = mock(FlightCandidateRepository.class);
    private final ItineraryAssembler assembler = mock(ItineraryAssembler.class);
    private final FlightSearchService service = new FlightSearchService(repository, assembler);

    @Test
    void searchSkipsOneStopAndTwoStopWhenMaxStopoversIsZero() {
        FlightSearchRequest request = req(filtersWithMaxStopovers(0), null, null, null);
        when(repository.searchDirect(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any())).thenReturn(List.of());
        when(assembler.assemble(any())).thenReturn(List.of());

        service.search(request);

        verify(repository).searchDirect(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any());
        // No one-stop or two-stop calls.
        verify(repository, org.mockito.Mockito.never())
                .searchOneStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                        any(), any(), any());
        verify(repository, org.mockito.Mockito.never())
                .searchTwoStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                        any(), any(), any());
    }

    @Test
    void searchCallsOneStopWhenMaxStopoversIsOneButNotTwoStop() {
        FlightSearchRequest request = req(filtersWithMaxStopovers(1), null, null, null);
        stubAllRepoCallsReturnEmpty();
        when(assembler.assemble(any())).thenReturn(List.of());

        service.search(request);

        verify(repository).searchOneStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any());
        verify(repository, org.mockito.Mockito.never())
                .searchTwoStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                        any(), any(), any());
    }

    @Test
    void searchCallsAllThreeWhenMaxStopoversIsTwo() {
        FlightSearchRequest request = req(filtersWithMaxStopovers(2), null, null, null);
        stubAllRepoCallsReturnEmpty();
        when(assembler.assemble(any())).thenReturn(List.of());

        service.search(request);

        verify(repository).searchDirect(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any());
        verify(repository).searchOneStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any());
        verify(repository).searchTwoStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any());
    }

    @Test
    void cheapestFareWinsWhenSameChainAppearsMultipleTimes() {
        ItineraryRow expensive = row(new Integer[]{1, 2}, "Business", "500", 200, Instant.EPOCH);
        ItineraryRow cheap = row(new Integer[]{1, 2}, "Economy", "150", 200, Instant.EPOCH);
        stubDirectReturns(List.of(expensive, cheap));
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        service.search(req(filtersWithMaxStopovers(0), null, null, null));

        List<ItineraryRow> ranked = captor.getValue();
        assertThat(ranked).hasSize(1);
        assertThat(ranked.get(0).getPrice()).isEqualByComparingTo("150");
        assertThat(ranked.get(0).getFareClass()).isEqualTo("Economy");
    }

    @Test
    void chainsWithDifferentFlightIdsAreNotMerged() {
        ItineraryRow chainA = row(new Integer[]{1, 2}, "Economy", "150", 200, Instant.EPOCH);
        ItineraryRow chainB = row(new Integer[]{1, 3}, "Economy", "200", 200, Instant.EPOCH);
        stubDirectReturns(List.of(chainA, chainB));
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        service.search(req(filtersWithMaxStopovers(0), null, null, null));

        assertThat(captor.getValue()).hasSize(2);
    }

    @Test
    void rankingUsesSortByComparator() {
        ItineraryRow a = row(new Integer[]{1}, "Economy", "300", 200, Instant.EPOCH);
        ItineraryRow b = row(new Integer[]{2}, "Economy", "100", 200, Instant.EPOCH);
        ItineraryRow c = row(new Integer[]{3}, "Economy", "200", 200, Instant.EPOCH);
        stubDirectReturns(List.of(a, b, c));
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        service.search(req(filtersWithMaxStopovers(0), SortBy.PRICE_DESC, null, null));

        List<ItineraryRow> ranked = captor.getValue();
        assertThat(ranked).extracting(ItineraryRow::getPrice)
                .containsExactly(new BigDecimal("300"), new BigDecimal("200"), new BigDecimal("100"));
    }

    @Test
    void tiebreakerIsLexicographicByFlightIds() {
        ItineraryRow chainHigh = row(new Integer[]{5, 6}, "Economy", "150", 200, Instant.EPOCH);
        ItineraryRow chainLow = row(new Integer[]{1, 2}, "Economy", "150", 200, Instant.EPOCH);
        stubDirectReturns(List.of(chainHigh, chainLow));
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        service.search(req(filtersWithMaxStopovers(0), SortBy.PRICE_ASC, null, null));

        List<ItineraryRow> ranked = captor.getValue();
        assertThat(ranked.get(0).getFlightIds()).containsExactly(1, 2);
        assertThat(ranked.get(1).getFlightIds()).containsExactly(5, 6);
    }

    @Test
    void cappedAtTwoHundredCandidates() {
        // 250 distinct chains → rankAndCap clamps to 200 → totalResults reflects the cap.
        // (The captor would only see the paginated slice, so totalResults is the right signal.)
        List<ItineraryRow> manyDistinctChains = IntStream.range(0, 250)
                .mapToObj(i -> row(new Integer[]{i}, "Economy", String.valueOf(i + 1), 200, Instant.EPOCH))
                .toList();
        stubDirectReturns(manyDistinctChains);
        when(assembler.assemble(any())).thenReturn(List.of());

        FlightSearchResponse resp = service.search(req(filtersWithMaxStopovers(0), SortBy.PRICE_ASC, null, null));

        assertThat(resp.totalResults()).isEqualTo(200);
    }

    @Test
    void emptyCandidatesReturnsEmptyResponseWithZeroPages() {
        stubAllRepoCallsReturnEmpty();
        when(assembler.assemble(any())).thenReturn(List.of());

        FlightSearchResponse resp = service.search(req(null, null, null, null));

        assertThat(resp.totalResults()).isZero();
        assertThat(resp.totalPages()).isZero();
        assertThat(resp.results()).isEmpty();
    }

    @Test
    void paginationMathFirstPage() {
        List<ItineraryRow> ranked = manyChains(47);
        stubDirectReturns(ranked);
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        FlightSearchResponse resp = service.search(req(filtersWithMaxStopovers(0), null, 0, 20));

        assertThat(resp.totalResults()).isEqualTo(47);
        assertThat(resp.totalPages()).isEqualTo(3);
        assertThat(captor.getValue()).hasSize(20);
    }

    @Test
    void paginationMathLastPagePartial() {
        List<ItineraryRow> ranked = manyChains(47);
        stubDirectReturns(ranked);
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        FlightSearchResponse resp = service.search(req(filtersWithMaxStopovers(0), null, 2, 20));

        assertThat(resp.totalResults()).isEqualTo(47);
        assertThat(resp.totalPages()).isEqualTo(3);
        assertThat(captor.getValue()).hasSize(7);
    }

    @Test
    void paginationPastEndYieldsEmptySliceButCorrectTotals() {
        List<ItineraryRow> ranked = manyChains(47);
        stubDirectReturns(ranked);
        ArgumentCaptor<List<ItineraryRow>> captor = captureAssembleInput();

        FlightSearchResponse resp = service.search(req(filtersWithMaxStopovers(0), null, 10, 20));

        assertThat(resp.totalResults()).isEqualTo(47);
        assertThat(resp.totalPages()).isEqualTo(3);
        assertThat(captor.getValue()).isEmpty();
    }

    @Test
    void pageSizeLargerThanTotalCollapsesToOnePage() {
        List<ItineraryRow> ranked = manyChains(5);
        stubDirectReturns(ranked);
        when(assembler.assemble(any())).thenReturn(List.of());

        FlightSearchResponse resp = service.search(req(filtersWithMaxStopovers(0), null, 0, 50));

        assertThat(resp.totalResults()).isEqualTo(5);
        assertThat(resp.totalPages()).isEqualTo(1);
    }

    private FlightSearchRequest req(FlightSearchFilters filters, SortBy sort, Integer page, Integer pageSize) {
        return new FlightSearchRequest("LHR", "JFK", DATE, 1, sort, page, pageSize, filters);
    }

    private static FlightSearchFilters filtersWithMaxStopovers(int max) {
        return new FlightSearchFilters(null, null, null, null, max, null);
    }

    private void stubAllRepoCallsReturnEmpty() {
        lenient().when(repository.searchDirect(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any())).thenReturn(List.of());
        lenient().when(repository.searchOneStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any())).thenReturn(List.of());
        lenient().when(repository.searchTwoStop(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any())).thenReturn(List.of());
    }

    private void stubDirectReturns(List<ItineraryRow> rows) {
        lenient().when(repository.searchDirect(any(), any(), any(), anyInt(), anyInt(), anyInt(), anyInt(),
                any(), any(), any())).thenReturn(rows);
    }

    @SuppressWarnings("unchecked")
    private ArgumentCaptor<List<ItineraryRow>> captureAssembleInput() {
        ArgumentCaptor<List<ItineraryRow>> captor = ArgumentCaptor.forClass(List.class);
        when(assembler.assemble(captor.capture())).thenReturn(List.of());
        return captor;
    }

    private static List<ItineraryRow> manyChains(int n) {
        List<ItineraryRow> out = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            out.add(row(new Integer[]{i}, "Economy", String.valueOf(i + 1), 200, Instant.EPOCH));
        }
        return out;
    }

    private static ItineraryRow row(Integer[] flightIds, String fareClass, String price,
                                    int totalTrip, Instant firstDep) {
        ItineraryRow r = mock(ItineraryRow.class);
        lenient().when(r.getFlightIds()).thenReturn(flightIds);
        lenient().when(r.getFareClass()).thenReturn(fareClass);
        lenient().when(r.getPrice()).thenReturn(new BigDecimal(price));
        lenient().when(r.getTotalTripTimeMinutes()).thenReturn(totalTrip);
        lenient().when(r.getFirstDepartureAt()).thenReturn(firstDep);
        return r;
    }
}
