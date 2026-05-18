import { fetchJson } from "../../../shared/api/client";
import { BookingRequest, BookingResponse } from "../model/booking";

export async function createBooking(
  request: BookingRequest,
  signal?: AbortSignal
): Promise<BookingResponse> {
  return fetchJson<BookingResponse>("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
}