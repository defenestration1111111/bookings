SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bookings; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA bookings;


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: now(); Type: FUNCTION; Schema: bookings; Owner: -
--

CREATE FUNCTION bookings.now() RETURNS timestamp with time zone
    LANGUAGE sql IMMUTABLE
    RETURN '2025-12-01 00:00:00+00'::timestamp with time zone;


--
-- Name: FUNCTION now(); Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON FUNCTION bookings.now() IS 'Current moment for the generated data';


--
-- Name: version(); Type: FUNCTION; Schema: bookings; Owner: -
--

CREATE FUNCTION bookings.version() RETURNS text
    LANGUAGE sql IMMUTABLE
    RETURN 'PostgresPro 2025-09-01 (91 days)'::text;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: airplanes; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.airplanes (
    airplane_code character(3) NOT NULL,
    model text NOT NULL,
    range integer NOT NULL,
    speed integer NOT NULL,
    CONSTRAINT airplanes_range_check CHECK ((range > 0)),
    CONSTRAINT airplanes_speed_check CHECK ((speed > 0))
);


--
-- Name: TABLE airplanes; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.airplanes IS 'Airplanes';


--
-- Name: COLUMN airplanes.airplane_code; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airplanes.airplane_code IS 'Airplane code, IATA';


--
-- Name: COLUMN airplanes.model; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airplanes.model IS 'Airplane model';


--
-- Name: COLUMN airplanes.range; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airplanes.range IS 'Maximum flight range, km';


--
-- Name: COLUMN airplanes.speed; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airplanes.speed IS 'Cruise speed, km/h';


--
-- Name: airports; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.airports (
    airport_code character(3) NOT NULL,
    airport_name text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    coordinates point NOT NULL,
    timezone text NOT NULL
);


--
-- Name: TABLE airports; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.airports IS 'Airports';


--
-- Name: COLUMN airports.airport_code; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.airport_code IS 'Airport code, IATA';


--
-- Name: COLUMN airports.airport_name; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.airport_name IS 'Airport name';


--
-- Name: COLUMN airports.city; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.city IS 'City';


--
-- Name: COLUMN airports.country; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.country IS 'Country';


--
-- Name: COLUMN airports.coordinates; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.coordinates IS 'Airport coordinates (longitude and latitude)';


--
-- Name: COLUMN airports.timezone; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.airports.timezone IS 'Airport time zone';


--
-- Name: boarding_passes; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.boarding_passes (
    ticket_no text NOT NULL,
    flight_id integer NOT NULL,
    seat_no text NOT NULL,
    boarding_no integer,
    boarding_time timestamp with time zone
);


--
-- Name: TABLE boarding_passes; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.boarding_passes IS 'Boarding passes';


--
-- Name: COLUMN boarding_passes.ticket_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.boarding_passes.ticket_no IS 'Ticket number';


--
-- Name: COLUMN boarding_passes.flight_id; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.boarding_passes.flight_id IS 'Flight ID';


--
-- Name: COLUMN boarding_passes.seat_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.boarding_passes.seat_no IS 'Seat number';


--
-- Name: COLUMN boarding_passes.boarding_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.boarding_passes.boarding_no IS 'Boarding pass number';


--
-- Name: COLUMN boarding_passes.boarding_time; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.boarding_passes.boarding_time IS 'Boarding time';


--
-- Name: bookings; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.bookings (
    book_ref character(6) NOT NULL,
    book_date timestamp with time zone NOT NULL,
    total_amount numeric(10,2) NOT NULL
);


--
-- Name: TABLE bookings; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.bookings IS 'Bookings';


--
-- Name: COLUMN bookings.book_ref; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.bookings.book_ref IS 'Booking number';


--
-- Name: COLUMN bookings.book_date; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.bookings.book_date IS 'Booking date';


--
-- Name: COLUMN bookings.total_amount; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.bookings.total_amount IS 'Total booking amount';


--
-- Name: flights; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.flights (
    flight_id integer NOT NULL,
    route_no text NOT NULL,
    status text NOT NULL,
    scheduled_departure timestamp with time zone NOT NULL,
    scheduled_arrival timestamp with time zone NOT NULL,
    actual_departure timestamp with time zone,
    actual_arrival timestamp with time zone,
    CONSTRAINT flight_actual_check CHECK (((actual_arrival IS NULL) OR ((actual_departure IS NOT NULL) AND (actual_arrival IS NOT NULL) AND (actual_arrival > actual_departure)))),
    CONSTRAINT flight_scheduled_check CHECK ((scheduled_arrival > scheduled_departure)),
    CONSTRAINT flight_status_check CHECK ((status = ANY (ARRAY['Scheduled'::text, 'On Time'::text, 'Delayed'::text, 'Boarding'::text, 'Departed'::text, 'Arrived'::text, 'Cancelled'::text])))
);


--
-- Name: TABLE flights; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.flights IS 'Flights';


--
-- Name: COLUMN flights.flight_id; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.flight_id IS 'Flight ID';


--
-- Name: COLUMN flights.route_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.route_no IS 'Route number';


--
-- Name: COLUMN flights.status; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.status IS 'Flight status';


--
-- Name: COLUMN flights.scheduled_departure; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.scheduled_departure IS 'Scheduled departure time';


--
-- Name: COLUMN flights.scheduled_arrival; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.scheduled_arrival IS 'Scheduled arrival time';


--
-- Name: COLUMN flights.actual_departure; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.actual_departure IS 'Actual departure time';


--
-- Name: COLUMN flights.actual_arrival; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.flights.actual_arrival IS 'Actual arrival time';


--
-- Name: flights_flight_id_seq; Type: SEQUENCE; Schema: bookings; Owner: -
--

ALTER TABLE bookings.flights ALTER COLUMN flight_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME bookings.flights_flight_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: routes; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.routes (
    route_no text NOT NULL,
    validity tstzrange NOT NULL,
    departure_airport character(3) NOT NULL,
    arrival_airport character(3) NOT NULL,
    airplane_code character(3) NOT NULL,
    days_of_week integer[] NOT NULL,
    scheduled_time time without time zone NOT NULL,
    duration interval NOT NULL
);


--
-- Name: TABLE routes; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.routes IS 'Routes';


--
-- Name: COLUMN routes.route_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.route_no IS 'Route number';


--
-- Name: COLUMN routes.validity; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.validity IS 'Period of validity';


--
-- Name: COLUMN routes.departure_airport; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.departure_airport IS 'Airport of departure';


--
-- Name: COLUMN routes.arrival_airport; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.arrival_airport IS 'Airport of arrival';


--
-- Name: COLUMN routes.airplane_code; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.airplane_code IS 'Airplane code, IATA';


--
-- Name: COLUMN routes.days_of_week; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.days_of_week IS 'Days of week array';


--
-- Name: COLUMN routes.scheduled_time; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.scheduled_time IS 'Scheduled local time of departure';


--
-- Name: COLUMN routes.duration; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.routes.duration IS 'Estimated duration';


--
-- Name: seats; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.seats (
    airplane_code character(3) NOT NULL,
    seat_no text NOT NULL,
    fare_conditions text NOT NULL,
    CONSTRAINT seat_fare_conditions_check CHECK ((fare_conditions = ANY (ARRAY['Economy'::text, 'Comfort'::text, 'Business'::text])))
);


--
-- Name: TABLE seats; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.seats IS 'Seats';


--
-- Name: COLUMN seats.airplane_code; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.seats.airplane_code IS 'Airplane code, IATA';


--
-- Name: COLUMN seats.seat_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.seats.seat_no IS 'Seat number';


--
-- Name: COLUMN seats.fare_conditions; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.seats.fare_conditions IS 'Travel class';


--
-- Name: segments; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.segments (
    ticket_no text NOT NULL,
    flight_id integer NOT NULL,
    fare_conditions text NOT NULL,
    price numeric(10,2) NOT NULL,
    seat_no text NOT NULL,
    CONSTRAINT segments_fare_conditions_check CHECK ((fare_conditions = ANY (ARRAY['Economy'::text, 'Comfort'::text, 'Business'::text]))),
    CONSTRAINT segments_price_check CHECK ((price >= (0)::numeric))
);


--
-- Name: TABLE segments; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.segments IS 'Flight segment (leg)';


--
-- Name: COLUMN segments.ticket_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.segments.ticket_no IS 'Ticket number';


--
-- Name: COLUMN segments.flight_id; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.segments.flight_id IS 'Flight ID';


--
-- Name: COLUMN segments.fare_conditions; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.segments.fare_conditions IS 'Travel class';


--
-- Name: COLUMN segments.price; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.segments.price IS 'Travel price';


--
-- Name: COLUMN segments.seat_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.segments.seat_no IS 'Seat assigned at booking time. One seat per (flight_id, seat_no).';


--
-- Name: tickets; Type: TABLE; Schema: bookings; Owner: -
--

CREATE TABLE bookings.tickets (
    ticket_no text NOT NULL,
    book_ref character(6) NOT NULL,
    passenger_id text NOT NULL,
    passenger_name text NOT NULL,
    outbound boolean NOT NULL
);


--
-- Name: TABLE tickets; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON TABLE bookings.tickets IS 'Tickets';


--
-- Name: COLUMN tickets.ticket_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.tickets.ticket_no IS 'Ticket number';


--
-- Name: COLUMN tickets.book_ref; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.tickets.book_ref IS 'Booking number';


--
-- Name: COLUMN tickets.passenger_id; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.tickets.passenger_id IS 'Passenger ID';


--
-- Name: COLUMN tickets.passenger_name; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.tickets.passenger_name IS 'Passenger name';


--
-- Name: COLUMN tickets.outbound; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.tickets.outbound IS 'Outbound flight?';


--
-- Name: timetable; Type: VIEW; Schema: bookings; Owner: -
--

CREATE VIEW bookings.timetable AS
 SELECT f.flight_id,
    f.route_no,
    r.departure_airport,
    r.arrival_airport,
    f.status,
    r.airplane_code,
    f.scheduled_departure,
    (f.scheduled_departure AT TIME ZONE dep.timezone) AS scheduled_departure_local,
    f.actual_departure,
    (f.actual_departure AT TIME ZONE dep.timezone) AS actual_departure_local,
    f.scheduled_arrival,
    (f.scheduled_arrival AT TIME ZONE arr.timezone) AS scheduled_arrival_local,
    f.actual_arrival,
    (f.actual_arrival AT TIME ZONE arr.timezone) AS actual_arrival_local
   FROM (((bookings.flights f
     JOIN bookings.routes r ON (((r.route_no = f.route_no) AND (r.validity @> f.scheduled_departure))))
     JOIN bookings.airports dep ON ((dep.airport_code = r.departure_airport)))
     JOIN bookings.airports arr ON ((arr.airport_code = r.arrival_airport)));


--
-- Name: VIEW timetable; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON VIEW bookings.timetable IS 'Detailed info about flights';


--
-- Name: COLUMN timetable.flight_id; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.flight_id IS 'Flight ID';


--
-- Name: COLUMN timetable.route_no; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.route_no IS 'Route number';


--
-- Name: COLUMN timetable.departure_airport; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.departure_airport IS 'Airport of departure';


--
-- Name: COLUMN timetable.arrival_airport; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.arrival_airport IS 'Airport of arrival';


--
-- Name: COLUMN timetable.status; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.status IS 'Flight status';


--
-- Name: COLUMN timetable.airplane_code; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.airplane_code IS 'Airplane code, IATA';


--
-- Name: COLUMN timetable.scheduled_departure; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.scheduled_departure IS 'Scheduled departure time';


--
-- Name: COLUMN timetable.scheduled_departure_local; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.scheduled_departure_local IS 'Scheduled departure time in airport''s timezone';


--
-- Name: COLUMN timetable.actual_departure; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.actual_departure IS 'Actual departure time';


--
-- Name: COLUMN timetable.actual_departure_local; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.actual_departure_local IS 'Actual departure time in airport''s timezone';


--
-- Name: COLUMN timetable.scheduled_arrival; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.scheduled_arrival IS 'Scheduled arrival time';


--
-- Name: COLUMN timetable.scheduled_arrival_local; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.scheduled_arrival_local IS 'Scheduled arrival time in airport''s timezone';


--
-- Name: COLUMN timetable.actual_arrival; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.actual_arrival IS 'Actual arrival time';


--
-- Name: COLUMN timetable.actual_arrival_local; Type: COMMENT; Schema: bookings; Owner: -
--

COMMENT ON COLUMN bookings.timetable.actual_arrival_local IS 'Actual arrival time in airport''s timezone';


--
-- Name: airplanes airplanes_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.airplanes
    ADD CONSTRAINT airplanes_pkey PRIMARY KEY (airplane_code);


--
-- Name: airports airports_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.airports
    ADD CONSTRAINT airports_pkey PRIMARY KEY (airport_code);


--
-- Name: boarding_passes boarding_passes_flight_id_boarding_no_key; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.boarding_passes
    ADD CONSTRAINT boarding_passes_flight_id_boarding_no_key UNIQUE (flight_id, boarding_no);


--
-- Name: boarding_passes boarding_passes_flight_id_seat_no_key; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.boarding_passes
    ADD CONSTRAINT boarding_passes_flight_id_seat_no_key UNIQUE (flight_id, seat_no);


--
-- Name: boarding_passes boarding_passes_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.boarding_passes
    ADD CONSTRAINT boarding_passes_pkey PRIMARY KEY (ticket_no, flight_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (book_ref);


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (flight_id);


--
-- Name: flights flights_route_no_scheduled_departure_key; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.flights
    ADD CONSTRAINT flights_route_no_scheduled_departure_key UNIQUE (route_no, scheduled_departure);


--
-- Name: routes routes_route_no_validity_excl; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.routes
    ADD CONSTRAINT routes_route_no_validity_excl EXCLUDE USING gist (route_no WITH =, validity WITH &&);


--
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (airplane_code, seat_no);


--
-- Name: segments segments_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.segments
    ADD CONSTRAINT segments_pkey PRIMARY KEY (ticket_no, flight_id);


--
-- Name: segments segments_flight_id_seat_no_key; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.segments
    ADD CONSTRAINT segments_flight_id_seat_no_key UNIQUE (flight_id, seat_no);


--
-- Name: tickets tickets_book_ref_passenger_id_outbound_key; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.tickets
    ADD CONSTRAINT tickets_book_ref_passenger_id_outbound_key UNIQUE (book_ref, passenger_id, outbound);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_no);


--
-- Name: routes_departure_airport_lower_idx; Type: INDEX; Schema: bookings; Owner: -
--

CREATE INDEX routes_departure_airport_lower_idx ON bookings.routes USING btree (departure_airport, lower(validity));


--
-- Name: segments_flight_id_idx; Type: INDEX; Schema: bookings; Owner: -
--

CREATE INDEX segments_flight_id_idx ON bookings.segments USING btree (flight_id);


--
-- Name: boarding_passes boarding_passes_ticket_no_flight_id_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.boarding_passes
    ADD CONSTRAINT boarding_passes_ticket_no_flight_id_fkey FOREIGN KEY (ticket_no, flight_id) REFERENCES bookings.segments(ticket_no, flight_id);


--
-- Name: routes routes_airplane_code_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.routes
    ADD CONSTRAINT routes_airplane_code_fkey FOREIGN KEY (airplane_code) REFERENCES bookings.airplanes(airplane_code);


--
-- Name: routes routes_arrival_airport_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.routes
    ADD CONSTRAINT routes_arrival_airport_fkey FOREIGN KEY (arrival_airport) REFERENCES bookings.airports(airport_code);


--
-- Name: routes routes_departure_airport_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.routes
    ADD CONSTRAINT routes_departure_airport_fkey FOREIGN KEY (departure_airport) REFERENCES bookings.airports(airport_code);


--
-- Name: seats seats_airplane_code_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.seats
    ADD CONSTRAINT seats_airplane_code_fkey FOREIGN KEY (airplane_code) REFERENCES bookings.airplanes(airplane_code) ON DELETE CASCADE;


--
-- Name: segments segments_flight_id_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.segments
    ADD CONSTRAINT segments_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES bookings.flights(flight_id);


--
-- Name: segments segments_ticket_no_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.segments
    ADD CONSTRAINT segments_ticket_no_fkey FOREIGN KEY (ticket_no) REFERENCES bookings.tickets(ticket_no);


--
-- Name: tickets tickets_book_ref_fkey; Type: FK CONSTRAINT; Schema: bookings; Owner: -
--

ALTER TABLE ONLY bookings.tickets
    ADD CONSTRAINT tickets_book_ref_fkey FOREIGN KEY (book_ref) REFERENCES bookings.bookings(book_ref);


--
-- Name: route_fares; Type: TABLE; Schema: bookings; Owner: -
--
-- Base fare per (route, fare class), derived from historical segments by the
-- demo loader. Serves as the price source for flight search.
--
-- No FK to bookings.routes(route_no): routes are keyed by (route_no, validity)
-- in this schema (a route can have multiple non-overlapping validity periods).
-- A single fare applies across all validity periods of a route_no.
--

CREATE TABLE bookings.route_fares (
    route_no text NOT NULL,
    fare_conditions text NOT NULL,
    price numeric(10,2) NOT NULL,
    CONSTRAINT route_fares_fare_conditions_check CHECK ((fare_conditions = ANY (ARRAY['Economy'::text, 'Comfort'::text, 'Business'::text]))),
    CONSTRAINT route_fares_price_check CHECK ((price > (0)::numeric))
);


COMMENT ON TABLE bookings.route_fares IS 'Base fare per (route, fare class), populated by the demo loader from historical segments.';

COMMENT ON COLUMN bookings.route_fares.route_no IS 'Route number';
COMMENT ON COLUMN bookings.route_fares.fare_conditions IS 'Travel class';
COMMENT ON COLUMN bookings.route_fares.price IS 'Base price in route currency';


ALTER TABLE ONLY bookings.route_fares
    ADD CONSTRAINT route_fares_pkey PRIMARY KEY (route_no, fare_conditions);


--
-- Name: airplane_price_factors; Type: TABLE; Schema: bookings; Owner: -
--
-- Per-airplane price multipliers with non-overlapping date validity.
-- The search query LEFT JOINs this and COALESCE-s a missing factor to 1.0,
-- so an empty table means "no airplane has a multiplier yet" and pricing
-- falls through to the raw route_fares.price.
--

CREATE TABLE bookings.airplane_price_factors (
    airplane_code character(3) NOT NULL,
    valid_from date NOT NULL,
    valid_to date,
    price_multiplier numeric(6,3) NOT NULL,
    CONSTRAINT airplane_price_factors_multiplier_check CHECK ((price_multiplier > (0)::numeric)),
    CONSTRAINT airplane_price_factors_validity_check CHECK ((valid_to IS NULL OR valid_to > valid_from))
);


COMMENT ON TABLE bookings.airplane_price_factors IS 'Per-airplane price multipliers, time-bounded. Missing rows treated as multiplier 1.0 by the search query.';

COMMENT ON COLUMN bookings.airplane_price_factors.airplane_code IS 'Airplane code, IATA';
COMMENT ON COLUMN bookings.airplane_price_factors.valid_from IS 'Inclusive lower bound of validity (date)';
COMMENT ON COLUMN bookings.airplane_price_factors.valid_to IS 'Exclusive upper bound of validity (date); NULL = open-ended';
COMMENT ON COLUMN bookings.airplane_price_factors.price_multiplier IS 'Multiplier applied to base route fare for this airplane in this period';


ALTER TABLE ONLY bookings.airplane_price_factors
    ADD CONSTRAINT airplane_price_factors_pkey PRIMARY KEY (airplane_code, valid_from);


ALTER TABLE ONLY bookings.airplane_price_factors
    ADD CONSTRAINT airplane_price_factors_no_overlap_excl
    EXCLUDE USING gist (
        airplane_code WITH =,
        daterange(valid_from, valid_to, '[)') WITH &&
    );


ALTER TABLE ONLY bookings.airplane_price_factors
    ADD CONSTRAINT airplane_price_factors_airplane_code_fkey
    FOREIGN KEY (airplane_code) REFERENCES bookings.airplanes(airplane_code);
