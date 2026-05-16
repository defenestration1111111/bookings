// Time helpers operate on the API's UTC instants (ISO-8601 strings with `Z`).
// Display strings show the UTC wall-clock; airport-local conversion will be
// added in a later phase when the API exposes airport timezone.

export function calcNights(fromDate: string, toDate: string): number {
  const a = new Date(fromDate);
  const b = new Date(toDate);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function formatTime(instant: string): string {
  const d = new Date(instant);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function formatFlightDate(instant: string): string {
  return new Date(instant).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function layoverMinutes(arrivalAt: string, nextDepartureAt: string): number {
  return Math.round(
    (new Date(nextDepartureAt).getTime() - new Date(arrivalAt).getTime()) / 60_000
  );
}
