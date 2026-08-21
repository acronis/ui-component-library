import type { RequestInit } from 'undici';

import { fetchWithRetry } from './http';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

/**
 * Every call goes through `fetchWithRetry`, which supplies the raised
 * `headersTimeout` these endpoints need: a cold node-tree request is megabytes
 * that Figma buffers before sending a single header, and the default budget is
 * not enough for it. See `http.ts`.
 *
 * `fetchWithRetry` also rejects on a non-OK status. That is a behaviour change
 * worth stating: this used to `json()` the body whatever the status, so a 403
 * from a bad token became a `{ data: { err: … } }` that downstream code read as
 * a malformed *file*, reporting a missing node instead of a rejected request.
 */
async function fetchWrapper<T>(
  url: string,
  token: string,
  options: RequestInit
): Promise<{ data: T }> {
  const headers = {
    'Content-Type': 'application/json',
    'X-Figma-Token': token,
  };
  const response = await fetchWithRetry(`${FIGMA_API_BASE}${url}`, {
    init: { ...options, headers },
  });
  const data = (await response.json()) as T;
  return { data };
}

export function figmaClientRequest(token: string) {
  return {
    get: <T>(url: string) => fetchWrapper<T>(url, token, { method: 'GET' }),
    post: <T>(url: string, body: unknown) =>
      fetchWrapper<T>(url, token, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    put: <T>(url: string, body: unknown) =>
      fetchWrapper<T>(url, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: <T>(url: string) =>
      fetchWrapper<T>(url, token, { method: 'DELETE' }),
  };
}
