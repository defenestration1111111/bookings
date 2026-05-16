import type { components } from "../../../shared/api/schema";

export type Itinerary = components["schemas"]["Itinerary"];
export type Leg = components["schemas"]["Leg"];
export type AirportSummary = components["schemas"]["AirportSummary"];
export type FareClass = components["schemas"]["FareClass"];
export type SortBy = components["schemas"]["SortBy"];
export type PriceRange = components["schemas"]["PriceRange"];
export type MinuteRange = components["schemas"]["MinuteRange"];
export type FlightSearchRequest = components["schemas"]["FlightSearchRequest"];
export type FlightSearchFilters = components["schemas"]["FlightSearchFilters"];
export type FlightSearchResponse = components["schemas"]["FlightSearchResponse"];

export type TripType = "roundTrip" | "oneWay";

export type SearchParams = {
  from: string;
  to: string;
  departDate: string;
  tripType?: TripType;
  returnDate?: string;
  passengerCount: number;
};
