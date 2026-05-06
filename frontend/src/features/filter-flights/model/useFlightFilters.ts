import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FareClass, FlightResult } from "../../../entities/flight/model/flight";
import { Range } from "../../../shared/types/common";


type Filters = {
  priceRange: Range;
  departureRange: Range;
  arrivalRange: Range;
  fareClasses: FareClass[];
};

type UseFlightFiltersResult = {
  filters: Filters;
  filteredFlights: FlightResult[];
  setPriceRange: (range: Range) => void;
  setDepartureRange: (range: Range) => void;
  setArrivalRange: (range: Range) => void;
  toggleFareClass: (fareClass: FareClass) => void;
};

const DEFAULTS = {
  priceRange: [200, 1200] as Range,
  departureRange: [0, 1439] as Range,
  arrivalRange: [360, 1439] as Range,
  fareClasses: [] as FareClass[],
};

function parseRange(params: URLSearchParams, key: string, fallback: Range): Range {
  const raw = params.get(key);
  if (!raw) return fallback;
  const [a, b] = raw.split(",").map(Number);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return fallback;
  return [a, b];
}

function parseFareClasses(params: URLSearchParams): FareClass[] {
  const raw = params.get("fareClasses");
  if (!raw) return DEFAULTS.fareClasses;
  return raw
    .split(",")
    .filter((value): value is FareClass =>
      value === "Economy" || value === "Comfort" || value === "Business"
    );
}

function filterFlights(flights: FlightResult[], filters: Filters): FlightResult[] {
  return flights.filter(flight => {
    const leg = flight.legs[0];
    return (
      flight.price >= filters.priceRange[0] &&
      flight.price <= filters.priceRange[1] &&
      leg.departMinutes >= filters.departureRange[0] &&
      leg.departMinutes <= filters.departureRange[1] &&
      leg.arriveMinutes >= filters.arrivalRange[0] &&
      leg.arriveMinutes <= filters.arrivalRange[1] &&
      (filters.fareClasses.length === 0 || filters.fareClasses.includes(flight.fareClass))
    );
  });
}

export function useFlightFilters(flights: FlightResult[]): UseFlightFiltersResult {
  const [urlParams, setUrlParams] = useSearchParams();

  const priceRangeParam = urlParams.get("priceRange");
  const departureRangeParam = urlParams.get("depRange");
  const arrivalRangeParam = urlParams.get("arrRange");
  const fareClassesParam = urlParams.get("fareClasses");

  const filters = useMemo<Filters>(() => ({
    priceRange: parseRange(urlParams, "priceRange", DEFAULTS.priceRange),
    departureRange: parseRange(urlParams, "depRange", DEFAULTS.departureRange),
    arrivalRange: parseRange(urlParams, "arrRange", DEFAULTS.arrivalRange),
    fareClasses: parseFareClasses(urlParams),
  }), [priceRangeParam, departureRangeParam, arrivalRangeParam, fareClassesParam]);

  function updateParam(key: string, value: string) {
    setUrlParams(prev => {
      const next = new URLSearchParams(prev);
      if (next.get(key) === value) return prev;
      next.set(key, value);
      return next;
    });
  }

  function setPriceRange(range: Range) {
    updateParam("priceRange", range.join(","));
  }

  function setDepartureRange(range: Range) {
    updateParam("depRange", range.join(","));
  }

  function setArrivalRange(range: Range) {
    updateParam("arrRange", range.join(","));
  }

  function toggleFareClass(fareClass: FareClass) {
    const current = filters.fareClasses;
    const next = current.includes(fareClass)
      ? current.filter(c => c !== fareClass)
      : [...current, fareClass];
    updateParam("fareClasses", next.join(","));
  }

  const filteredFlights = useMemo(() => {
    return filterFlights(flights, filters);
  }, [flights, filters]);

  return {
    filters,
    filteredFlights,
    setPriceRange,
    setDepartureRange,
    setArrivalRange,
    toggleFareClass,
  };
}
