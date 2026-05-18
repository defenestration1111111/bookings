CREATE TABLE bookings.aircraft_layouts (
    airplane_code character(3) NOT NULL,
    aisles_after  text[]       NOT NULL,
    CONSTRAINT aircraft_layouts_pkey PRIMARY KEY (airplane_code),
    CONSTRAINT aircraft_layouts_airplane_code_fkey
        FOREIGN KEY (airplane_code) REFERENCES bookings.airplanes (airplane_code)
        ON DELETE CASCADE
);


COMMENT ON TABLE bookings.aircraft_layouts IS
    'Per-airframe cabin visual layout. aisles_after lists column letters after which the seat-map renderer draws an aisle gap. Column letters themselves are derived from bookings.seats at query time.';

COMMENT ON COLUMN bookings.aircraft_layouts.airplane_code IS 'Airplane code, IATA';
COMMENT ON COLUMN bookings.aircraft_layouts.aisles_after  IS 'Ordered column letters after which the renderer draws an aisle gap. Examples: {C} for 6-abreast single-aisle (ABC | DEF); {C,G} for 9-abreast twin-aisle (ABC | DEFG | HJK).';
