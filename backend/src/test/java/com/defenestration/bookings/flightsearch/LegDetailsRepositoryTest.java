package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;

import com.defenestration.bookings.TestcontainersConfiguration;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase.Replace;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Import(TestcontainersConfiguration.class)
@Sql("/db/fixtures/flight_search_small.sql")
class LegDetailsRepositoryTest {

    @Autowired
    private LegDetailsRepository repository;

    @Test
    void returnsSingleLegForSingleFlightId() {
        List<LegDetailRow> rows = repository.fetchLegDetails(List.of(1));

        assertThat(rows).hasSize(1);
        LegDetailRow r = rows.get(0);
        assertThat(r.getFlightId()).isEqualTo(1);
        assertThat(r.getFlightNumber()).isEqualTo("LHR-JFK");
        assertThat(r.getFromCode().trim()).isEqualTo("LHR");
        assertThat(r.getFromCity()).isEqualTo("London");
        assertThat(r.getToCode().trim()).isEqualTo("JFK");
        assertThat(r.getToCity()).isEqualTo("New York");
        assertThat(r.getDurationMinutes()).isEqualTo(7 * 60);
        assertThat(r.getNextDayArrival()).isFalse();
    }

    @Test
    void nextDayArrivalIsTrueWhenArrivalLocalDateExceedsDepartureLocalDate() {
        // Flight 3: dep 2026-06-01T22:00Z (=23:00 BST 2026-06-01) → arr 2026-06-02T05:00Z
        // (=01:00 EDT 2026-06-02). Local dep date 2026-06-01, local arr date 2026-06-02.
        List<LegDetailRow> rows = repository.fetchLegDetails(List.of(3));

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).getNextDayArrival()).isTrue();
    }

    @Test
    void returnsOneRowPerRequestedFlightIdInAnyOrder() {
        List<LegDetailRow> rows = repository.fetchLegDetails(List.of(1, 5, 11));

        assertThat(rows).extracting(LegDetailRow::getFlightId)
                .containsExactlyInAnyOrder(1, 5, 11);
    }

    @Test
    void unknownFlightIdYieldsNoRow() {
        List<LegDetailRow> rows = repository.fetchLegDetails(List.of(99999));

        assertThat(rows).isEmpty();
    }

    @Test
    void includesCancelledFlightsIfQueriedDirectly() {
        // LegDetailsRepository targets bookings.flights directly without a status filter.
        // The assembler never calls this method with cancelled-flight ids in practice
        // (priced_leg_v already excludes them), so this test documents the contract
        // rather than asserting a desired filter.
        List<LegDetailRow> rows = repository.fetchLegDetails(List.of(4));

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).getFlightId()).isEqualTo(4);
    }
}
