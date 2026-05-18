--
-- Tightens flight_leg_v to only include "bookable" flights — those a user
-- could still pick a seat on. Previously the view excluded only 'Cancelled',
-- so Departed/Arrived flights leaked into flight search results and then 409'd
-- at /flights/{id}/seats. The bookable status set here matches
-- SeatMapService.SELECTABLE_STATUSES.
--

CREATE OR REPLACE VIEW bookings.flight_leg_v AS
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
WHERE f.status IN ('Scheduled', 'On Time', 'Delayed', 'Boarding');


COMMENT ON VIEW bookings.flight_leg_v IS
    'Per-flight leg with timezone-resolved local date and minute-of-day fields. Restricted to bookable statuses (Scheduled, On Time, Delayed, Boarding).';
