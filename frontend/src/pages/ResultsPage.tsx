import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../entities/booking/model/BookingContext";
import { searchFlights } from "../entities/flight/api/flights.api";
import { Itinerary, SortBy } from "../entities/flight/model/flight";
import FlightCard from "../entities/flight/ui/FlightCard";
import { useFlightFilters } from "../features/filter-flights/model/useFlightFilters";
import FlightFilters from "../features/filter-flights/ui/FlightFilters";
import { useFetch } from "../shared/api/useFetch";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "priceAsc", label: "Cheapest first" },
  { value: "priceDesc", label: "Most expensive first" },
  { value: "durationAsc", label: "Shortest trip first" },
  { value: "departureAsc", label: "Earliest departure" },
];

function extractIataCode(value: string): string {
  return (value.split(", ")[1] ?? value).trim().toUpperCase();
}

export default function ResultsPage() {
  const [urlParams] = useSearchParams();
  const { selectFlight } = useBookingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const origin = extractIataCode(urlParams.get("from") ?? "");
  const destination = extractIataCode(urlParams.get("to") ?? "");
  const departureDate = urlParams.get("date") ?? "";
  const passengerCount = Number(urlParams.get("passengers") ?? 1);

  const {
    state,
    requestFilters,
    sortBy,
    setPriceRange,
    setDepartureRange,
    setArrivalRange,
    toggleFareClass,
    setMaxStopovers,
    setMaxTravelHours,
    setSortBy,
  } = useFlightFilters();

  const isValidSearch =
    /^[A-Z]{3}$/.test(origin) &&
    /^[A-Z]{3}$/.test(destination) &&
    !!departureDate;

  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch(
    (signal) =>
      searchFlights(
        {
          origin,
          destination,
          departureDate,
          passengerCount,
          sortBy,
          page: 0,
          pageSize: 20,
          filters: requestFilters,
        },
        signal
      ),
    [
      origin,
      destination,
      departureDate,
      passengerCount,
      sortBy,
      requestFilters,
    ],
    { enabled: isValidSearch }
  );

  const itineraries = data?.results ?? [];

  function handleSelect(itinerary: Itinerary) {
    selectFlight(itinerary);
    navigate("/booking");
  }

  if (loading) {
    return <div className="p-12 text-center">{t("results.loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-500">
        <p>{t("results.error")}</p>
        <button className="mt-4 underline text-sm" onClick={refetch}>
          {t("results.retry")}
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8">
      <FlightFilters
        priceRange={state.priceRange}
        departureRange={state.departureRange}
        arrivalRange={state.arrivalRange}
        fareClasses={state.fareClasses}
        maxStopovers={state.maxStopovers}
        maxTravelHours={state.maxTravelHours}
        onPriceRange={setPriceRange}
        onDepartureRange={setDepartureRange}
        onArrivalRange={setArrivalRange}
        onFareClass={toggleFareClass}
        onMaxStopovers={setMaxStopovers}
        onMaxTravelHours={setMaxTravelHours}
      />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="font-display-md text-display-md text-ink">
            {t("results.availableFlights")}
          </h1>

          <label className="flex items-center gap-2 font-body-sm text-body-sm text-muted">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="border border-border-strong rounded-lg px-3 py-2 bg-canvas text-ink focus:ring-rausch focus:border-rausch"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {data && (
          <p className="font-body-sm text-body-sm text-muted mb-4">
            {data.totalResults === 0
              ? t("results.noFlights")
              : `${data.totalResults} ${
                  data.totalResults === 1 ? "result" : "results"
                }`}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {itineraries.map((it) => (
            <FlightCard key={it.id} itinerary={it} onSelect={handleSelect} />
          ))}

          {itineraries.length === 0 && (
            <div className="rounded-[14px] border p-8 text-center text-muted">
              {t("results.noFlights")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
