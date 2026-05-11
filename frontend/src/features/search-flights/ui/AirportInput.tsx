import { useEffect, useRef, useState } from "react";
import { Airport } from "../../../entities/airport/model/airport";
import { useAirportSearch } from "../model/useAirportSearch";

type AirportInputProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  flexClass: string;
};

export function AirportInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  flexClass,
}: AirportInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [hasSearched, setHasSearched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { results, loading, search } = useAirportSearch(300);

  // Keep display in sync when parent resets value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click, revert query to committed value
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
        setHasSearched(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;

    setQuery(next);
    setOpen(true);
    setHasSearched(true);

    // Debounced API call on every keystroke
    search(next);
  }

  function handleSelect(airport: Airport) {
    const label = `${airport.city}, ${airport.airportCode}`;

    onChange(label);
    setQuery(label);
    setOpen(false);
    setHasSearched(false);
  }

  const showDropdown = open && (loading || results.length > 0 || hasSearched);

  return (
    <div ref={ref} className={`${flexClass} h-full relative`}>
      <div
        className="h-full cursor-pointer hover:bg-surface-soft transition-colors rounded-full flex flex-col justify-center px-8 min-h-[66px]"
        onClick={() => {
          setOpen(true);
          setHasSearched(true);
          search(query);
        }}
      >
        <label
          className="font-caption text-caption text-ink font-bold"
          htmlFor={id}
        >
          {label}
        </label>

        <input
          autoComplete="off"
          className="bg-transparent border-none p-0 m-0 focus:ring-0 font-body-sm text-body-sm text-muted w-full truncate placeholder-muted focus:outline-none"
          id={id}
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setOpen(true);
            setHasSearched(true);
            search(query);
          }}
        />
      </div>

      {showDropdown && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 z-50 bg-canvas rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-hairline-soft overflow-hidden">
          <div className="max-h-[280px] overflow-y-auto overscroll-contain">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-surface-soft flex-shrink-0 animate-pulse" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-3 w-3/4 rounded-full bg-surface-soft animate-pulse" />
                  <div className="h-2.5 w-1/3 rounded-full bg-surface-soft animate-pulse" />
                </div>
              </div>
            ))
          ) : results.length > 0 ? (
            results.map((airport) => (
              <button
                key={airport.airportCode}
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
                    {airport.airportCode}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-muted font-body-sm text-body-sm">
              No airports found
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}