package com.defenestration.bookings.flight;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(schema = "bookings", name = "flights")
public class Flight {

    @Id
    @Column(name = "flight_id")
    private Integer flightId;

    public Integer getFlightId() {
        return flightId;
    }
}
