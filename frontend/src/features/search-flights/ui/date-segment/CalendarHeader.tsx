import { MONTHS } from "./dateUtils";

type Props = {
  viewMonth: number;
  viewYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarHeader({ viewMonth, viewYear, onPrevMonth, onNextMonth }: Props) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
        onClick={onPrevMonth}
      >
        <span className="material-symbols-outlined text-[18px] text-ink">
          chevron_left
        </span>
      </button>

      <span className="font-body-sm text-body-sm text-ink font-medium">
        {MONTHS[viewMonth]} {viewYear}
      </span>

      <button
        type="button"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-soft transition-colors"
        onClick={onNextMonth}
      >
        <span className="material-symbols-outlined text-[18px] text-ink">
          chevron_right
        </span>
      </button>
    </div>
  );
}
