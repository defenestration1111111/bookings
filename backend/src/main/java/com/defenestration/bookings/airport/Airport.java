package com.defenestration.bookings.airport;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Immutable
@Table(schema = "bookings", name = "airports")
public class Airport {

    @Id
    @Column(name = "airport_code", length = 3)
    @JdbcTypeCode(SqlTypes.CHAR)
    private String airportCode;

    public String getAirportCode() {
        return airportCode;
    }
}
