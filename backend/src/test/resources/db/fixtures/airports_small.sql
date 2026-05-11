DELETE FROM bookings.airports;

INSERT INTO bookings.airports (airport_code, airport_name, city, country, coordinates, timezone) VALUES
  ('LHR', 'London Heathrow',  'London',        'United Kingdom', '(-0.4543,51.4700)',   'Europe/London'),
  ('LGW', 'London Gatwick',   'London',        'United Kingdom', '(-0.1903,51.1481)',   'Europe/London'),
  ('JFK', 'John F. Kennedy',  'New York',      'United States',  '(-73.7781,40.6413)',  'America/New_York'),
  ('SFO', 'San Francisco',    'San Francisco', 'United States',  '(-122.3790,37.6213)', 'America/Los_Angeles'),
  ('HND', 'Tokyo Haneda',     'Tokyo',         'Japan',          '(139.7798,35.5494)',  'Asia/Tokyo'),
  ('NRT', 'Narita',           'Tokyo',         'Japan',          '(140.3929,35.7720)',  'Asia/Tokyo'),
  ('CDG', 'Charles de Gaulle','Paris',         'France',         '(2.5479,49.0097)',    'Europe/Paris'),
  ('ORY', 'Orly',             'Paris',         'France',         '(2.3793,48.7233)',    'Europe/Paris'),
  ('AMS', 'Schiphol',         'Amsterdam',     'Netherlands',    '(4.7639,52.3105)',    'Europe/Amsterdam'),
  ('FRA', 'Frankfurt',        'Frankfurt',     'Germany',        '(8.5706,50.0379)',    'Europe/Frankfurt');
