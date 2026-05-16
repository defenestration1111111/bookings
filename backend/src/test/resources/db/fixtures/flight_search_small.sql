-- Minimal seed for flight-search repository tests.
--
-- Origin/destination: LHR → JFK on 2026-06-01.
-- DST in effect on this date: LHR=BST (UTC+1), AMS/CDG=CEST (UTC+2), JFK=EDT (UTC-4).
-- All flight times are stored UTC; local-date / local-hour are derived in flight_leg_v.

-- Order matters because of FKs: route_fares.* references airplanes/airports via routes.
DELETE FROM bookings.airplane_price_factors;
DELETE FROM bookings.route_fares;
DELETE FROM bookings.flights;
DELETE FROM bookings.routes;
DELETE FROM bookings.airports;
DELETE FROM bookings.airplanes;

INSERT INTO bookings.airplanes (airplane_code, model, range, speed) VALUES
  ('320', 'Airbus A320',     6500,  850),
  ('773', 'Boeing 777-300', 12000,  905);

INSERT INTO bookings.airports (airport_code, airport_name, city, country, coordinates, timezone) VALUES
  ('LHR', 'London Heathrow',   'London',    'United Kingdom', '(-0.4543,51.4700)',   'Europe/London'),
  ('AMS', 'Schiphol',          'Amsterdam', 'Netherlands',    '(4.7639,52.3105)',    'Europe/Amsterdam'),
  ('JFK', 'John F. Kennedy',   'New York',  'United States',  '(-73.7781,40.6413)',  'America/New_York'),
  ('CDG', 'Charles de Gaulle', 'Paris',     'France',         '(2.5479,49.0097)',    'Europe/Paris');

-- Routes — wide validity covers the 2026-06-01 test date.
INSERT INTO bookings.routes (route_no, validity, departure_airport, arrival_airport, airplane_code, days_of_week, scheduled_time, duration) VALUES
  ('LHR-JFK', tstzrange('2026-01-01', '2027-01-01'), 'LHR', 'JFK', '773', ARRAY[1,2,3,4,5,6,7], '10:00', INTERVAL '7 hours'),
  ('LHR-AMS', tstzrange('2026-01-01', '2027-01-01'), 'LHR', 'AMS', '320', ARRAY[1,2,3,4,5,6,7], '10:00', INTERVAL '1 hours'),
  ('AMS-JFK', tstzrange('2026-01-01', '2027-01-01'), 'AMS', 'JFK', '773', ARRAY[1,2,3,4,5,6,7], '12:30', INTERVAL '8 hours'),
  ('LHR-CDG', tstzrange('2026-01-01', '2027-01-01'), 'LHR', 'CDG', '320', ARRAY[1,2,3,4,5,6,7], '10:00', INTERVAL '90 minutes'),
  ('CDG-AMS', tstzrange('2026-01-01', '2027-01-01'), 'CDG', 'AMS', '320', ARRAY[1,2,3,4,5,6,7], '13:00', INTERVAL '90 minutes');

INSERT INTO bookings.route_fares (route_no, fare_conditions, price) VALUES
  ('LHR-JFK', 'Economy',  500.00),
  ('LHR-JFK', 'Comfort',  900.00),
  ('LHR-JFK', 'Business', 2000.00),
  ('LHR-AMS', 'Economy',  100.00),
  ('LHR-AMS', 'Comfort',  200.00),
  ('LHR-AMS', 'Business', 400.00),
  ('AMS-JFK', 'Economy',  400.00),
  ('AMS-JFK', 'Comfort',  800.00),
  ('AMS-JFK', 'Business', 1800.00),
  ('LHR-CDG', 'Economy',   80.00),
  ('LHR-CDG', 'Comfort',  160.00),
  ('LHR-CDG', 'Business',  320.00),
  ('CDG-AMS', 'Economy',   90.00),
  ('CDG-AMS', 'Comfort',  180.00),
  ('CDG-AMS', 'Business',  360.00);

-- Flights. flight_id is GENERATED ALWAYS AS IDENTITY in V1, so we use OVERRIDING SYSTEM VALUE
-- to pin ids the tests can assert against.
INSERT INTO bookings.flights (flight_id, route_no, status, scheduled_departure, scheduled_arrival)
OVERRIDING SYSTEM VALUE VALUES
  -- Direct LHR → JFK on 2026-06-01 (daytime, same-day local arrival).
  (1, 'LHR-JFK', 'Scheduled', '2026-06-01T10:00:00Z', '2026-06-01T17:00:00Z'),
  -- A second direct, later in the day — used for sort/ranking assertions.
  (2, 'LHR-JFK', 'Scheduled', '2026-06-01T14:00:00Z', '2026-06-01T21:00:00Z'),
  -- Late direct that crosses local midnight on arrival side (next-day-arrival = true at JFK
  -- because 05:00Z is 01:00 EDT on 2026-06-02; dep local date is still 2026-06-01 at LHR).
  (3, 'LHR-JFK', 'Scheduled', '2026-06-01T22:00:00Z', '2026-06-02T05:00:00Z'),
  -- Cancelled flight — must NOT appear in flight_leg_v / search results.
  (4, 'LHR-JFK', 'Cancelled', '2026-06-01T09:00:00Z', '2026-06-01T16:00:00Z'),

  -- One-stop ingredients (daytime).
  (5, 'LHR-AMS', 'Scheduled', '2026-06-01T10:00:00Z', '2026-06-01T11:00:00Z'),
  -- 90-minute connection from flight 5 — happy-path one-stop.
  (6, 'AMS-JFK', 'Scheduled', '2026-06-01T12:30:00Z', '2026-06-01T20:30:00Z'),
  -- 20-minute connection from flight 5 — excluded by the 45-minute JOIN predicate.
  (7, 'AMS-JFK', 'Scheduled', '2026-06-01T11:20:00Z', '2026-06-01T19:20:00Z'),

  -- One-stop ingredients (overnight). Flight 8 lands at 23:00Z which is 01:00 CEST next day
  -- (arr_local_hour = 1 < 6 → overnight branch fires regardless of layover length).
  (8, 'LHR-AMS', 'Scheduled', '2026-06-01T22:00:00Z', '2026-06-01T23:00:00Z'),
  -- 9-hour layover into next morning — overnight when paired with flight 8.
  (9, 'AMS-JFK', 'Scheduled', '2026-06-02T08:00:00Z', '2026-06-02T16:00:00Z'),

  -- Two-stop ingredients: LHR → CDG → AMS → JFK, all daytime.
  (10, 'LHR-CDG', 'Scheduled', '2026-06-01T10:00:00Z', '2026-06-01T11:30:00Z'),
  (11, 'CDG-AMS', 'Scheduled', '2026-06-01T13:00:00Z', '2026-06-01T14:30:00Z'),
  -- Last leg used by the two-stop chain (and also a candidate for one-stop chains starting
  -- from flight 5, since it departs after 5+45min).
  (12, 'AMS-JFK', 'Scheduled', '2026-06-01T16:00:00Z', '2026-06-02T00:00:00Z');
