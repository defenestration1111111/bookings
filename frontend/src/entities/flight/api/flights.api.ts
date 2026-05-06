import { fetchJson } from "../../../shared/api/client";
import { SearchParams, FlightResult, FlightOption } from "../model/flight";

function buildSearchQuery(params: SearchParams): string {
  const query = new URLSearchParams();

  query.set("from", params.from);
  query.set("to", params.to);
  query.set("departDate", params.departDate);
  query.set("passengerCount", String(params.passengerCount));

  if (params.tripType) query.set("tripType", params.tripType);
  if (params.returnDate) query.set("returnDate", params.returnDate);
  if (params.fareClass) query.set("fareClass", params.fareClass);

  return query.toString();
}

export async function searchFlights(
  params: SearchParams,
  signal?: AbortSignal
): Promise<FlightResult[]> {
  return fetchJson<FlightResult[]>(
    `/flights/search?${buildSearchQuery(params)}`,
    { signal }
  );
}

export async function getFlightById(
  id: number,
  signal?: AbortSignal
): Promise<FlightOption> {
  return fetchJson<FlightOption>(`/flights/${id}`, { signal });
}