import { SearchParams } from "../../flight/model/flight";

export function buildSavedSearchFlightsUrl(savedSearch: SearchParams | null) {
  if (!savedSearch) return "/flights";

  const params = new URLSearchParams({
    from: savedSearch.from,
    to: savedSearch.to,
    date: savedSearch.departDate,
    tripType: savedSearch.tripType ?? "oneWay",
    passengers: String(savedSearch.passengerCount),
  });

  return `/flights?${params.toString()}`;
}
