import { useState, useRef, useEffect } from "react";
import { BookingRequest, BookingResponse } from "./booking";
import { createBooking } from "../api/booking.api";
import { ApiError } from "../../../shared/api/client";

type UseBookingResult = {
  confirmation: BookingResponse | null;
  loading: boolean;
  /** ApiError when the server responded with an error body; plain Error for network failures */
  error: ApiError | Error | null;
  book: (request: BookingRequest) => Promise<BookingResponse | null>;
};

export function useBooking(): UseBookingResult {
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);

  // Cancel in-flight request if the component unmounts mid-submission
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function book(request: BookingRequest): Promise<BookingResponse | null> {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await createBooking(request, controller.signal);
      setConfirmation(result);
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Unmounted mid-flight — don't update state
        return null;
      }

      const typedErr = err instanceof Error ? err : new Error(String(err));
      setError(typedErr);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { confirmation, loading, error, book };
}