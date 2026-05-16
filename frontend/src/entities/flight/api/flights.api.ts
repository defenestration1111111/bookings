import { fetchJson } from "../../../shared/api/client";
import { FlightSearchRequest, FlightSearchResponse } from "../model/flight";

export async function searchFlights(
  request: FlightSearchRequest,
  signal?: AbortSignal
): Promise<FlightSearchResponse> {
  return fetchJson<FlightSearchResponse>("/flights/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
}
