import { FlightOption } from "../../flight/model/flight";

export const DEFAULT_BAGGAGE_FEE = 50;
export const DEFAULT_TAXES = 85.5;

export function calculateBookingPrice(
  flight: FlightOption,
  passengerCount: number
) {
  const fareTotal = flight.price * passengerCount;
  const total = fareTotal + DEFAULT_TAXES + DEFAULT_BAGGAGE_FEE;

  return {
    fareTotal,
    taxes: DEFAULT_TAXES,
    baggageFee: DEFAULT_BAGGAGE_FEE,
    total,
  };
}

export function formatPassengerLabel(passengerCount: number) {
  return `${passengerCount} ${passengerCount === 1 ? "adult" : "adults"}`;
}
