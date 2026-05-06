import { useTranslation } from "react-i18next";
import { calcNights } from "../../flight/lib/flightTime";
import { FlightOption } from "../../flight/model/flight";
import { RouteSection } from "../../flight/ui/RouteSection";

type Props = {
  flight: FlightOption;
  passengerCount: number;
};

export function TripSummary({ flight, passengerCount }: Props) {
  const { t } = useTranslation();

  const outboundLegs = flight.legs.filter(l => l.direction === "outbound");
  const inboundLegs = flight.legs.filter(l => l.direction === "inbound");
  const isRound = flight.tripType === "roundTrip" && inboundLegs.length > 0;

  const nightsBetween = isRound
    ? calcNights(
        outboundLegs[outboundLegs.length - 1].departDate,
        inboundLegs[0].departDate
      )
    : null;

  const destination = outboundLegs[outboundLegs.length - 1].to;

  return (
    <aside className="rounded-2xl border border-hairline bg-canvas overflow-hidden sticky top-6">
      <div className="px-4 py-3 border-b border-hairline">
        <p className="font-title-md text-title-md text-ink">
          {outboundLegs[0].from} → {destination}
          {isRound ? ` ${t("booking.tripSummary.andBack")}` : ""}
        </p>

        <p className="font-body-sm text-body-sm text-muted mt-0.5">
          {isRound
            ? t("booking.tripSummary.roundTrip")
            : t("booking.tripSummary.oneWay")}{" "}
          · {passengerCount}{" "}
          {passengerCount === 1
            ? t("booking.tripSummary.passenger")
            : t("booking.tripSummary.passengers")}
        </p>
      </div>

      <RouteSection
        legs={outboundLegs}
        label={`${outboundLegs[0].from} → ${destination}`}
      />

      {isRound && nightsBetween !== null && (
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-[11px] font-medium text-rausch whitespace-nowrap">
            {t("booking.tripSummary.nights", {
              count: nightsBetween,
              destination,
            })}
          </span>
          <div className="flex-1 h-px bg-hairline" />
        </div>
      )}

      {isRound && inboundLegs.length > 0 && (
        <RouteSection
          legs={inboundLegs}
          label={`${inboundLegs[0].from} → ${
            inboundLegs[inboundLegs.length - 1].to
          }`}
        />
      )}

      <div className="px-4 py-3 border-t border-hairline flex items-center justify-between">
        <span className="font-body-sm text-body-sm text-muted">
          {t("booking.tripSummary.total")}
        </span>
        <span className="font-title-md text-title-md text-ink">
          € {(flight.price * passengerCount).toLocaleString()}
        </span>
      </div>
    </aside>
  );
}
