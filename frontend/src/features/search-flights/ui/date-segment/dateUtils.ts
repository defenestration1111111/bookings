export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function parseIsoDate(value?: string): Date | null {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export function formatDisplayDate(value: string): string | null {
  const date = parseIsoDate(value);
  if (!date) return null;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getMonthMeta(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return {
    daysInMonth,
    startOffset: (firstDay + 6) % 7,
  };
}

export function toIsoDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function isBeforeMinDate(year: number, month: number, day: number, minDate: Date | null): boolean {
  if (!minDate) return false;
  return new Date(year, month, day) < minDate;
}
