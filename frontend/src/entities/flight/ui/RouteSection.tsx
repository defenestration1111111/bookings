import { useTranslation } from "react-i18next";
import {
  calcLayover,
  calcTotalDuration,
  formatFlightDate,
} from "../lib/flightTime";
import { FlightLeg } from "../model/flight";
import { TimelineStop } from "./TimelineStop";

type Props = {
  legs: FlightLeg[];
  label: string;
};

export function RouteSection({ legs, label }: Props) {
  const { t } = useTranslation();
  const totalDuration = calcTotalDuration(legs);

  return (
    <div className="px-4 pt-3 pb-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted mb-3">
        {label} · {totalDuration}
      </p>

      {legs.map((leg, i) => {
        const isLast = i === legs.length - 1;
        const nextLeg = legs[i + 1];
        const layover =
          !isLast && nextLeg
            ? calcLayover(
                leg.arriveTime,
                leg.departDate,
                nextLeg.departTime,
                nextLeg.departDate
              )
            : null;

        return (
          <div key={`${leg.from}-${leg.to}-${leg.departDate}-${leg.departTime}`}>
            <TimelineStop
              time={leg.departTime}
              date={formatFlightDate(leg.departDate)}
              airport={leg.from}
              hasLineBelow
            />

            <TimelineStop
              time={leg.arriveTime + (leg.nextDay ? ` ${leg.nextDay}` : "")}
              date={formatFlightDate(leg.departDate)}
              airport={leg.to}
              hasLineBelow={!!layover}
            />

            {layover && (
              <div className="ml-7 mb-2 mt-0.5">
                <span className="inline-block text-[11px] text-muted bg-surface-soft rounded-md px-2 py-1">
                  {t("booking.routeSection.layover", {
                    duration: layover,
                    airport: leg.to,
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
