package com.defenestration.bookings.flightsearch;

import com.defenestration.bookings.airport.Airport;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface LegDetailsRepository extends Repository<Airport, String> {

    @Query(value = """
            SELECT
                f.flight_id                AS "flightId",
                f.route_no                 AS "flightNumber",
                r.departure_airport        AS "fromCode",
                dep.city                   AS "fromCity",
                r.arrival_airport          AS "toCode",
                arr.city                   AS "toCity",
                f.scheduled_departure      AS "departureAt",
                f.scheduled_arrival        AS "arrivalAt",
                CAST(EXTRACT(EPOCH FROM (f.scheduled_arrival - f.scheduled_departure)) / 60 AS integer)
                                           AS "durationMinutes",
                (CAST(f.scheduled_arrival   AT TIME ZONE arr.timezone AS date)
                 > CAST(f.scheduled_departure AT TIME ZONE dep.timezone AS date))
                                           AS "nextDayArrival"
            FROM bookings.flights f
            JOIN bookings.routes r
              ON r.route_no = f.route_no AND r.validity @> f.scheduled_departure
            JOIN bookings.airports dep ON dep.airport_code = r.departure_airport
            JOIN bookings.airports arr ON arr.airport_code = r.arrival_airport
            WHERE f.flight_id IN (:flightIds)
            """, nativeQuery = true)
    List<LegDetailRow> fetchLegDetails(@Param("flightIds") Collection<Integer> flightIds);
}
