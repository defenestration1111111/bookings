import { useTranslation } from "react-i18next";
import { Itinerary } from "../../flight/model/flight";
import { RouteSection } from "../../flight/ui/RouteSection";

type Props = {
  flight: Itinerary;
  passengerCount: number;
};

export function TripSummary({ flight, passengerCount }: Props) {
  const { t } = useTranslation();

  const origin = flight.legs[0].fromAirport.airportCode;
  const destination = flight.legs[flight.legs.length - 1].toAirport.airportCode;

  return (
    <aside className="rounded-2xl border border-hairline bg-canvas overflow-hidden sticky top-6">
      <div className="px-4 py-3 border-b border-hairline">
        <p className="font-title-md text-title-md text-ink">
          {origin} → {destination}
        </p>

        <p className="font-body-sm text-body-sm text-muted mt-0.5">
          {t("booking.tripSummary.oneWay")} · {passengerCount}{" "}
          {passengerCount === 1
            ? t("booking.tripSummary.passenger")
            : t("booking.tripSummary.passengers")}
        </p>
      </div>

      <RouteSection legs={flight.legs} label={`${origin} → ${destination}`} />

      <div className="px-4 py-3 border-t border-hairline flex items-center justify-between">
        <span className="font-body-sm text-body-sm text-muted">
          {t("booking.tripSummary.total")}
        </span>
        <span className="font-title-md text-title-md text-ink">
          {flight.currency} {(flight.price * passengerCount).toLocaleString()}
        </span>
      </div>
    </aside>
  );
}
