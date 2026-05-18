-- Minimal seed for booking repository and service tests.
--
-- Two airplanes (320 with a few seats, 773 with a few seats), one route
-- LHR-JFK with fares for all three classes, two flights on 2026-06-01 —
-- one Scheduled (bookable), one Cancelled (rejected by status check).
-- A pre-existing booking occupies seat 1A on flight 100 so seat-taken
-- conflict assertions have something to hit.

-- FK order matters for cleanup.
DELETE FROM bookings.boarding_passes;
DELETE FROM bookings.segments;
DELETE FROM bookings.tickets;
DELETE FROM bookings.bookings;
DELETE FROM bookings.airplane_price_factors;
DELETE FROM bookings.route_fares;
DELETE FROM bookings.flights;
DELETE FROM bookings.routes;
DELETE FROM bookings.aircraft_layouts;
DELETE FROM bookings.seats;
DELETE FROM bookings.airports;
DELETE FROM bookings.airplanes;

INSERT INTO bookings.airplanes (airplane_code, model, range, speed) VALUES
  ('320', 'Airbus A320',     6500,  850),
  ('773', 'Boeing 777-300', 12000,  905);

INSERT INTO bookings.airports
  (airport_code, airport_name, city, country, coordinates, timezone) VALUES
  ('LHR', 'London Heathrow', 'London',   'United Kingdom', '(-0.4543,51.4700)',  'Europe/London'),
  ('JFK', 'John F. Kennedy', 'New York', 'United States',  '(-73.7781,40.6413)', 'America/New_York');

INSERT INTO bookings.routes
  (route_no, validity, departure_airport, arrival_airport, airplane_code,
   days_of_week, scheduled_time, duration) VALUES
  ('LHR-JFK', tstzrange('2026-01-01', '2027-01-01'),
   'LHR', 'JFK', '773',
   ARRAY[1,2,3,4,5,6,7], '10:00', INTERVAL '7 hours');

INSERT INTO bookings.route_fares (route_no, fare_conditions, price) VALUES
  ('LHR-JFK', 'Economy',   500.00),
  ('LHR-JFK', 'Comfort',   900.00),
  ('LHR-JFK', 'Business', 2000.00);

INSERT INTO bookings.flights
  (flight_id, route_no, status, scheduled_departure, scheduled_arrival)
OVERRIDING SYSTEM VALUE VALUES
  (100, 'LHR-JFK', 'Scheduled', '2026-06-01T10:00:00Z', '2026-06-01T17:00:00Z'),
  (101, 'LHR-JFK', 'Cancelled', '2026-06-02T10:00:00Z', '2026-06-02T17:00:00Z');

-- Seats on the 773 used by the routes above. Two Economy, one Business.
INSERT INTO bookings.seats (airplane_code, seat_no, fare_conditions) VALUES
  ('773', '1A',  'Business'),
  ('773', '12A', 'Economy'),
  ('773', '12B', 'Economy'),
  ('773', '15A', 'Comfort');

-- Pre-existing booking occupying flight 100 / seat 1A.
INSERT INTO bookings.bookings (book_ref, book_date, total_amount) VALUES
  ('AAAAAA', '2026-05-01T00:00:00Z', 2000.00);

INSERT INTO bookings.tickets
  (ticket_no, book_ref, passenger_id, passenger_name, outbound) VALUES
  ('0000000000001', 'AAAAAA', 'EXISTPAX01', 'Existing Passenger', TRUE);

INSERT INTO bookings.segments
  (ticket_no, flight_id, fare_conditions, price, seat_no) VALUES
  ('0000000000001', 100, 'Business', 2000.00, '1A');
