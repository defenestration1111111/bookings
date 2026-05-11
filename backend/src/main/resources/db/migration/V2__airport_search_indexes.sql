CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE INDEX airports_city_trgm_idx
    ON bookings.airports
    USING gin (city gin_trgm_ops);
