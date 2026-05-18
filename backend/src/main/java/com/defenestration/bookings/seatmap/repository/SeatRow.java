package com.defenestration.bookings.seatmap.repository;

import java.math.BigDecimal;

public interface SeatRow {

    String getSeatNo();

    String getFareConditions();

    Boolean getTaken();

    BigDecimal getPrice();
}
