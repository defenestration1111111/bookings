import { fetchJson } from "../../../shared/api/client";
import { BookingDetails, ConfirmationData } from "../model/booking";

export async function createBooking(
  details: BookingDetails,
  signal?: AbortSignal
): Promise<ConfirmationData> {
  return fetchJson<ConfirmationData>("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
    signal,
  });
}