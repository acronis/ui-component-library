import { describe, expect, it } from 'vitest';
import { AbortError, isNativeAbort } from '../src/abort';

describe('abort', () => {
  describe('abortError', () => {
    it('should be an instance of AbortError and Error', () => {
      const error = new AbortError();
      expect(error).toBeInstanceOf(AbortError);
      expect(error).toBeInstanceOf(Error);
    });

    it('is method should return true for an AbortError instance', () => {
      const error = new AbortError();
      expect(AbortError.is(error)).toBe(true);
    });

    it('is method should return false for a non-AbortError instance', () => {
      const error = new Error('test error');
      expect(AbortError.is(error)).toBe(false);
    });
  });

  describe('isNativeAbort', () => {
    it('should return true for a native AbortError', () => {
      const error = new Error('abort');
      error.name = 'AbortError';
      expect(isNativeAbort(error)).toBe(true);
    });

    it('should return false for a non-AbortError Error', () => {
      const error = new Error('generic error');
      expect(isNativeAbort(error)).toBe(false);
    });

    it('should return false for a non-Error object', () => {
      const obj = {};
      expect(isNativeAbort(obj)).toBe(false);
    });
  });
});
