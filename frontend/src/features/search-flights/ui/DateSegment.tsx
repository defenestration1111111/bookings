import { useEffect, useRef, useState } from "react";
import { CalendarGrid } from "./date-segment/CalendarGrid";
import { CalendarHeader } from "./date-segment/CalendarHeader";
import { DateTrigger } from "./date-segment/DateTrigger";
import { formatDisplayDate, parseIsoDate } from "./date-segment/dateUtils";

type DateSegmentProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
};

export function DateSegment({
  id,
  label,
  value,
  onChange,
  min,
}: DateSegmentProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const minDate = parseIsoDate(min);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = formatDisplayDate(value);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function selectDate(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  return (
    <div ref={ref} className="flex-[0.8] h-full relative">
      <DateTrigger
        id={id}
        label={label}
        displayValue={displayValue}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-canvas rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] z-50 border border-hairline-soft p-4 w-[280px]">
          <CalendarHeader
            viewMonth={viewMonth}
            viewYear={viewYear}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
          <CalendarGrid
            viewMonth={viewMonth}
            viewYear={viewYear}
            value={value}
            minDate={minDate}
            onSelect={selectDate}
          />
        </div>
      )}
    </div>
  );
}
