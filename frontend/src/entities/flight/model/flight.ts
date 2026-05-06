// Перечисления — фиксированные наборы значений
export type TripType = "roundTrip" | "oneWay";
export type FareClass = "Economy" | "Comfort" | "Business";

export type FlightLeg = {
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  departMinutes: number;
  arriveMinutes: number;
  departDate: string;        // ← добавить
  direction: "outbound" | "inbound"; // ← добавить
  nextDay?: string;
};

export type FlightOption = {
  id: number;
  tripType: TripType;
  fareClass: FareClass;
  offers: number;
  price: number;
  // outboundStops: number;        // 👈
  // inboundStops: number | null;  // 👈 null для oneWay
  legs: FlightLeg[];
};

// Новый тип — параметры поиска для API
export type SearchParams = {
  from: string;
  to: string;
  departDate: string;
  tripType?: TripType;
  returnDate?: string;      // только для roundTrip
  passengerCount: number;
  fareClass?: FareClass;    // необязательный фильтр
};

export type FlightResult = FlightOption & {
  outboundStops: number;
  inboundStops: number | null;
};