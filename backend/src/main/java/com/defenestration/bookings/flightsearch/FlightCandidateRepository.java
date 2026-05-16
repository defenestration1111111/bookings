package com.defenestration.bookings.flightsearch;

import com.defenestration.bookings.airport.Airport;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface FlightCandidateRepository extends Repository<Airport, String> {

    @Query(value = """
            SELECT
                ARRAY[l.flight_id]         AS "flightIds",
                l.fare_conditions          AS "fareClass",
                l.leg_price                AS "price",
                l.flight_minutes           AS "totalTripTimeMinutes",
                l.flight_minutes           AS "flightTimeMinutes",
                0                          AS "totalLayoverMinutes",
                0                          AS "stopovers",
                l.dep_at                   AS "firstDepartureAt"
            FROM bookings.priced_leg_v l
            WHERE l.dep_code = :origin
              AND l.arr_code = :destination
              AND l.dep_local_date = :departureDate
              AND l.dep_local_min BETWEEN :depTodMin AND :depTodMax
              AND l.arr_local_min BETWEEN :arrTodMin AND :arrTodMax
              AND l.fare_conditions IN (:allowedFareConditions)
              AND l.leg_price BETWEEN :priceMin AND :priceMax
            """, nativeQuery = true)
    List<ItineraryRow> searchDirect(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("departureDate") LocalDate departureDate,
            @Param("depTodMin") int depTodMin,
            @Param("depTodMax") int depTodMax,
            @Param("arrTodMin") int arrTodMin,
            @Param("arrTodMax") int arrTodMax,
            @Param("priceMin") BigDecimal priceMin,
            @Param("priceMax") BigDecimal priceMax,
            @Param("allowedFareConditions") Collection<String> allowedFareConditions);

    @Query(value = """
            SELECT
                ARRAY[l1.flight_id, l2.flight_id]        AS "flightIds",
                l1.fare_conditions                       AS "fareClass",
                l1.leg_price + l2.leg_price              AS "price",
                CAST(EXTRACT(EPOCH FROM (l2.arr_at - l1.dep_at)) / 60 AS integer)
                                                         AS "totalTripTimeMinutes",
                l1.flight_minutes + l2.flight_minutes    AS "flightTimeMinutes",
                CAST(EXTRACT(EPOCH FROM (l2.dep_at - l1.arr_at)) / 60 AS integer)
                                                         AS "totalLayoverMinutes",
                1                                         AS "stopovers",
                l1.dep_at                                 AS "firstDepartureAt"
            FROM bookings.priced_leg_v l1
            JOIN bookings.priced_leg_v l2
              ON l2.dep_code        = l1.arr_code
             AND l2.fare_conditions = l1.fare_conditions
             AND l2.dep_at >= l1.arr_at + INTERVAL '45 minutes'
             AND l2.dep_at <= l1.arr_at + INTERVAL '24 hours'
            WHERE l1.dep_code = :origin
              AND l2.arr_code = :destination
              AND l1.arr_code NOT IN (:origin, :destination)
              AND l1.dep_local_date = :departureDate
              AND l1.dep_local_min BETWEEN :depTodMin AND :depTodMax
              AND l2.arr_local_min BETWEEN :arrTodMin AND :arrTodMax
              AND l1.fare_conditions IN (:allowedFareConditions)
              AND (l1.leg_price + l2.leg_price) BETWEEN :priceMin AND :priceMax
              AND EXTRACT(EPOCH FROM (l2.arr_at - l1.dep_at)) / 60 <= :maxTotalMinutes
            """, nativeQuery = true)
    List<ItineraryRow> searchOneStop(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("departureDate") LocalDate departureDate,
            @Param("maxTotalMinutes") int maxTotalMinutes,
            @Param("depTodMin") int depTodMin,
            @Param("depTodMax") int depTodMax,
            @Param("arrTodMin") int arrTodMin,
            @Param("arrTodMax") int arrTodMax,
            @Param("priceMin") BigDecimal priceMin,
            @Param("priceMax") BigDecimal priceMax,
            @Param("allowedFareConditions") Collection<String> allowedFareConditions);

    @Query(value = """
            SELECT
                ARRAY[l1.flight_id, l2.flight_id, l3.flight_id]
                                                            AS "flightIds",
                l1.fare_conditions                          AS "fareClass",
                l1.leg_price + l2.leg_price + l3.leg_price  AS "price",
                CAST(EXTRACT(EPOCH FROM (l3.arr_at - l1.dep_at)) / 60 AS integer)
                                                            AS "totalTripTimeMinutes",
                l1.flight_minutes + l2.flight_minutes + l3.flight_minutes
                                                            AS "flightTimeMinutes",
                CAST(EXTRACT(EPOCH FROM (l2.dep_at - l1.arr_at)) / 60 AS integer)
                  + CAST(EXTRACT(EPOCH FROM (l3.dep_at - l2.arr_at)) / 60 AS integer)
                                                            AS "totalLayoverMinutes",
                2                                            AS "stopovers",
                l1.dep_at                                    AS "firstDepartureAt"
            FROM bookings.priced_leg_v l1
            JOIN bookings.priced_leg_v l2
              ON l2.dep_code        = l1.arr_code
             AND l2.fare_conditions = l1.fare_conditions
             AND l2.dep_at >= l1.arr_at + INTERVAL '45 minutes'
             AND l2.dep_at <= l1.arr_at + INTERVAL '24 hours'
            JOIN bookings.priced_leg_v l3
              ON l3.dep_code        = l2.arr_code
             AND l3.fare_conditions = l2.fare_conditions
             AND l3.dep_at >= l2.arr_at + INTERVAL '45 minutes'
             AND l3.dep_at <= l2.arr_at + INTERVAL '24 hours'
            WHERE l1.dep_code = :origin
              AND l3.arr_code = :destination
              AND l1.arr_code NOT IN (:origin, :destination)
              AND l2.arr_code NOT IN (:origin, :destination)
              AND l2.arr_code <> l1.arr_code
              AND l1.dep_local_date = :departureDate
              AND l1.dep_local_min BETWEEN :depTodMin AND :depTodMax
              AND l3.arr_local_min BETWEEN :arrTodMin AND :arrTodMax
              AND l1.fare_conditions IN (:allowedFareConditions)
              AND (l1.leg_price + l2.leg_price + l3.leg_price) BETWEEN :priceMin AND :priceMax
              AND EXTRACT(EPOCH FROM (l3.arr_at - l1.dep_at)) / 60 <= :maxTotalMinutes
            """, nativeQuery = true)
    List<ItineraryRow> searchTwoStop(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("departureDate") LocalDate departureDate,
            @Param("maxTotalMinutes") int maxTotalMinutes,
            @Param("depTodMin") int depTodMin,
            @Param("depTodMax") int depTodMax,
            @Param("arrTodMin") int arrTodMin,
            @Param("arrTodMax") int arrTodMax,
            @Param("priceMin") BigDecimal priceMin,
            @Param("priceMax") BigDecimal priceMax,
            @Param("allowedFareConditions") Collection<String> allowedFareConditions);
}
