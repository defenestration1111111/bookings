import { getMonthMeta, isBeforeMinDate, toIsoDate, WEEKDAYS } from "./dateUtils";

type Props = {
  viewYear: number;
  viewMonth: number;
  value: string;
  minDate: Date | null;
  onSelect: (value: string) => void;
};

export function CalendarGrid({ viewYear, viewMonth, value, minDate, onSelect }: Props) {
  const { daysInMonth, startOffset } = getMonthMeta(viewYear, viewMonth);

  return (
    <>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-caption text-caption text-muted py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toIsoDate(viewYear, viewMonth, day);
          const disabled = isBeforeMinDate(viewYear, viewMonth, day, minDate);
          const selected = iso === value;

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors
                ${selected ? "bg-[#ff385c] text-white font-medium" : ""}
                ${!selected && !disabled ? "hover:bg-surface-soft text-ink" : ""}
                ${disabled ? "text-muted opacity-40 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}
