import { MockFlightOption } from "./mocks";

export const mockFlights: MockFlightOption[] = [
  // ── JFK → LHR oneWay (15 мая) ────────────────────────────
  {
    id: 1,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 14,
    price: 450,
    legs: [{
      from: "JFK", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "08:00 AM", arriveTime: "08:30 PM",
      duration: "7h 30m", stops: 0,
      departMinutes: 480, arriveMinutes: 1230
    }]
  },
  {
    id: 2,
    tripType: "oneWay",
    fareClass: "Comfort",
    offers: 6,
    price: 780,
    legs: [{
      from: "JFK", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "01:00 PM", arriveTime: "01:45 AM",
      duration: "7h 45m", stops: 0,
      departMinutes: 780, arriveMinutes: 1545,
      nextDay: "+1"
    }]
  },
  {
    id: 3,
    tripType: "oneWay",
    fareClass: "Business",
    offers: 3,
    price: 2100,
    legs: [{
      from: "JFK", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "10:00 PM", arriveTime: "10:00 AM",
      duration: "7h 00m", stops: 0,
      departMinutes: 1320, arriveMinutes: 600,
      nextDay: "+1"
    }]
  },
  {
    id: 4,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 9,
    price: 340,
    legs: [
      {
        from: "JFK", to: "CDG",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "07:00 AM", arriveTime: "09:00 PM",
        duration: "7h 00m", stops: 0,
        departMinutes: 420, arriveMinutes: 1260
      },
      {
        from: "CDG", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-16",
        departTime: "06:00 AM", arriveTime: "06:45 AM",
        duration: "1h 45m", stops: 0,
        departMinutes: 360, arriveMinutes: 405
      }
    ]
  },
  {
    id: 5,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 11,
    price: 490,
    legs: [{
      from: "JFK", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-20",
      departTime: "09:30 AM", arriveTime: "10:00 PM",
      duration: "7h 30m", stops: 0,
      departMinutes: 570, arriveMinutes: 1320
    }]
  },
  {
    id: 6,
    tripType: "oneWay",
    fareClass: "Business",
    offers: 2,
    price: 1100,
    legs: [{
      from: "JFK", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-20",
      departTime: "07:00 PM", arriveTime: "07:00 AM",
      duration: "7h 00m", stops: 0,
      departMinutes: 1140, arriveMinutes: 420,
      nextDay: "+1"
    }]
  },
  {
    id: 7,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 8,
    price: 620,
    legs: [{
      from: "SFO", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "03:00 PM", arriveTime: "11:00 AM",
      duration: "10h 00m", stops: 0,
      departMinutes: 900, arriveMinutes: 660,
      nextDay: "+1"
    }]
  },
  {
    id: 8,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 5,
    price: 510,
    legs: [
      {
        from: "SFO", to: "JFK",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "06:00 AM", arriveTime: "02:30 PM",
        duration: "5h 30m", stops: 0,
        departMinutes: 360, arriveMinutes: 870
      },
      {
        from: "JFK", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "06:00 PM", arriveTime: "06:30 AM",
        duration: "7h 30m", stops: 0,
        departMinutes: 1080, arriveMinutes: 390,
        nextDay: "+1"
      }
    ]
  },
  {
    id: 9,
    tripType: "oneWay",
    fareClass: "Comfort",
    offers: 4,
    price: 950,
    legs: [{
      from: "SFO", to: "LHR",
      direction: "outbound",
      departDate: "2026-05-20",
      departTime: "05:00 PM", arriveTime: "01:00 PM",
      duration: "10h 00m", stops: 0,
      departMinutes: 1020, arriveMinutes: 780,
      nextDay: "+1"
    }]
  },
  {
    id: 10,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 12,
    price: 420,
    legs: [{
      from: "LHR", to: "JFK",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "11:00 AM", arriveTime: "02:00 PM",
      duration: "8h 00m", stops: 0,
      departMinutes: 660, arriveMinutes: 840
    }]
  },
  {
    id: 11,
    tripType: "oneWay",
    fareClass: "Business",
    offers: 3,
    price: 845,
    legs: [{
      from: "LHR", to: "JFK",
      direction: "outbound",
      departDate: "2026-05-20",
      departTime: "09:00 AM", arriveTime: "12:00 PM",
      duration: "8h 00m", stops: 0,
      departMinutes: 540, arriveMinutes: 720
    }]
  },
  {
    id: 12,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 18,
    price: 180,
    legs: [{
      from: "SFO", to: "JFK",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "07:00 AM", arriveTime: "03:30 PM",
      duration: "5h 30m", stops: 0,
      departMinutes: 420, arriveMinutes: 930
    }]
  },
  {
    id: 13,
    tripType: "oneWay",
    fareClass: "Comfort",
    offers: 7,
    price: 310,
    legs: [{
      from: "SFO", to: "JFK",
      direction: "outbound",
      departDate: "2026-05-15",
      departTime: "12:00 PM", arriveTime: "08:30 PM",
      duration: "5h 30m", stops: 0,
      departMinutes: 720, arriveMinutes: 1230
    }]
  },
  {
    id: 14,
    tripType: "oneWay",
    fareClass: "Economy",
    offers: 10,
    price: 210,
    legs: [{
      from: "SFO", to: "JFK",
      direction: "outbound",
      departDate: "2026-05-20",
      departTime: "10:00 AM", arriveTime: "06:30 PM",
      duration: "5h 30m", stops: 0,
      departMinutes: 600, arriveMinutes: 1110
    }]
  },

  // ── roundTrip ─────────────────────────────────────────────
  {
    id: 15,
    tripType: "roundTrip",
    fareClass: "Economy",
    offers: 10,
    price: 820,
    legs: [
      {
        from: "JFK", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "08:00 AM", arriveTime: "08:30 PM",
        duration: "7h 30m", stops: 0,
        departMinutes: 480, arriveMinutes: 1230
      },
      {
        from: "LHR", to: "JFK",
        direction: "inbound",
        departDate: "2026-05-22",
        departTime: "11:00 AM", arriveTime: "02:00 PM",
        duration: "8h 00m", stops: 0,
        departMinutes: 660, arriveMinutes: 840
      }
    ]
  },
  {
    id: 16,
    tripType: "roundTrip",
    fareClass: "Economy",
    offers: 6,
    price: 640,
    legs: [
      {
        from: "JFK", to: "CDG",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "07:00 AM", arriveTime: "09:00 PM",
        duration: "7h 00m", stops: 0,
        departMinutes: 420, arriveMinutes: 1260
      },
      {
        from: "CDG", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-16",
        departTime: "06:00 AM", arriveTime: "06:45 AM",
        duration: "1h 45m", stops: 0,
        departMinutes: 360, arriveMinutes: 405
      },
      {
        from: "LHR", to: "AMS",
        direction: "inbound",
        departDate: "2026-05-22",
        departTime: "10:00 AM", arriveTime: "12:15 PM",
        duration: "1h 15m", stops: 0,
        departMinutes: 600, arriveMinutes: 735
      },
      {
        from: "AMS", to: "JFK",
        direction: "inbound",
        departDate: "2026-05-22",
        departTime: "02:00 PM", arriveTime: "04:30 PM",
        duration: "8h 30m", stops: 0,
        departMinutes: 840, arriveMinutes: 990
      }
    ]
  },
  {
    id: 17,
    tripType: "roundTrip",
    fareClass: "Comfort",
    offers: 4,
    price: 550,
    legs: [
      {
        from: "SFO", to: "ORD",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "06:00 AM", arriveTime: "12:00 PM",
        duration: "4h 00m", stops: 0,
        departMinutes: 360, arriveMinutes: 720
      },
      {
        from: "ORD", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "03:00 PM", arriveTime: "06:00 AM",
        duration: "9h 00m", stops: 0,
        departMinutes: 900, arriveMinutes: 360,
        nextDay: "+1"
      },
      {
        from: "LHR", to: "CDG",
        direction: "inbound",
        departDate: "2026-05-22",
        departTime: "08:00 AM", arriveTime: "10:15 AM",
        duration: "1h 15m", stops: 0,
        departMinutes: 480, arriveMinutes: 615
      },
      {
        from: "CDG", to: "SFO",
        direction: "inbound",
        departDate: "2026-05-22",
        departTime: "12:00 PM", arriveTime: "02:30 PM",
        duration: "11h 30m", stops: 0,
        departMinutes: 720, arriveMinutes: 870
      }
    ]
  },
  {
    id: 18,
    tripType: "roundTrip",
    fareClass: "Business",
    offers: 2,
    price: 740,
    legs: [
      {
        from: "JFK", to: "LHR",
        direction: "outbound",
        departDate: "2026-05-15",
        departTime: "10:00 PM", arriveTime: "10:00 AM",
        duration: "7h 00m", stops: 0,
        departMinutes: 1320, arriveMinutes: 600,
        nextDay: "+1"
      },
      {
        from: "LHR", to: "JFK",
        direction: "inbound",
        departDate: "2026-05-25",
        departTime: "09:00 AM", arriveTime: "12:00 PM",
        duration: "8h 00m", stops: 0,
        departMinutes: 540, arriveMinutes: 720
      }
    ]
  },
];