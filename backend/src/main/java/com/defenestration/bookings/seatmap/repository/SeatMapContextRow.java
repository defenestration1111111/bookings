package com.defenestration.bookings.seatmap.repository;

public interface SeatMapContextRow {

    String getStatus();

    String getAirplaneCode();

    String getAirplaneModel();

    String[] getAislesAfter();
}
