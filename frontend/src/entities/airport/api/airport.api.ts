import { fetchJson } from "../../../shared/api/client";
import { Airport } from "../model/airport";

const mockAirports: Airport[] = [
  { city: "San Francisco", airport_code: "SFO" },
  { city: "New York",      airport_code: "JFK" },
  { city: "London",        airport_code: "LHR" },
  { city: "Tokyo",         airport_code: "HND" },
  // ...
];

// export async function getAirports(): Promise<Airport[]> {
//   return fetchJson<Airport[]>("/airports");
// }

export async function getAirports(signal?: AbortSignal): Promise<Airport[]> {
  return fetchJson<Airport[]>("/airports", { signal });
}