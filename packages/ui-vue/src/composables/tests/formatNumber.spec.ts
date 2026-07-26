import { getTruncatedString } from '@/composables/formatNumber.ts';
import { describe, expect } from 'vitest';

describe('formatNumber', () => {
  describe('getTruncatedString', () => {
    it('should generate valid string from number', () => {
      expect(getTruncatedString(1000000)).toBe('1m');
      expect(getTruncatedString(1383220.221999969)).toBe('1.38m');
      expect(getTruncatedString(199300000)).toBe('199.3m');
      expect(getTruncatedString(998182.3919)).toBe('998.18k');
      expect(getTruncatedString(80000)).toBe('80k');
      expect(getTruncatedString(1200)).toBe('1.2k');
      expect(getTruncatedString(999.888)).toBe('1k');
      expect(getTruncatedString(492.679)).toBe('492.68');
      expect(getTruncatedString(9999999999)).toBe('10000m');
    });
  });
});
