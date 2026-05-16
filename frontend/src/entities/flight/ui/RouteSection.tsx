import { useTranslation } from "react-i18next";
import {
  formatDuration,
  formatFlightDate,
  formatTime,
  layoverMinutes,
} from "../lib/flightTime";
import { Leg } from "../model/flight";
import { TimelineStop } from "./TimelineStop";

type Props = {
  legs: Leg[];
  label: string;
};

export function RouteSection({ legs, label }: Props) {
  const { t } = useTranslation();
  const first = legs[0];
  const last = legs[legs.length - 1];
  const totalMinutes = Math.round(
    (new Date(last.arrivalAt).getTime() - new Date(first.departureAt).getTime()) /
      60_000
  );

  return (
    <div className="px-4 pt-3 pb-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted mb-3">
        {label} · {formatDuration(totalMinutes)}
      </p>

      {legs.map((leg, i) => {
        const isLast = i === legs.length - 1;
        const nextLeg = legs[i + 1];
        const layover = !isLast && nextLeg
          ? formatDuration(layoverMinutes(leg.arrivalAt, nextLeg.departureAt))
          : null;

        const arriveTime =
          formatTime(leg.arrivalAt) + (leg.nextDayArrival ? " +1" : "");

        return (
          <div key={`${leg.flightNumber}-${leg.departureAt}`}>
            <TimelineStop
              time={formatTime(leg.departureAt)}
              date={formatFlightDate(leg.departureAt)}
              airport={leg.fromAirport.airportCode}
              hasLineBelow
            />

            <TimelineStop
              time={arriveTime}
              date={formatFlightDate(leg.arrivalAt)}
              airport={leg.toAirport.airportCode}
              hasLineBelow={!!layover}
            />

            {layover && (
              <div className="ml-7 mb-2 mt-0.5">
                <span className="inline-block text-[11px] text-muted bg-surface-soft rounded-md px-2 py-1">
                  {t("booking.routeSection.layover", {
                    duration: layover,
                    airport: leg.toAirport.airportCode,
                  })}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
