import { FlightResult } from "../model/flight";
import { MockFlightOption } from "../model/mocks";

export function mapToFlightResult(flight: MockFlightOption): FlightResult {
  const outbound = flight.legs.filter(l => l.direction === "outbound");
  const inbound = flight.legs.filter(l => l.direction === "inbound");

  return {
    ...flight,
    outboundStops: outbound.length - 1,
    inboundStops: inbound.length > 0 ? inbound.length - 1 : null,
    legs: flight.legs,
  };
}