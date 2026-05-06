import { useEffect, useRef, useState } from "react";

type TravellerSelectProps = {
  value: number;
  onChange: (value: number) => void;
  flex: string;
};

export function TravellerSelect({ value, onChange, flex }: TravellerSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`${flex} h-full relative`}>
      <div
        className="h-full cursor-pointer hover:bg-surface-soft transition-colors rounded-full flex flex-col justify-center px-6 min-h-[66px]"
        onClick={() => setOpen((o) => !o)}
      >
        <label className="font-caption text-caption text-ink font-bold">Who</label>
        <span className="font-body-sm text-body-sm text-muted">
          {value} {value === 1 ? "traveller" : "travellers"}
        </span>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-canvas rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] z-50 border border-hairline-soft p-4 w-[220px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-sm text-body-sm text-ink font-medium">
                Travellers
              </p>
              <p className="font-caption text-caption text-muted">Age 2+</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={value <= 1}
                onClick={() => onChange(value - 1)}
                className="w-8 h-8 rounded-full border border-hairline-soft flex items-center justify-center transition-colors hover:bg-surface-soft disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px] text-ink">
                  remove
                </span>
              </button>

              <span className="font-body-sm text-body-sm text-ink w-4 text-center">
                {value}
              </span>

              <button
                type="button"
                disabled={value >= 9}
                onClick={() => onChange(value + 1)}
                className="w-8 h-8 rounded-full border border-hairline-soft flex items-center justify-center transition-colors hover:bg-surface-soft disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px] text-ink">
                  add
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}