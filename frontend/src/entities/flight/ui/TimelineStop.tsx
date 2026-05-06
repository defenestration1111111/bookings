type Props = {
  time: string;
  date: string;
  airport: string;
  hasLineBelow?: boolean;
};

export function TimelineStop({ time, date, airport, hasLineBelow }: Props) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex flex-col items-center w-5 shrink-0 pt-[5px]">
        <div className="w-2 h-2 rounded-full bg-rausch shrink-0" />
        {hasLineBelow && (
          <div className="w-px flex-1 min-h-[24px] bg-hairline mt-1" />
        )}
      </div>
      <div className="pb-3">
        <p className="font-title-sm text-title-sm text-ink leading-none">
          {time}
          <span className="font-body-sm text-body-sm text-muted ml-1.5">{date}</span>
        </p>
        <p className="font-body-sm text-body-sm text-muted mt-0.5">{airport}</p>
      </div>
    </div>
  );
}
