package com.defenestration.bookings.booking;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.domain.Persistable;

@Entity
@Immutable
@Table(schema = "bookings", name = "bookings")
public class Booking implements Persistable<String> {

    @Id
    @Column(name = "book_ref", length = 6)
    @JdbcTypeCode(SqlTypes.CHAR)
    private String bookRef;

    @Column(name = "book_date", nullable = false)
    private OffsetDateTime bookDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.PERSIST)
    private List<Ticket> tickets = new ArrayList<>();

    @Transient
    private boolean persisted = false;

    protected Booking() {
    }

    public Booking(String bookRef, OffsetDateTime bookDate, BigDecimal totalAmount) {
        this.bookRef = bookRef;
        this.bookDate = bookDate;
        this.totalAmount = totalAmount;
    }

    public void addTicket(Ticket ticket) {
        tickets.add(ticket);
        ticket.setBooking(this);
    }

    @PrePersist
    @PostLoad
    void markPersisted() {
        this.persisted = true;
    }

    @Override
    public String getId() {
        return bookRef;
    }

    @Override
    public boolean isNew() {
        return !persisted;
    }

    public String getBookRef() {
        return bookRef;
    }
}
