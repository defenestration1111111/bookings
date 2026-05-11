package com.defenestration.bookings.airport;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface AirportRepository extends Repository<Airport, String> {

    @Query(value = """
            SELECT
                a.airport_code AS "airportCode",
                a.city         AS "city"
            FROM bookings.airports a
            WHERE a.airport_code = :codeQ
               OR a.airport_code LIKE :codeQ || '%'
               OR a.city ILIKE :q || '%'
               OR a.city ILIKE '%' || :q || '%'
               OR (:enableFuzzy AND a.city % :q)
            ORDER BY
                CASE
                    WHEN a.airport_code = :codeQ              THEN 1
                    WHEN a.airport_code LIKE :codeQ || '%'    THEN 2
                    WHEN a.city ILIKE :q || '%'               THEN 3
                    WHEN a.city ILIKE '%' || :q || '%'        THEN 4
                    ELSE 5
                END,
                CASE WHEN :enableFuzzy
                     THEN similarity(a.city, :q)
                     ELSE 0
                END DESC,
                a.city
            LIMIT :limit
            """, nativeQuery = true)
    List<AirportSummary> search(
            @Param("q") String q,
            @Param("codeQ") String codeQ,
            @Param("enableFuzzy") boolean enableFuzzy,
            @Param("limit") int limit);

    @Query(value = """
            SELECT
                a.airport_code AS "airportCode",
                a.city         AS "city"
            FROM bookings.airports a
            ORDER BY a.city
            LIMIT :limit
            """, nativeQuery = true)
    List<AirportSummary> topByCity(@Param("limit") int limit);
}
