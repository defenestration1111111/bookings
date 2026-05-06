import { useTranslation } from "react-i18next";
import { FlightResult, FlightOption, FlightLeg } from "../model/flight";
import FlightLegLine from "./FlightLegLine";

type FlightCardProps = {
  flight: FlightResult;
  onSelect: (flight: FlightResult) => void;
};

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const { t } = useTranslation();

  const outboundLegs = flight.tripType === "roundTrip"
    ? flight.legs.slice(0, flight.outboundStops + 1)
    : flight.legs;

  const inboundLegs = flight.tripType === "roundTrip"
    ? flight.legs.slice(flight.outboundStops + 1)
    : [];

  const outboundDisplay = buildDisplayLeg(outboundLegs, flight.outboundStops);
  const inboundDisplay = inboundLegs.length > 0
    ? buildDisplayLeg(inboundLegs, flight.inboundStops ?? 0)
    : null;

  return (
    <div className="group relative rounded-[14px] border border-hairline bg-canvas overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 p-6 flex flex-col gap-4 justify-center">
        <FlightLegLine leg={outboundDisplay} />
        {inboundDisplay && <FlightLegLine leg={inboundDisplay} returnLeg />}
      </div>

      <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-hairline p-6 flex flex-col justify-center items-center bg-surface-soft">
        <div className="font-body-sm text-body-sm text-muted mb-1">
          {flight.offers} {t("results.offersFrom")}
        </div>
        <div className="font-display-xl text-display-xl text-ink mb-4">
          ${flight.price}
        </div>
        <button
          className="bg-rausch text-canvas font-title-md text-title-md py-3 px-6 rounded-lg w-full hover:bg-rausch-active transition-colors flex justify-center items-center gap-2"
          onClick={() => onSelect(flight)}
          type="button"
        >
          {t("results.select")}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function buildDisplayLeg(legs: FlightOption["legs"], stops: number): FlightLeg {
  return {
    ...legs[0],
    to: legs[legs.length - 1].to,
    arriveTime: legs[legs.length - 1].arriveTime,
    arriveMinutes: legs[legs.length - 1].arriveMinutes,
    nextDay: legs[legs.length - 1].nextDay,
    stops,
    duration: sumDuration(legs),
  };
}

function sumDuration(legs: FlightOption["legs"]): string {
  const totalMinutes = legs.reduce((sum, leg) => {
    const [h, m] = leg.duration.replace("h", "").replace("m", "").trim().split(" ").map(Number);
    return sum + h * 60 + m;
  }, 0);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}