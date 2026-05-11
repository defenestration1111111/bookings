import { useCallback, useEffect, useRef, useState } from "react";
import { Airport } from "../../../entities/airport/model/airport";
import { searchAirports } from "../../../entities/airport/api/airport.api";

export function useAirportSearch(debounceMs = 300) {
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

const search = useCallback(
  (query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setLoading(true);

    debounceTimer.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const airports = await searchAirports(query, 10, abortRef.current.signal);
        setResults(airports);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  },
  [debounceMs]
);

  useEffect(() => {
    return () => {
      debounceTimer.current && clearTimeout(debounceTimer.current);
      abortRef.current?.abort();
    };
  }, []);

  return { results, loading, search };
}