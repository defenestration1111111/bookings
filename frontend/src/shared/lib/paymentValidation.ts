export function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

// ── Форматтеры ────────────────────────────────────────────────

export function formatCardNumber(value: string): string {
  const digits = normalizeDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const digits = normalizeDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function formatCvv(value: string): string {
  return normalizeDigits(value).slice(0, 4);
}

// ── Детект типа карты ─────────────────────────────────────────

export type CardNetwork = "visa" | "mastercard" | "amex" | "unknown";

export function detectCardNetwork(value: string): CardNetwork {
  const digits = normalizeDigits(value);
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

// ── Валидаторы (без изменений) ────────────────────────────────

export function isValidCardNumber(value: string) {
  const digits = normalizeDigits(value);
  if (digits.length < 13 || digits.length > 19) return false;
  if (/^0+$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function isValidExpiryDate(value: string) {
  const match = value.replace(/\s/g, "").match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  if (year < now.getFullYear()) return false;
  if (year === now.getFullYear() && month < now.getMonth() + 1) return false;
  return true;
}

export function isValidCvv(value: string) {
  return /^\d{3,4}$/.test(value);
}