package com.defenestration.bookings.booking.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import com.defenestration.bookings.TestcontainersConfiguration;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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
@Sql("/db/fixtures/booking_small.sql")
class BookingRepositoryTest {

    @Autowired
    private BookingRepository repository;

    @Test
    void fetchLegPricingReturnsRowPerRequestedTupleInOrder() {
        List<LegPricingRow> rows = repository.fetchLegPricing(
                new int[]{100, 100},
                new String[]{"12A", "15A"});

        assertThat(rows).extracting(
                LegPricingRow::getFlightId,
                LegPricingRow::getSeatNo,
                LegPricingRow::getStatus,
                LegPricingRow::getFareConditions)
                .containsExactly(
                        tuple(100, "12A", "Scheduled", "Economy"),
                        tuple(100, "15A", "Scheduled", "Comfort"));

        // Prices: route_fares (Economy 500, Comfort 900) × no airplane_price_factor → 1.0
        assertThat(rows.get(0).getPrice()).isEqualByComparingTo(new BigDecimal("500.00"));
        assertThat(rows.get(1).getPrice()).isEqualByComparingTo(new BigDecimal("900.00"));

        // Flight metadata threaded through for the response.
        LegPricingRow first = rows.get(0);
        assertThat(first.getFlightNumber()).isEqualTo("LHR-JFK");
        assertThat(first.getFromCode()).isEqualTo("LHR");
        assertThat(first.getFromCity()).isEqualTo("London");
        assertThat(first.getToCode()).isEqualTo("JFK");
    }

    @Test
    void fetchLegPricingNullStatusWhenFlightIdUnknown() {
        List<LegPricingRow> rows = repository.fetchLegPricing(
                new int[]{999999},
                new String[]{"12A"});

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).getStatus()).isNull();
        assertThat(rows.get(0).getFareConditions()).isNull();
    }

    @Test
    void fetchLegPricingPreservesStatusForCancelledFlight() {
        // We deliberately do NOT filter by status at the SQL layer — the service
        // is responsible for rejecting non-bookable statuses. The repo just reports.
        List<LegPricingRow> rows = repository.fetchLegPricing(
                new int[]{101},
                new String[]{"12A"});

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).getStatus()).isEqualTo("Cancelled");
    }

    @Test
    void fetchLegPricingNullFareWhenSeatNotOnAirframe() {
        List<LegPricingRow> rows = repository.fetchLegPricing(
                new int[]{100},
                new String[]{"99Z"});

        assertThat(rows).hasSize(1);
        assertThat(rows.get(0).getStatus()).isEqualTo("Scheduled");
        assertThat(rows.get(0).getFareConditions()).isNull();
        assertThat(rows.get(0).getPrice()).isNull();
    }

    @Test
    void findTakenSeatsReturnsOnlyTakenTuples() {
        // Fixture pre-books (100, '1A'). 12A is free.
        List<SeatTakenRow> taken = repository.findTakenSeats(
                new int[]{100, 100},
                new String[]{"1A", "12A"});

        assertThat(taken).extracting(SeatTakenRow::getFlightId, SeatTakenRow::getSeatNo)
                .containsExactly(tuple(100, "1A"));
    }

    @Test
    void findTakenSeatsEmptyWhenAllFree() {
        List<SeatTakenRow> taken = repository.findTakenSeats(
                new int[]{100},
                new String[]{"12A"});
        assertThat(taken).isEmpty();
    }

    @Test
    void insertBookingTicketSegmentRoundtrips() {
        OffsetDateTime bookDate = OffsetDateTime.of(2026, 5, 18, 9, 0, 0, 0, ZoneOffset.UTC);
        repository.insertBooking("XXXXXX", bookDate, new BigDecimal("500.00"));
        repository.insertTicket("9999999999999", "XXXXXX", "TESTPAX001", "Test Passenger");
        repository.insertSegment("9999999999999", 100, "Economy", new BigDecimal("500.00"), "12B");

        List<SeatTakenRow> taken = repository.findTakenSeats(
                new int[]{100},
                new String[]{"12B"});
        assertThat(taken).extracting(SeatTakenRow::getSeatNo).containsExactly("12B");
    }
}
