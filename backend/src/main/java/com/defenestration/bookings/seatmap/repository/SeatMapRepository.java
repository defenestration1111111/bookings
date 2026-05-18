package com.defenestration.bookings.seatmap.repository;

import com.defenestration.bookings.airport.Airport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface SeatMapRepository extends Repository<Airport, String> {

    @Query(value = """
            SELECT f.status        AS "status",
                   r.airplane_code AS "airplaneCode",
                   a.model         AS "airplaneModel",
                   al.aisles_after AS "aislesAfter"
            FROM bookings.flights           f
            JOIN bookings.routes            r
              ON r.route_no = f.route_no
             AND r.validity @> f.scheduled_departure
            JOIN bookings.airplanes         a  ON a.airplane_code  = r.airplane_code
            JOIN bookings.aircraft_layouts  al ON al.airplane_code = r.airplane_code
            WHERE f.flight_id = :flightId
            """, nativeQuery = true)
    Optional<SeatMapContextRow> findContext(@Param("flightId") int flightId);

    @Query(value = """
            SELECT s.seat_no                   AS "seatNo",
                   s.fare_conditions           AS "fareConditions",
                   (seg.ticket_no IS NOT NULL) AS "taken",
                   ppl.leg_price               AS "price"
            FROM bookings.flights           f
            JOIN bookings.routes            r
              ON r.route_no = f.route_no
             AND r.validity @> f.scheduled_departure
            JOIN bookings.seats             s   ON s.airplane_code   = r.airplane_code
            JOIN bookings.priced_leg_v      ppl
              ON ppl.flight_id        = f.flight_id
             AND ppl.fare_conditions  = s.fare_conditions
            LEFT JOIN bookings.segments     seg
              ON seg.flight_id = f.flight_id
             AND seg.seat_no   = s.seat_no
            WHERE f.flight_id = :flightId
            ORDER BY s.seat_no
            """, nativeQuery = true)
    List<SeatRow> findSeats(@Param("flightId") int flightId);
}
