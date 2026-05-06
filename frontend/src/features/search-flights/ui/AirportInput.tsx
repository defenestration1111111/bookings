import { useEffect, useRef, useState } from "react";
import { Airport } from "../../../entities/airport/model/airport";

type AirportInputProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  flexClass: string;
  airports: Airport[];
};

export function AirportInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  flexClass,
  airports,
}: AirportInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = airports.filter((a) => {
    const label = `${a.city}, ${a.airport_code}`.toLowerCase();
    return label.includes(query.toLowerCase());
  });

  function handleSelect(airport: Airport) {
    const nextValue = `${airport.city}, ${airport.airport_code}`;
    onChange(nextValue);
    setQuery(nextValue);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`${flexClass} h-full relative`}>
      <div
        className="h-full cursor-pointer hover:bg-surface-soft transition-colors rounded-full flex flex-col justify-center px-8 min-h-[66px]"
        onClick={() => setOpen(true)}
      >
        <label className="font-caption text-caption text-ink font-bold" htmlFor={id}>
          {label}
        </label>

        <input
          autoComplete="off"
          list="airport-options"
          className="bg-transparent border-none p-0 m-0 focus:ring-0 font-body-sm text-body-sm text-muted w-full truncate placeholder-muted focus:outline-none"
          id={id}
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-canvas rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] overflow-hidden z-50 border border-hairline-soft">
          {filtered.map((airport) => (
            <button
              key={airport.airport_code}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-soft transition-colors text-left"
              type="button"
              onMouseDown={() => handleSelect(airport)}
            >
              <span className="w-9 h-9 rounded-full bg-surface-soft flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-ink text-[18px]">
                  flight_takeoff
                </span>
              </span>

              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-ink font-medium truncate">
                  {airport.city}
                </span>
                <span className="font-caption text-caption text-muted">
                  {airport.airport_code}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
