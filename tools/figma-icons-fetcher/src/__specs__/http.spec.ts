import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchWithRetry,
  isRetryableError,
  isTransientStatus,
  resolveTimeoutMs,
} from '../http';

// `fetchWithRetry` is the only retry implementation in the tool — both the REST
// client and the image CDN go through it — so its semantics are asserted here
// rather than inferred from either caller.
//
// undici's `fetch` is mocked: these tests are about *when* a request is repeated
// and when it is abandoned, which is decided before any socket is opened. The
// timeout itself is a dispatcher option and is asserted through
// `resolveTimeoutMs` instead, since observing a real headers timeout would mean
// waiting minutes for the condition it exists to survive.
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));

vi.mock('undici', () => ({
  Agent: class {
    constructor(public readonly options: unknown) {}
  },
  fetch: fetchMock,
}));

const ok = () => ({ ok: true, status: 200, statusText: 'OK' });
const status = (code: number, text = '') => ({
  ok: false,
  status: code,
  statusText: text,
});

// No real sleeping: the backoff is replaced, so a five-attempt path costs nothing.
const noDelay = { delayMs: () => 0 };

afterEach(() => {
  fetchMock.mockReset();
  delete process.env.FIGMA_FETCHER_TIMEOUT_MS;
});

describe('resolveTimeoutMs', () => {
  it('defaults to ten minutes, comfortably past the measured 122s cold request', () => {
    expect(resolveTimeoutMs(undefined)).toBe(600_000);
  });

  it('honours an explicit override', () => {
    expect(resolveTimeoutMs('1000')).toBe(1000);
  });

  it.each([
    ['0', 'zero would mean *no* timeout in undici — a hang with no error'],
    ['-1', 'negative is meaningless'],
    ['abc', 'non-numeric'],
    ['', 'empty'],
  ])('falls back to the default for %j (%s)', (raw) => {
    expect(resolveTimeoutMs(raw)).toBe(600_000);
  });
});

describe('isTransientStatus', () => {
  it('retries rate limiting and server errors', () => {
    expect(isTransientStatus(429)).toBe(true);
    expect(isTransientStatus(500)).toBe(true);
    expect(isTransientStatus(503)).toBe(true);
  });

  it('does not retry a definitive client error', () => {
    // 403 is the bad-token case: five attempts would report the same thing
    // slower, and make a configuration mistake look like a flaky network.
    expect(isTransientStatus(403)).toBe(false);
    expect(isTransientStatus(404)).toBe(false);
  });
});

describe('isRetryableError', () => {
  /** The shape undici produces: a generic surface error wrapping the real code. */
  const wrapped = (code: string) =>
    Object.assign(new Error('fetch failed'), {
      cause: Object.assign(new Error(code), { code }),
    });

  it('does not retry an unreachable host', () => {
    // Measured before this guard existed: no network meant 7.5 minutes of
    // backoff before reporting that DNS does not resolve api.figma.com.
    expect(isRetryableError(wrapped('ENOTFOUND'))).toBe(false);
  });

  it('does retry a temporary resolver failure', () => {
    // EAI_AGAIN is the transient sibling of ENOTFOUND and does come good.
    expect(isRetryableError(wrapped('EAI_AGAIN'))).toBe(true);
  });

  it('retries a dropped connection', () => {
    expect(isRetryableError(wrapped('ECONNRESET'))).toBe(true);
  });

  it('retries an error carrying no code at all — e.g. the headers timeout', () => {
    expect(
      isRetryableError(
        Object.assign(new Error('fetch failed'), {
          cause: new Error('Headers Timeout Error'),
        })
      )
    ).toBe(true);
  });

  it('finds the code however deep the cause chain is', () => {
    const deep = Object.assign(new Error('outer'), {
      cause: Object.assign(new Error('middle'), {
        cause: Object.assign(new Error('inner'), { code: 'ENOTFOUND' }),
      }),
    });
    expect(isRetryableError(deep)).toBe(false);
  });
});

describe('fetchWithRetry', () => {
  it('returns the first successful response without retrying', async () => {
    fetchMock.mockResolvedValueOnce(ok());
    const response = await fetchWithRetry('https://example.test/a', noDelay);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a network-level failure and succeeds — the headers-timeout case', async () => {
    // This is the shape of the bug that prompted the timeout: attempt 1 dies on
    // a cold request, a later attempt lands once Figma has the response warm.
    fetchMock
      .mockRejectedValueOnce(
        Object.assign(new Error('fetch failed'), {
          cause: new Error('Headers Timeout Error'),
        })
      )
      .mockResolvedValueOnce(ok());

    const response = await fetchWithRetry('https://example.test/b', noDelay);
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries 429 and 5xx', async () => {
    fetchMock
      .mockResolvedValueOnce(status(429, 'Too Many Requests'))
      .mockResolvedValueOnce(status(502, 'Bad Gateway'))
      .mockResolvedValueOnce(ok());

    await expect(
      fetchWithRetry('https://example.test/c', noDelay)
    ).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('fails fast on a definitive 4xx, without a second attempt', async () => {
    fetchMock.mockResolvedValue(status(403, 'Forbidden'));

    await expect(
      fetchWithRetry('https://example.test/d', noDelay)
    ).rejects.toThrow('HTTP 403: Forbidden');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('gives up after five attempts and reports the last failure', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNRESET'));

    await expect(
      fetchWithRetry('https://example.test/e', noDelay)
    ).rejects.toThrow('ECONNRESET');
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('backs off exponentially between attempts', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNRESET'));
    const delays: number[] = [];

    await expect(
      fetchWithRetry('https://example.test/f', {
        delayMs: (attempt) => {
          delays.push(attempt);
          return 0;
        },
      })
    ).rejects.toThrow();

    // Four waits for five attempts — none after the last.
    expect(delays).toEqual([1, 2, 3, 4]);
  });

  it('fails fast on an unreachable host instead of backing off five times', async () => {
    fetchMock.mockRejectedValue(
      Object.assign(new Error('fetch failed'), {
        cause: Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' }),
      })
    );

    await expect(
      fetchWithRetry('https://example.test/offline', noDelay)
    ).rejects.toThrow('fetch failed');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('passes the caller-supplied init through', async () => {
    fetchMock.mockResolvedValueOnce(ok());
    await fetchWithRetry('https://example.test/g', {
      init: { method: 'POST', headers: { 'X-Figma-Token': 'tok' } },
      delayMs: () => 0,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/g',
      expect.objectContaining({
        method: 'POST',
        headers: { 'X-Figma-Token': 'tok' },
        dispatcher: expect.anything(),
      })
    );
  });
});
