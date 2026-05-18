package com.defenestration.bookings.booking.repository;

import com.defenestration.bookings.airport.Airport;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends Repository<Airport, String> {

    @Query(value = """
            SELECT
                req.flight_id              AS "flightId",
                req.seat_no                AS "seatNo",
                f.status                   AS "status",
                f.route_no                 AS "flightNumber",
                r.departure_airport        AS "fromCode",
                dep.city                   AS "fromCity",
                r.arrival_airport          AS "toCode",
                arr.city                   AS "toCity",
                f.scheduled_departure      AS "departureAt",
                f.scheduled_arrival        AS "arrivalAt",
                s.fare_conditions          AS "fareConditions",
                rf.price * COALESCE(apf.price_multiplier, 1.0) AS "price"
            FROM UNNEST(CAST(:flightIds AS int[]),
                        CAST(:seatNos   AS text[]))
                 WITH ORDINALITY AS req(flight_id, seat_no, ord)
            LEFT JOIN bookings.flights   f ON f.flight_id = req.flight_id
            LEFT JOIN bookings.routes    r
                   ON r.route_no  = f.route_no
                  AND r.validity @> f.scheduled_departure
            LEFT JOIN bookings.airports  dep ON dep.airport_code = r.departure_airport
            LEFT JOIN bookings.airports  arr ON arr.airport_code = r.arrival_airport
            LEFT JOIN bookings.seats     s
                   ON s.airplane_code = r.airplane_code
                  AND s.seat_no       = req.seat_no
            LEFT JOIN bookings.route_fares rf
                   ON rf.route_no       = r.route_no
                  AND rf.fare_conditions = s.fare_conditions
            LEFT JOIN bookings.airplane_price_factors apf
                   ON apf.airplane_code = r.airplane_code
                  AND daterange(apf.valid_from, apf.valid_to, '[)') @> CAST(f.scheduled_departure AS date)
            ORDER BY req.ord
            """, nativeQuery = true)
    List<LegPricingRow> fetchLegPricing(
            @Param("flightIds") int[] flightIds,
            @Param("seatNos")   String[] seatNos);

    /**
     * Returns the subset of (flightId, seatNo) tuples already present in {@code segments}.
     * Used both for pre-INSERT pessimistic checks and for the post-conflict diagnostic
     * after a {@code UNIQUE (flight_id, seat_no)} violation.
     */
    @Query(value = """
            SELECT seg.flight_id AS "flightId",
                   seg.seat_no   AS "seatNo"
            FROM UNNEST(CAST(:flightIds AS int[]),
                        CAST(:seatNos   AS text[])) AS req(flight_id, seat_no)
            JOIN bookings.segments seg
              ON seg.flight_id = req.flight_id
             AND seg.seat_no   = req.seat_no
            """, nativeQuery = true)
    List<SeatTakenRow> findTakenSeats(
            @Param("flightIds") int[] flightIds,
            @Param("seatNos")   String[] seatNos);

    @Modifying
    @Query(value = """
            INSERT INTO bookings.bookings (book_ref, book_date, total_amount)
            VALUES (:bookRef, :bookDate, :totalAmount)
            """, nativeQuery = true)
    int insertBooking(
            @Param("bookRef") String bookRef,
            @Param("bookDate") OffsetDateTime bookDate,
            @Param("totalAmount") BigDecimal totalAmount);

    @Modifying
    @Query(value = """
            INSERT INTO bookings.tickets
                (ticket_no, book_ref, passenger_id, passenger_name, outbound)
            VALUES (:ticketNo, :bookRef, :passengerId, :passengerName, TRUE)
            """, nativeQuery = true)
    int insertTicket(
            @Param("ticketNo") String ticketNo,
            @Param("bookRef") String bookRef,
            @Param("passengerId") String passengerId,
            @Param("passengerName") String passengerName);

    @Modifying
    @Query(value = """
            INSERT INTO bookings.segments
                (ticket_no, flight_id, fare_conditions, price, seat_no)
            VALUES (:ticketNo, :flightId, :fareConditions, :price, :seatNo)
            """, nativeQuery = true)
    int insertSegment(
            @Param("ticketNo") String ticketNo,
            @Param("flightId") int flightId,
            @Param("fareConditions") String fareConditions,
            @Param("price") BigDecimal price,
            @Param("seatNo") String seatNo);
}
