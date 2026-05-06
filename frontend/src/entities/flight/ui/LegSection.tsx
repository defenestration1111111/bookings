import { FlightLeg } from "../model/flight";

type Props = {
  leg: FlightLeg;
  isReturn?: boolean;
};

export function LegSection({ leg, isReturn = false }: Props) {
  return (
    <div className="px-4 py-3">
      {/* Section label */}
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted mb-3">
        {leg.from} → {leg.to} · {leg.duration}
      </p>

      {/* Timeline */}
      <div className="flex flex-col">
        <TimelineStop
          time={leg.departTime}
          airport={leg.from}
          isDot
          hasLineBelow
        />
        <TimelineStop
          time={leg.arriveTime}
          airport={leg.to}
          isDot
        />
      </div>
    </div>
  );
}

function TimelineStop({
  time,
  airport,
  isDot,
  hasLineBelow,
}: {
  time: string;
  airport: string;
  isDot?: boolean;
  hasLineBelow?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      {/* dot + line */}
      <div className="flex flex-col items-center w-5 shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full bg-rausch shrink-0" />
        {hasLineBelow && (
          <div className="w-px flex-1 min-h-[28px] bg-hairline mt-1" />
        )}
      </div>

      <div className="pb-4">
        <p className="font-title-sm text-title-sm text-ink leading-none">
          {time}
        </p>
        <p className="font-body-sm text-body-sm text-muted mt-0.5">
          {airport}
        </p>
      </div>
    </div>
  );
}