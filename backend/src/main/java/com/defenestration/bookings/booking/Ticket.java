package com.defenestration.bookings.booking;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(schema = "bookings", name = "tickets")
public class Ticket {

    @Id
    @Column(name = "ticket_no", length = 13)
    private String ticketNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_ref", nullable = false)
    private Booking booking;

    @Column(name = "passenger_id", nullable = false)
    private String passengerId;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "outbound", nullable = false)
    private boolean outbound;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.PERSIST)
    private List<Segment> segments = new ArrayList<>();

    protected Ticket() {
    }

    public Ticket(String ticketNo, String passengerId, String passengerName, boolean outbound) {
        this.ticketNo = ticketNo;
        this.passengerId = passengerId;
        this.passengerName = passengerName;
        this.outbound = outbound;
    }

    void setBooking(Booking booking) {
        this.booking = booking;
    }

    public void addSegment(Segment segment) {
        segments.add(segment);
        segment.setTicket(this);
    }

    public String getTicketNo() {
        return ticketNo;
    }
}
