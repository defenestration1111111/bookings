package com.defenestration.bookings.booking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(schema = "bookings", name = "segments")
@IdClass(SegmentId.class)
public class Segment {

    @Id
    @Column(name = "ticket_no", length = 13)
    private String ticketNo;

    @Id
    @Column(name = "flight_id")
    private Integer flightId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_no", insertable = false, updatable = false)
    private Ticket ticket;

    @Column(name = "fare_conditions", nullable = false)
    private String fareConditions;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "seat_no", nullable = false)
    private String seatNo;

    protected Segment() {
    }

    public Segment(int flightId, String fareConditions, BigDecimal price, String seatNo) {
        this.flightId = flightId;
        this.fareConditions = fareConditions;
        this.price = price;
        this.seatNo = seatNo;
    }

    void setTicket(Ticket ticket) {
        this.ticket = ticket;
        this.ticketNo = ticket.getTicketNo();
    }
}
