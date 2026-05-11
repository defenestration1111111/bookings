import { fetchJson } from "../../../shared/api/client";
import type { Airport } from "../model/airport";

export async function searchAirports(
  query: string,
  limit = 10,
  signal?: AbortSignal,
): Promise<Airport[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return fetchJson<Airport[]>(`/airports/search?${params}`, {
    signal,
    timeoutMs: 5_000,
    retries: 0,
  });
}
