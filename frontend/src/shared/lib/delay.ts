// Искусственная задержка — имитирует сеть пока нет бэкенда
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Класс для ошибок от API — чтобы отличать от других ошибок
export class ApiError extends Error {
  constructor(
    public status: number,   // HTTP статус: 404, 500...
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Превращает объект в строку запроса: { from: "SFO" } → "from=SFO"
export function toQueryString(params: Record<string, unknown>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
}