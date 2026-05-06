import { SearchParams } from "../model/flight";
import { MockFlightOption } from "../model/mocks";

function parseAirportCode(value: string): string {
  return value.split(", ")[1] ?? value;
}

export function matchesFlightSearch(flight: MockFlightOption, params: SearchParams): boolean {
  const outboundLegs = flight.legs.filter((leg) => leg.direction === "outbound");
  const firstLeg = outboundLegs[0];
  const lastOutbound = outboundLegs[outboundLegs.length - 1];

  if (!firstLeg || !lastOutbound) return false;

  const fromMatch = !params.from || firstLeg.from === parseAirportCode(params.from);
  const toMatch = !params.to || lastOutbound.to === parseAirportCode(params.to);
  const dateMatch = !params.departDate || firstLeg.departDate === params.departDate;
  const tripTypeMatch = !params.tripType || flight.tripType === params.tripType;

  return fromMatch && toMatch && dateMatch && tripTypeMatch;
}
