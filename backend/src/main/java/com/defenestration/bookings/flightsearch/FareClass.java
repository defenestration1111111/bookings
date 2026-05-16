package com.defenestration.bookings.flightsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum FareClass {
    @JsonProperty("Economy") ECONOMY("Economy"),
    @JsonProperty("Comfort") COMFORT("Comfort"),
    @JsonProperty("Business") BUSINESS("Business");

    private final String sqlValue;

    FareClass(String sqlValue) {
        this.sqlValue = sqlValue;
    }

    public String sqlValue() {
        return sqlValue;
    }

    public static FareClass fromSql(String s) {
        return switch (s) {
            case "Economy" -> ECONOMY;
            case "Comfort" -> COMFORT;
            case "Business" -> BUSINESS;
            default -> throw new IllegalArgumentException("Unknown fare class: " + s);
        };
    }
}
