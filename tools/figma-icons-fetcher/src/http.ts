import process from 'node:process';

import { Agent, fetch as undiciFetch } from 'undici';
import type { RequestInit, Response } from 'undici';

/**
 * One HTTP layer for every request this tool makes — the Figma REST API and the
 * image CDN both go through it.
 *
 * ── WHY A TIMEOUT HAS TO BE SET EXPLICITLY ───────────────────────────────────
 * A cold `GET /v1/files/:key/nodes` for the icon library is a **7.2 MB** node
 * tree that Figma buffers server-side before sending any response header. Cold,
 * that took long enough to trip Node's default `headersTimeout`, and the run
 * died with `fetch failed / Cause: Headers Timeout Error` — an error that reads
 * like a broken token or a dead network and is neither. Measured on the same
 * file, minutes apart: the first attempt exceeded the default, a retry landed at
 * **122 s**, and once Figma had it cached the same call took **0.6 s**.
 *
 * The default cannot be raised through `globalThis.fetch`, so requests go
 * through an explicit `undici` Agent. `headersTimeout` is the one that matters
 * here — the wait is for the *first byte*, not the body — but `bodyTimeout` gets
 * the same budget, since a 7 MB body over a slow link is the same kind of wait.
 */
const DEFAULT_TIMEOUT_MS = 600_000;

/** Mirrors `download-image.ts`'s original backoff, which this replaces. */
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 500;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * `FIGMA_FETCHER_TIMEOUT_MS` overrides the budget — raise it on a slow link,
 * lower it in a test. A non-numeric or non-positive value falls back to the
 * default rather than disabling the timeout, because `0` in undici means "no
 * timeout" and a hang with no error is worse than a slow failure.
 */
export function resolveTimeoutMs(
  raw: string | undefined = process.env.FIGMA_FETCHER_TIMEOUT_MS
): number {
  const parsed = raw === undefined || raw.trim() === '' ? NaN : Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

let dispatcher: Agent | undefined;

/** Lazily built, then reused: one connection pool for the whole run. */
function figmaDispatcher(): Agent {
  const timeout = resolveTimeoutMs();
  dispatcher ??= new Agent({
    headersTimeout: timeout,
    bodyTimeout: timeout,
  });
  return dispatcher;
}

/**
 * A response worth retrying. Figma rate-limits large batch downloads (429) and
 * its CDN intermittently 5xxs; both succeed on a later attempt. A definitive 4xx
 * — a bad token, a wrong file key — will never succeed, so it fails fast rather
 * than spending five attempts and ~7 s to report the same thing.
 */
export const isTransientStatus = (status: number): boolean =>
  status === 429 || status >= 500;

/**
 * Error codes that will not change within a retry window, so retrying only
 * delays the report.
 *
 * `ENOTFOUND` is the one that matters: with no network at all, five attempts plus
 * backoff spent **7.5 minutes** before saying "DNS does not resolve
 * api.figma.com" — measured, not hypothetical. `EAI_AGAIN` is deliberately *not*
 * here: that is a temporary resolver failure and does come good.
 */
const FATAL_ERROR_CODES = new Set([
  'ENOTFOUND',
  'ERR_INVALID_URL',
  'CERT_HAS_EXPIRED',
  'ERR_TLS_CERT_ALTNAME_INVALID',
]);

/** Walks the `cause` chain, since undici reports `fetch failed` at the surface. */
export function isRetryableError(error: unknown): boolean {
  for (let current = error; current instanceof Error; current = current.cause) {
    const code = (current as { code?: unknown }).code;
    if (typeof code === 'string' && FATAL_ERROR_CODES.has(code)) {
      return false;
    }
  }
  return true;
}

export interface FetchWithRetryOptions {
  readonly init?: RequestInit;
  /** Test seam: overrides the real backoff so specs don't sleep. */
  readonly delayMs?: (attempt: number) => number;
}

/**
 * Fetches with retry + exponential backoff, through the timeout-configured
 * dispatcher. Network-level failures (`ECONNRESET`, and the headers timeout this
 * exists for) are retried; so are 429 and 5xx. Everything else throws on the
 * first attempt.
 */
export async function fetchWithRetry(
  url: string,
  { init, delayMs }: FetchWithRetryOptions = {}
): Promise<Response> {
  const backoff = delayMs ?? ((attempt) => BASE_DELAY_MS * 2 ** (attempt - 1));
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let definitive = false;
    try {
      const response = await undiciFetch(url, {
        ...init,
        dispatcher: figmaDispatcher(),
      });
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      if (!isTransientStatus(response.status)) {
        definitive = true;
        throw lastError;
      }
    } catch (error) {
      // A definitive HTTP status must not be swallowed back into the retry loop
      // — rethrow it rather than letting the next attempt paper over it.
      if (definitive) throw error;
      // Nor a failure that cannot come good: an unreachable host is reported
      // now, not in seven minutes.
      if (!isRetryableError(error)) throw error;
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      await delay(backoff(attempt));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
