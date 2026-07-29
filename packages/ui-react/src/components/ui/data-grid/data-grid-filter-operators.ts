import type { FilterFn } from '@tanstack/react-table';

// Client-side operator evaluation for DataGrid column filters. The neutral
// contract carries an operator alongside each column filter value; DataGrid
// stores the pair as the TanStack filter value and applies it through this
// evaluator (design §5.2 FilterOperator). Shipped operators plus the proposed
// `isEmpty`/`isNotEmpty` (P0.4).

export type DataGridFilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'in'
  | 'isEmpty'
  | 'isNotEmpty';

/** Operators that need no value (their input is suppressed). */
export const VALUELESS_FILTER_OPERATORS: readonly DataGridFilterOperator[] = [
  'isEmpty',
  'isNotEmpty',
];

/** Short human labels used by the filter controls and applied-filter chips. */
export const FILTER_OPERATOR_LABELS: Record<DataGridFilterOperator, string> = {
  equals: 'equals',
  notEquals: 'does not equal',
  contains: 'contains',
  startsWith: 'starts with',
  greaterThan: 'greater than',
  greaterThanOrEqual: 'greater than or equal',
  lessThan: 'less than',
  lessThanOrEqual: 'less than or equal',
  in: 'is any of',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};

export interface DataGridFilterValue {
  readonly operator: DataGridFilterOperator;
  /** Ignored for the valueless operators. */
  readonly value?: string;
}

export function isValuelessOperator(operator: DataGridFilterOperator): boolean {
  return VALUELESS_FILTER_OPERATORS.includes(operator);
}

/**
 * Whether a filter is meaningful: valueless operators always apply; every other
 * operator needs a non-empty value. A meaningless filter is cleared rather than
 * stored, so it never shows as an inert applied-filter chip.
 */
export function isMeaningfulFilter(filter: DataGridFilterValue): boolean {
  return (
    isValuelessOperator(filter.operator) ||
    (filter.value !== undefined && filter.value.trim() !== '')
  );
}

function isEmptyCell(cellValue: unknown): boolean {
  return (
    cellValue === null ||
    cellValue === undefined ||
    (typeof cellValue === 'string' && cellValue.trim() === '')
  );
}

export function evaluateFilterOperator(
  cellValue: unknown,
  operator: DataGridFilterOperator,
  value: string
): boolean {
  switch (operator) {
    case 'isEmpty':
      return isEmptyCell(cellValue);
    case 'isNotEmpty':
      return !isEmptyCell(cellValue);
    default:
      break;
  }

  const text = cellValue == null ? '' : String(cellValue);
  const query = value.trim();

  switch (operator) {
    case 'equals':
      return text.toLowerCase() === query.toLowerCase();
    case 'notEquals':
      return text.toLowerCase() !== query.toLowerCase();
    case 'contains':
      return text.toLowerCase().includes(query.toLowerCase());
    case 'startsWith':
      return text.toLowerCase().startsWith(query.toLowerCase());
    case 'in':
      return query
        .split(',')
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry !== '')
        .includes(text.toLowerCase());
    case 'greaterThan':
    case 'greaterThanOrEqual':
    case 'lessThan':
    case 'lessThanOrEqual': {
      const left = Number(cellValue);
      const right = Number(query);
      if (Number.isNaN(left) || Number.isNaN(right)) {
        return false;
      }
      if (operator === 'greaterThan') return left > right;
      if (operator === 'greaterThanOrEqual') return left >= right;
      if (operator === 'lessThan') return left < right;
      return left <= right;
    }
    default:
      return true;
  }
}

/**
 * TanStack `FilterFn` that reads a `{ operator, value }` pair as its filter
 * value. Injected onto every DataGrid-filtered column.
 */
export const operatorFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: DataGridFilterValue | undefined
) => {
  if (filterValue === undefined) {
    return true;
  }

  return evaluateFilterOperator(
    row.getValue(columnId),
    filterValue.operator,
    filterValue.value ?? ''
  );
};
