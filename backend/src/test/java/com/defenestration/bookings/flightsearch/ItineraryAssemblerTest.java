package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;

class ItineraryAssemblerTest {

    private final LegDetailsRepository repository = mock(LegDetailsRepository.class);
    private final ItineraryAssembler assembler = new ItineraryAssembler(repository);

    @Test
    void emptyInputReturnsEmptyListAndSkipsRepository() {
        List<Itinerary> result = assembler.assemble(List.of());

        assertThat(result).isEmpty();
        verify(repository, never()).fetchLegDetails(any());
    }

    @Test
    void mapsRowsToItinerariesWithLegsInOrder() {
        ItineraryRow row = row(new Integer[]{10, 20}, "Economy", "150.00", 240, 200, 40, 1,
                Instant.parse("2026-06-01T08:00:00Z"));
        LegDetailRow leg1 = legRow(10, "AA10", "LHR ", "London", "AMS ", "Amsterdam",
                Instant.parse("2026-06-01T08:00:00Z"), Instant.parse("2026-06-01T10:30:00Z"), 150, false);
        LegDetailRow leg2 = legRow(20, "AA20", "AMS ", "Amsterdam", "JFK ", "New York",
                Instant.parse("2026-06-01T11:10:00Z"), Instant.parse("2026-06-01T14:00:00Z"), 290, false);
        when(repository.fetchLegDetails(List.of(10, 20))).thenReturn(List.of(leg1, leg2));

        List<Itinerary> result = assembler.assemble(List.of(row));

        assertThat(result).hasSize(1);
        Itinerary it = result.get(0);
        assertThat(it.fareClass()).isEqualTo(FareClass.ECONOMY);
        assertThat(it.price()).isEqualByComparingTo("150.00");
        assertThat(it.currency()).isEqualTo("USD");
        assertThat(it.totalTripTimeMinutes()).isEqualTo(240);
        assertThat(it.flightTimeMinutes()).isEqualTo(200);
        assertThat(it.totalLayoverMinutes()).isEqualTo(40);
        assertThat(it.stopovers()).isEqualTo(1);
        assertThat(it.legs()).extracting(Leg::flightNumber).containsExactly("AA10", "AA20");
        assertThat(it.legs().get(0).fromAirport()).isEqualTo(new LegAirport("LHR", "London"));
        assertThat(it.legs().get(1).toAirport()).isEqualTo(new LegAirport("JFK", "New York"));
    }

    @Test
    void trimsPaddedCharColumnsInLegAirportCodes() {
        // bookings.airports.airport_code is character(3); JDBC may surface trailing spaces.
        ItineraryRow row = row(new Integer[]{1}, "Comfort", "100.00", 120, 120, 0, 0, Instant.EPOCH);
        LegDetailRow leg = legRow(1, "AA1", "LHR", "London", "JFK", "New York",
                Instant.EPOCH, Instant.EPOCH.plusSeconds(7200), 120, false);
        when(repository.fetchLegDetails(List.of(1))).thenReturn(List.of(leg));

        Itinerary it = assembler.assemble(List.of(row)).get(0);

        assertThat(it.legs().get(0).fromAirport().airportCode()).isEqualTo("LHR");
        assertThat(it.legs().get(0).toAirport().airportCode()).isEqualTo("JFK");
    }

    @Test
    void itineraryIdIsDeterministicForSameInputs() {
        ItineraryRow row1 = row(new Integer[]{10, 20}, "Economy", "150.00", 240, 200, 40, 1, Instant.EPOCH);
        ItineraryRow row2 = row(new Integer[]{10, 20}, "Economy", "150.00", 240, 200, 40, 1, Instant.EPOCH);
        LegDetailRow l10 = legRow(10, "X", "AAA", "A", "BBB", "B", Instant.EPOCH, Instant.EPOCH, 0, false);
        LegDetailRow l20 = legRow(20, "Y", "BBB", "B", "CCC", "C", Instant.EPOCH, Instant.EPOCH, 0, false);
        when(repository.fetchLegDetails(any())).thenReturn(List.of(l10, l20));

        String id1 = assembler.assemble(List.of(row1)).get(0).id();
        String id2 = assembler.assemble(List.of(row2)).get(0).id();

        assertThat(id1).isEqualTo(id2);
    }

    @Test
    void itineraryIdDiffersWhenFareClassDiffers() {
        ItineraryRow econ = row(new Integer[]{10, 20}, "Economy", "150", 0, 0, 0, 1, Instant.EPOCH);
        ItineraryRow biz = row(new Integer[]{10, 20}, "Business", "300", 0, 0, 0, 1, Instant.EPOCH);
        LegDetailRow l10 = legRow(10, "X", "AAA", "A", "BBB", "B", Instant.EPOCH, Instant.EPOCH, 0, false);
        LegDetailRow l20 = legRow(20, "Y", "BBB", "B", "CCC", "C", Instant.EPOCH, Instant.EPOCH, 0, false);
        when(repository.fetchLegDetails(any())).thenReturn(List.of(l10, l20));

        String idEcon = assembler.assemble(List.of(econ)).get(0).id();
        String idBiz = assembler.assemble(List.of(biz)).get(0).id();

        assertThat(idEcon).isNotEqualTo(idBiz);
    }

    @Test
    void itineraryIdDiffersWhenChainOrderDiffers() {
        ItineraryRow forward = row(new Integer[]{10, 20}, "Economy", "150", 0, 0, 0, 1, Instant.EPOCH);
        ItineraryRow reverse = row(new Integer[]{20, 10}, "Economy", "150", 0, 0, 0, 1, Instant.EPOCH);
        LegDetailRow l10 = legRow(10, "X", "AAA", "A", "BBB", "B", Instant.EPOCH, Instant.EPOCH, 0, false);
        LegDetailRow l20 = legRow(20, "Y", "BBB", "B", "CCC", "C", Instant.EPOCH, Instant.EPOCH, 0, false);
        when(repository.fetchLegDetails(any())).thenReturn(List.of(l10, l20));

        String idForward = assembler.assemble(List.of(forward)).get(0).id();
        String idReverse = assembler.assemble(List.of(reverse)).get(0).id();

        assertThat(idForward).isNotEqualTo(idReverse);
    }

    private static ItineraryRow row(
            Integer[] flightIds, String fareClass, String price,
            int totalTrip, int flightTime, int layover, int stopovers,
            Instant firstDepartureAt) {
        ItineraryRow r = mock(ItineraryRow.class);
        lenient().when(r.getFlightIds()).thenReturn(flightIds);
        lenient().when(r.getFareClass()).thenReturn(fareClass);
        lenient().when(r.getPrice()).thenReturn(new BigDecimal(price));
        lenient().when(r.getTotalTripTimeMinutes()).thenReturn(totalTrip);
        lenient().when(r.getFlightTimeMinutes()).thenReturn(flightTime);
        lenient().when(r.getTotalLayoverMinutes()).thenReturn(layover);
        lenient().when(r.getStopovers()).thenReturn(stopovers);
        lenient().when(r.getFirstDepartureAt()).thenReturn(firstDepartureAt);
        return r;
    }

    private static LegDetailRow legRow(
            int flightId, String flightNumber, String fromCode, String fromCity,
            String toCode, String toCity, Instant dep, Instant arr,
            int durationMinutes, boolean nextDayArrival) {
        LegDetailRow r = mock(LegDetailRow.class);
        lenient().when(r.getFlightId()).thenReturn(flightId);
        lenient().when(r.getFlightNumber()).thenReturn(flightNumber);
        lenient().when(r.getFromCode()).thenReturn(fromCode);
        lenient().when(r.getFromCity()).thenReturn(fromCity);
        lenient().when(r.getToCode()).thenReturn(toCode);
        lenient().when(r.getToCity()).thenReturn(toCity);
        lenient().when(r.getDepartureAt()).thenReturn(dep);
        lenient().when(r.getArrivalAt()).thenReturn(arr);
        lenient().when(r.getDurationMinutes()).thenReturn(durationMinutes);
        lenient().when(r.getNextDayArrival()).thenReturn(nextDayArrival);
        return r;
    }
}
