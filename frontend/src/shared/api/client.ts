export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
    public readonly response?: Response
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class TimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`Request timed out after ${timeoutMs} ms`);
    this.name = "TimeoutError";
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function buildApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;

  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}

export interface FetchOptions extends RequestInit {
  /** Abort signal for request cancellation. Passed in from AbortController. */
  signal?: AbortSignal;
  /** Request timeout in ms. Defaults to 10 000. Pass 0 to disable. */
  timeoutMs?: number;
  /** How many times to retry on network error or 5xx. Defaults to 2. */
  retries?: number;
}

/**
 * Attempts to parse a JSON error body from a failed response.
 * Falls back to null if the body is not valid JSON.
 */
async function tryParseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) return null;

  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

/**
 * Extracts a human-readable message from a parsed error body.
 * Supports { message }, { error }, and { detail } conventions.
 */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (typeof b.message === "string") return b.message;
    if (typeof b.error === "string") return b.error;
    if (typeof b.detail === "string") return b.detail;
  }
  return fallback;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  callerSignal?: AbortSignal
): Promise<Response> {
  const signals: AbortSignal[] = [];
  if (callerSignal) signals.push(callerSignal);

  let timeoutSignal: AbortSignal | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (timeoutMs > 0) {
    const timeoutController = new AbortController();
    timeoutSignal = timeoutController.signal;
    signals.push(timeoutSignal);
    timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  }

  const combinedSignal =
    signals.length === 0
      ? undefined
      : signals.length === 1
        ? signals[0]
        : AbortSignal.any(signals);

  try {
    return await fetch(url, { ...init, signal: combinedSignal });
  } catch (err) {
    if (
      err instanceof DOMException &&
      err.name === "AbortError" &&
      timeoutSignal?.aborted &&
      !callerSignal?.aborted
    ) {
      throw new TimeoutError(timeoutMs);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchJson<T>(
  path: string,
  {
    timeoutMs = 10_000,
    retries = 2,
    signal,
    ...init
  }: FetchOptions = {}
): Promise<T> {
  const url = buildApiUrl(path);
  const requestInit: RequestInit = {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  };

  let attempt = 0;

  while (true) {
    attempt++;

    let response: Response;
    try {
      response = await fetchWithTimeout(url, requestInit, timeoutMs, signal);
    } catch (err) {
      const isAbort =
        err instanceof DOMException && err.name === "AbortError";

      // Don't retry aborted requests — the caller explicitly cancelled
      if (isAbort) throw err;

      // Don't retry timeouts — backing off won't make a slow server faster
      if (err instanceof TimeoutError) throw err;

      // Retry transient network errors (no response at all)
      if (attempt <= retries) {
        await delay(retryDelay(attempt));
        continue;
      }

      throw err;
    }

    if (!response.ok) {
      const isRetryable = response.status >= 500 && response.status < 600;

      if (isRetryable && attempt <= retries) {
        await delay(retryDelay(attempt));
        continue;
      }

      const body = await tryParseErrorBody(response);
      const message = extractErrorMessage(
        body,
        `Request failed: ${response.status}`
      );

      throw new ApiError(response.status, message, body, response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }
}

/** Exponential backoff: 300ms, 900ms, 2700ms… capped at 10s */
function retryDelay(attempt: number): number {
  return Math.min(300 * 3 ** (attempt - 1), 10_000);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}