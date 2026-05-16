import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FareClass,
  FlightSearchFilters,
  SortBy,
} from "../../../entities/flight/model/flight";
import { Range } from "../../../shared/types/common";

export type FilterState = {
  priceRange: Range;
  departureRange: Range;
  arrivalRange: Range;
  fareClasses: FareClass[];
  maxStopovers: number;
  maxTravelHours: number | null;
  sortBy: SortBy;
};

export const PRICE_MIN = 0;
export const PRICE_MAX = 200_000;

const DEFAULTS: FilterState = {
  priceRange: [PRICE_MIN, PRICE_MAX],
  departureRange: [0, 1439],
  arrivalRange: [0, 1439],
  fareClasses: [],
  maxStopovers: 2,
  maxTravelHours: null,
  sortBy: "priceAsc",
};

type UseFlightFiltersResult = {
  state: FilterState;
  requestFilters: FlightSearchFilters;
  sortBy: SortBy;
  setPriceRange: (range: Range) => void;
  setDepartureRange: (range: Range) => void;
  setArrivalRange: (range: Range) => void;
  toggleFareClass: (fareClass: FareClass) => void;
  setMaxStopovers: (n: number) => void;
  setMaxTravelHours: (h: number | null) => void;
  setSortBy: (s: SortBy) => void;
};

function parseRange(
  params: URLSearchParams,
  key: string,
  fallback: Range
): Range {
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
    .filter(
      (value): value is FareClass =>
        value === "Economy" || value === "Comfort" || value === "Business"
    );
}

function parseInt0to2(raw: string | null, fallback: number): number {
  if (raw == null) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 2) return fallback;
  return n;
}

function parseTravelHours(raw: string | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 60) return null;
  return n;
}

function parseSort(raw: string | null): SortBy {
  if (
    raw === "priceAsc" ||
    raw === "priceDesc" ||
    raw === "durationAsc" ||
    raw === "departureAsc"
  ) {
    return raw;
  }
  return DEFAULTS.sortBy;
}

export function useFlightFilters(): UseFlightFiltersResult {
  const [urlParams, setUrlParams] = useSearchParams();

  const priceRangeParam = urlParams.get("priceRange");
  const departureRangeParam = urlParams.get("depRange");
  const arrivalRangeParam = urlParams.get("arrRange");
  const fareClassesParam = urlParams.get("fareClasses");
  const maxStopoversParam = urlParams.get("maxStopovers");
  const maxTravelHoursParam = urlParams.get("maxTravelHours");
  const sortParam = urlParams.get("sort");

  const state = useMemo<FilterState>(
    () => ({
      priceRange: parseRange(urlParams, "priceRange", DEFAULTS.priceRange),
      departureRange: parseRange(urlParams, "depRange", DEFAULTS.departureRange),
      arrivalRange: parseRange(urlParams, "arrRange", DEFAULTS.arrivalRange),
      fareClasses: parseFareClasses(urlParams),
      maxStopovers: parseInt0to2(maxStopoversParam, DEFAULTS.maxStopovers),
      maxTravelHours: parseTravelHours(maxTravelHoursParam),
      sortBy: parseSort(sortParam),
    }),
    [
      priceRangeParam,
      departureRangeParam,
      arrivalRangeParam,
      fareClassesParam,
      maxStopoversParam,
      maxTravelHoursParam,
      sortParam,
    ]
  );

  const requestFilters = useMemo<FlightSearchFilters>(() => {
    const filters: FlightSearchFilters = {
      maxStopovers: state.maxStopovers,
    };

    const [pMin, pMax] = state.priceRange;
    if (pMin > PRICE_MIN || pMax < PRICE_MAX) {
      filters.priceRange = { min: pMin, max: pMax };
    }

    const [dMin, dMax] = state.departureRange;
    if (dMin > 0 || dMax < 1439) {
      filters.departureMinutesRange = { min: dMin, max: dMax };
    }

    const [aMin, aMax] = state.arrivalRange;
    if (aMin > 0 || aMax < 1439) {
      filters.arrivalMinutesRange = { min: aMin, max: aMax };
    }

    if (state.fareClasses.length > 0) {
      filters.fareClasses = state.fareClasses;
    }

    if (state.maxTravelHours != null) {
      filters.maxTotalTravelTimeHours = state.maxTravelHours;
    }

    return filters;
  }, [state]);

  function updateParam(key: string, value: string | null) {
    setUrlParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value == null || value === "") {
        next.delete(key);
      } else {
        if (next.get(key) === value) return prev;
        next.set(key, value);
      }
      return next;
    });
  }

  return {
    state,
    requestFilters,
    sortBy: state.sortBy,
    setPriceRange: (r) => updateParam("priceRange", r.join(",")),
    setDepartureRange: (r) => updateParam("depRange", r.join(",")),
    setArrivalRange: (r) => updateParam("arrRange", r.join(",")),
    toggleFareClass: (fc) => {
      const next = state.fareClasses.includes(fc)
        ? state.fareClasses.filter((c) => c !== fc)
        : [...state.fareClasses, fc];
      updateParam("fareClasses", next.length ? next.join(",") : null);
    },
    setMaxStopovers: (n) => updateParam("maxStopovers", String(n)),
    setMaxTravelHours: (h) => updateParam("maxTravelHours", h == null ? null : String(h)),
    setSortBy: (s) => updateParam("sort", s === DEFAULTS.sortBy ? null : s),
  };
}
