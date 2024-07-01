/**
 * Throw class for all abort errors
 */
export class AbortError extends Error {
  static is(e: unknown): e is AbortError {
    return e instanceof AbortError;
  }
}

export function isNativeAbort(error: unknown): error is Error {
  return error instanceof Error && error.name === 'AbortError';
}
