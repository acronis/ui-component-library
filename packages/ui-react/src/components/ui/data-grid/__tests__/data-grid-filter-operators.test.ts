import { describe, expect, it } from 'vitest';

import {
  evaluateFilterOperator,
  isMeaningfulFilter,
  isValuelessOperator,
} from '../data-grid-filter-operators';

describe('evaluateFilterOperator', () => {
  it('matches text operators case-insensitively', () => {
    expect(evaluateFilterOperator('Ada Lovelace', 'contains', 'love')).toBe(
      true
    );
    expect(evaluateFilterOperator('Ada Lovelace', 'contains', 'grace')).toBe(
      false
    );
    expect(evaluateFilterOperator('Engineer', 'equals', 'engineer')).toBe(true);
    expect(evaluateFilterOperator('Engineer', 'notEquals', 'engineer')).toBe(
      false
    );
    expect(evaluateFilterOperator('Engineer', 'startsWith', 'eng')).toBe(true);
  });

  it('treats `in` as a comma-separated membership test', () => {
    expect(evaluateFilterOperator('success', 'in', 'success, failed')).toBe(
      true
    );
    expect(evaluateFilterOperator('pending', 'in', 'success, failed')).toBe(
      false
    );
  });

  it('compares numbers for the ordering operators', () => {
    expect(evaluateFilterOperator(500, 'greaterThan', '400')).toBe(true);
    expect(evaluateFilterOperator(500, 'greaterThanOrEqual', '500')).toBe(true);
    expect(evaluateFilterOperator(500, 'lessThan', '400')).toBe(false);
    expect(evaluateFilterOperator(500, 'lessThanOrEqual', '500')).toBe(true);
    // Non-numeric cell or query never matches an ordering operator.
    expect(evaluateFilterOperator('n/a', 'greaterThan', '400')).toBe(false);
  });

  it('evaluates empty/non-empty independent of a value', () => {
    expect(evaluateFilterOperator('', 'isEmpty', '')).toBe(true);
    expect(evaluateFilterOperator(null, 'isEmpty', '')).toBe(true);
    expect(evaluateFilterOperator('x', 'isEmpty', '')).toBe(false);
    expect(evaluateFilterOperator('x', 'isNotEmpty', '')).toBe(true);
    expect(evaluateFilterOperator('  ', 'isNotEmpty', '')).toBe(false);
  });
});

describe('filter meaningfulness', () => {
  it('valueless operators are always meaningful', () => {
    expect(isValuelessOperator('isEmpty')).toBe(true);
    expect(isMeaningfulFilter({ operator: 'isEmpty' })).toBe(true);
    expect(isMeaningfulFilter({ operator: 'isNotEmpty', value: '' })).toBe(
      true
    );
  });

  it('value operators require a non-blank value', () => {
    expect(isMeaningfulFilter({ operator: 'contains', value: '' })).toBe(false);
    expect(isMeaningfulFilter({ operator: 'contains', value: '   ' })).toBe(
      false
    );
    expect(isMeaningfulFilter({ operator: 'contains', value: 'ada' })).toBe(
      true
    );
  });
});
