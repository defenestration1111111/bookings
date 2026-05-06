import { FlightLeg } from "../model/flight";

type FlightLegLineProps = {
  leg: FlightLeg;
  returnLeg?: boolean;
};

export default function FlightLegLine({
  leg,
  returnLeg
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
              {leg.departTime}
            </div>
            <div className="font-body-sm text-body-sm text-muted mt-1">
              {leg.from}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4 relative">
            <div className="font-caption text-caption text-muted mb-1">
              {leg.duration}
            </div>

            <div className="w-full flex items-center relative">
              <div className="h-[2px] bg-border-strong w-full" />

              {leg.stops > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-rausch" />
              )}

              <span className="material-symbols-outlined text-border-strong absolute -right-2 text-[20px] bg-canvas px-1">
                flight
              </span>
            </div>

            <div className="font-caption text-caption text-ink mt-1">
              {leg.stops === 0
                ? "Direct"
                : `${leg.stops} ${leg.stops === 1 ? "stop" : "stops"}`}
            </div>
          </div>

          <div className="text-left flex-1">
            <div className="font-display-lg text-display-lg text-ink">
              {leg.arriveTime}
              {leg.nextDay && (
                <sup className="text-[12px]">{leg.nextDay}</sup>
              )}
            </div>

            <div className="font-body-sm text-body-sm text-muted mt-1">
              {leg.to}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}