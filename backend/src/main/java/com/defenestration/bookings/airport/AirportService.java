package com.defenestration.bookings.airport;

import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class AirportService {

    private static final int MIN_FUZZY_LENGTH = 3;

    private final AirportRepository repository;

    public AirportService(AirportRepository repository) {
        this.repository = repository;
    }

    public List<AirportSummary> search(String q, int limit) {
        String normalized = q == null ? "" : q.strip();
        if (normalized.isEmpty()) {
            return repository.topByCity(limit);
        }
        String codeQ = normalized.toUpperCase(Locale.ROOT);
        boolean enableFuzzy = normalized.length() >= MIN_FUZZY_LENGTH;
        return repository.search(normalized, codeQ, enableFuzzy, limit);
    }
}
