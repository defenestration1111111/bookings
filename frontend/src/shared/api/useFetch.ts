import { useState, useEffect, useRef, useCallback } from "react";
import { ApiError } from "../api/client";

type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError | Error };

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
  /** Manually re-trigger the fetch */
  refetch: () => void;
};

/**
 * Fetches data using the provided async function whenever `deps` change.
 * Automatically cancels in-flight requests when deps change or the
 * component unmounts.
 *
 * @param fetcher  - A function that receives an AbortSignal and returns a Promise<T>.
 *                   The signal should be forwarded to fetchJson (or fetch).
 * @param deps     - Dependency array, same semantics as useEffect.
 * @param enabled  - When false, the fetch is skipped entirely. Defaults to true.
 *
 * @example
 * const { data, loading, error } = useFetch(
 *   (signal) => getSeatMap(flightId, signal),
 *   [flightId]
 * );
 */
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList,
  { enabled = true }: { enabled?: boolean } = {}
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "idle" });

  // Stable ref so refetch() always calls the latest fetcher
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Increment to trigger a manual refetch
  const [refetchCounter, setRefetchCounter] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    setState({ status: "loading" });

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        // Ignore cancellations — component is gone or deps changed
        if (err instanceof DOMException && err.name === "AbortError") return;

        setState({
          status: "error",
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, refetchCounter]);

  const refetch = useCallback(() => setRefetchCounter((n) => n + 1), []);

  return {
    data: state.status === "success" ? state.data : null,
    loading: state.status === "loading",
    error:
      state.status === "error"
        ? state.error
        : null,
    refetch,
  };
}