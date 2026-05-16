package com.defenestration.bookings.flightsearch;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class FlightSearchService {

    private static final int CANDIDATE_CAP = 200;

    private final FlightCandidateRepository repository;
    private final ItineraryAssembler assembler;

    public FlightSearchService(FlightCandidateRepository repository, ItineraryAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    public FlightSearchResponse search(FlightSearchRequest request) {
        ResolvedFilters filters = ResolvedFilters.from(request);
        List<ItineraryRow> candidates = fetchCandidates(request, filters);
        List<ItineraryRow> ranked = rankAndCap(candidates, filters.sort());
        return buildResponse(ranked, filters.page(), filters.pageSize());
    }

    private List<ItineraryRow> fetchCandidates(FlightSearchRequest request, ResolvedFilters f) {
        List<ItineraryRow> out = new ArrayList<>(repository.searchDirect(
                request.origin(), request.destination(), request.departureDate(),
                f.depTodMin(), f.depTodMax(), f.arrTodMin(), f.arrTodMax(),
                f.priceMin(), f.priceMax(), f.allowedFareConditions()));
        if (f.maxStopovers() >= 1) {
            out.addAll(repository.searchOneStop(
                    request.origin(), request.destination(), request.departureDate(),
                    f.maxTotalMinutes(),
                    f.depTodMin(), f.depTodMax(), f.arrTodMin(), f.arrTodMax(),
                    f.priceMin(), f.priceMax(), f.allowedFareConditions()));
        }
        if (f.maxStopovers() >= 2) {
            out.addAll(repository.searchTwoStop(
                    request.origin(), request.destination(), request.departureDate(),
                    f.maxTotalMinutes(),
                    f.depTodMin(), f.depTodMax(), f.arrTodMin(), f.arrTodMax(),
                    f.priceMin(), f.priceMax(), f.allowedFareConditions()));
        }
        return out;
    }

    /**
     * For each distinct flight chain, keep only the cheapest qualifying fare class, then sort
     * and cap. Mirrors the SQL `DISTINCT ON (flight_ids) ORDER BY ... LIMIT 200` the splits replaced.
     */
    private static List<ItineraryRow> rankAndCap(List<ItineraryRow> candidates, SortBy sort) {
        Map<List<Integer>, ItineraryRow> cheapestByCombo = candidates.stream().collect(Collectors.toMap(
                r -> Arrays.asList(r.getFlightIds()),
                Function.identity(),
                (a, b) -> a.getPrice().compareTo(b.getPrice()) <= 0 ? a : b,
                LinkedHashMap::new));

        Comparator<ItineraryRow> cmp = sort.comparator()
                .thenComparing(ItineraryRow::getFlightIds, Arrays::compare);

        return cheapestByCombo.values().stream()
                .sorted(cmp)
                .limit(CANDIDATE_CAP)
                .toList();
    }

    private FlightSearchResponse buildResponse(List<ItineraryRow> ranked, int page, int pageSize) {
        int totalResults = ranked.size();
        int totalPages = totalResults == 0 ? 0 : (totalResults + pageSize - 1) / pageSize;
        int from = Math.min(page * pageSize, totalResults);
        int to = Math.min(from + pageSize, totalResults);
        List<Itinerary> items = assembler.assemble(ranked.subList(from, to));
        return new FlightSearchResponse(page, pageSize, totalResults, totalPages, items);
    }
}
