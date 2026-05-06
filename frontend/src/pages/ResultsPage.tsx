import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../entities/booking/model/BookingContext";
import { searchFlights } from "../entities/flight/api/flights.api";
import { TripType, FlightResult } from "../entities/flight/model/flight";
import FlightCard from "../entities/flight/ui/FlightCard";
import { useFlightFilters } from "../features/filter-flights/model/useFlightFilters";
import FlightFilters from "../features/filter-flights/ui/FlightFilters";
import { useFetch } from "../shared/api/useFetch";

export default function ResultsPage() {
  const [urlParams] = useSearchParams();
  const { selectFlight } = useBookingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const from = urlParams.get("from") ?? "";
  const to = urlParams.get("to") ?? "";
  const date = urlParams.get("date") ?? "";
  const passengers = Number(urlParams.get("passengers") ?? 1);
  const tripType = (urlParams.get("tripType") as TripType | null) ?? undefined;

  // useFetch cancels the previous request automatically when params change
  const {
    data: allFlights,
    loading,
    error,
    refetch,
  } = useFetch(
    (signal) =>
      searchFlights(
        { from, to, departDate: date, tripType, passengerCount: passengers },
        signal
      ),
    [from, to, date, tripType, passengers],
    // Skip the fetch entirely if we don't have a departure airport yet
    { enabled: Boolean(from) }
  );

  const { filters, filteredFlights, setPriceRange, setDepartureRange, setArrivalRange, toggleFareClass } =
    useFlightFilters(allFlights ?? []);

  function handleSelect(flight: FlightResult) {
    selectFlight(flight);
    navigate("/booking");
  }

  if (loading) {
    return <div className="p-12 text-center">{t("results.loading")}</div>;
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-500">
        <p>{t("results.error")}</p>
        <button
          className="mt-4 underline text-sm"
          onClick={refetch}
        >
          {t("results.retry")}
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8">
      <FlightFilters
        priceRange={filters.priceRange}
        departureRange={filters.departureRange}
        arrivalRange={filters.arrivalRange}
        fareClasses={filters.fareClasses}
        onPriceRange={setPriceRange}
        onDepartureRange={setDepartureRange}
        onArrivalRange={setArrivalRange}
        onFareClass={toggleFareClass}
      />

      <div className="flex-1">
        <h1 className="font-display-md text-display-md text-ink mb-6">
          {t("results.availableFlights")}
        </h1>

        <div className="flex flex-col gap-4">
          {filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onSelect={handleSelect} />
          ))}

          {filteredFlights.length === 0 && (
            <div className="rounded-[14px] border p-8 text-center text-muted">
              {t("results.noFlights")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}