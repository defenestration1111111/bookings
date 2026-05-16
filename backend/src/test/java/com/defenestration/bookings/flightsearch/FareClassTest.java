package com.defenestration.bookings.flightsearch;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class FareClassTest {

    @Test
    void sqlValueAndFromSqlAreInverseForEveryEnumValue() {
        for (FareClass fc : FareClass.values()) {
            assertThat(FareClass.fromSql(fc.sqlValue())).isEqualTo(fc);
        }
    }

    @Test
    void sqlValuesAreTheExactStringsTheSchemaConstraintAccepts() {
        // The check constraint on route_fares.fare_conditions is the source of truth — if these
        // values drift, the route_fares INSERT path will throw a constraint violation at runtime.
        assertThat(FareClass.ECONOMY.sqlValue()).isEqualTo("Economy");
        assertThat(FareClass.COMFORT.sqlValue()).isEqualTo("Comfort");
        assertThat(FareClass.BUSINESS.sqlValue()).isEqualTo("Business");
    }

    @Test
    void fromSqlRejectsUnknownString() {
        assertThatThrownBy(() -> FareClass.fromSql("First"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("First");
    }

    @Test
    void fromSqlIsCaseSensitive() {
        // The SQL projection returns the exact casing from route_fares; case mismatch should fail loudly.
        assertThatThrownBy(() -> FareClass.fromSql("economy"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
