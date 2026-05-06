import { FlightLeg } from "../model/flight";

export function calcNights(fromDate: string, toDate: string): number {
  const a = new Date(fromDate);
  const b = new Date(toDate);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function formatFlightDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function calcTotalDuration(legs: FlightLeg[]): string {
  const first = legs[0];
  const last = legs[legs.length - 1];
  const start = new Date(`${first.departDate}T${to24h(first.departTime)}`);
  const endDate = last.nextDay ? shiftDate(last.departDate, 1) : last.departDate;
  const end = new Date(`${endDate}T${to24h(last.arriveTime)}`);
  const mins = Math.round((end.getTime() - start.getTime()) / 60_000);
  return formatDuration(mins);
}

export function calcLayover(
  arriveTime: string,
  arriveDate: string,
  nextDepartTime: string,
  nextDepartDate: string
): string {
  const a = new Date(`${arriveDate}T${to24h(arriveTime)}`);
  const b = new Date(`${nextDepartDate}T${to24h(nextDepartTime)}`);
  const mins = Math.round((b.getTime() - a.getTime()) / 60_000);
  return formatDuration(mins);
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function to24h(time: string): string {
  const [hm, period] = time.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
