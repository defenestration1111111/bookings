--
-- Name: flight_leg_v; Type: VIEW; Schema: bookings; Owner: -
--
-- One row per scheduled, non-cancelled flight, joined to its route and to
-- the departure/arrival airport metadata. Pre-computes the timezone-resolved
-- local date, local minute-of-day for departure and arrival, and the
-- flight's scheduled duration in minutes. Used as the leg primitive for
-- flight search so per-leg time-zone arithmetic isn't repeated per query.
--

CREATE VIEW bookings.flight_leg_v AS
SELECT
    f.flight_id,
    f.route_no,
    r.airplane_code,
    r.departure_airport AS dep_code,
    r.arrival_airport   AS arr_code,
    f.scheduled_departure AS dep_at,
    f.scheduled_arrival   AS arr_at,
    CAST(EXTRACT(EPOCH FROM (f.scheduled_arrival - f.scheduled_departure)) / 60 AS integer)
        AS flight_minutes,
    CAST(f.scheduled_departure AT TIME ZONE dep.timezone AS date) AS dep_local_date,
    CAST(EXTRACT(HOUR   FROM f.scheduled_departure AT TIME ZONE dep.timezone) * 60
       + EXTRACT(MINUTE FROM f.scheduled_departure AT TIME ZONE dep.timezone) AS integer)
        AS dep_local_min,
    CAST(EXTRACT(HOUR   FROM f.scheduled_arrival   AT TIME ZONE arr.timezone) * 60
       + EXTRACT(MINUTE FROM f.scheduled_arrival   AT TIME ZONE arr.timezone) AS integer)
        AS arr_local_min
FROM bookings.flights f
JOIN bookings.routes r
  ON r.route_no = f.route_no AND r.validity @> f.scheduled_departure
JOIN bookings.airports dep ON dep.airport_code = r.departure_airport
JOIN bookings.airports arr ON arr.airport_code = r.arrival_airport
WHERE f.status <> 'Cancelled';


COMMENT ON VIEW bookings.flight_leg_v IS
    'Per-flight leg with timezone-resolved local date and minute-of-day fields. Excludes Cancelled flights.';


--
-- Name: priced_leg_v; Type: VIEW; Schema: bookings; Owner: -
--
-- flight_leg_v fanned out by fare_conditions, with the per-leg price
-- (base route fare * airplane price multiplier for the departure date).
-- A leg appears once per fare class that has a route_fares row. Missing
-- airplane_price_factors coverage falls through to a 1.0 multiplier.
--

CREATE VIEW bookings.priced_leg_v AS
SELECT
    l.flight_id,
    l.route_no,
    l.airplane_code,
    l.dep_code,
    l.arr_code,
    l.dep_at,
    l.arr_at,
    l.flight_minutes,
    l.dep_local_date,
    l.dep_local_min,
    l.arr_local_min,
    rf.fare_conditions,
    rf.price * COALESCE(apf.price_multiplier, 1.0) AS leg_price
FROM bookings.flight_leg_v l
JOIN bookings.route_fares rf ON rf.route_no = l.route_no
LEFT JOIN bookings.airplane_price_factors apf
    ON apf.airplane_code = l.airplane_code
    AND daterange(apf.valid_from, apf.valid_to, '[)') @> CAST(l.dep_at AS date);


COMMENT ON VIEW bookings.priced_leg_v IS
    'Per-leg, per-fare-class priced view. leg_price = route_fares.price * COALESCE(airplane price multiplier, 1.0).';
