import { formatDuration, formatTime } from "../lib/flightTime";
import { Leg } from "../model/flight";

type Summary = {
  departureAt: string;
  arrivalAt: string;
  fromCode: string;
  toCode: string;
  durationMinutes: number;
  stops: number;
  nextDayArrival: boolean;
};

type FlightLegLineProps = {
  summary: Summary;
  returnLeg?: boolean;
};

export default function FlightLegLine({
  summary,
  returnLeg,
}: FlightLegLineProps) {
  return (
    <div
      className={`flex items-center justify-between ${
        returnLeg ? "pt-6 border-t border-hairline-soft" : ""
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 flex items-center justify-between">
          <div className="text-right flex-1">
            <div className="font-display-lg text-display-lg text-ink">
              {formatTime(summary.departureAt)}
            </div>
            <div className="font-body-sm text-body-sm text-muted mt-1">
              {summary.fromCode}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4 relative">
            <div className="font-caption text-caption text-muted mb-1">
              {formatDuration(summary.durationMinutes)}
            </div>

            <div className="w-full flex items-center relative">
              <div className="h-[2px] bg-border-strong w-full" />

              {summary.stops > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rausch" />
              )}

              <span className="material-symbols-outlined text-border-strong absolute -right-2 text-[20px] bg-canvas px-1">
                flight
              </span>
            </div>

            <div className="font-caption text-caption text-ink mt-1">
              {summary.stops === 0
                ? "Direct"
                : `${summary.stops} ${summary.stops === 1 ? "stop" : "stops"}`}
            </div>
          </div>

          <div className="text-left flex-1">
            <div className="font-display-lg text-display-lg text-ink">
              {formatTime(summary.arrivalAt)}
              {summary.nextDayArrival && (
                <sup className="text-[12px]">+1</sup>
              )}
            </div>

            <div className="font-body-sm text-body-sm text-muted mt-1">
              {summary.toCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function legToSummary(legs: Leg[]): Summary {
  const first = legs[0];
  const last = legs[legs.length - 1];
  const totalMinutes = Math.round(
    (new Date(last.arrivalAt).getTime() - new Date(first.departureAt).getTime()) /
      60_000
  );
  return {
    departureAt: first.departureAt,
    arrivalAt: last.arrivalAt,
    fromCode: first.fromAirport.airportCode,
    toCode: last.toAirport.airportCode,
    durationMinutes: totalMinutes,
    stops: legs.length - 1,
    nextDayArrival: last.nextDayArrival,
  };
}
