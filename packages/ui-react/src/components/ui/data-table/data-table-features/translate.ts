import type {
  ColumnFiltersState,
  ExpandedState,
  RowSelectionState,
  Updater,
} from '@tanstack/react-table';

import type { DataTableFilterDescriptor } from '../data-table-contract';

// Pure translations between the library's framework-neutral state contract and
// TanStack's own shapes. Lifted out of `data-table-controller.ts` when the
// feature registry landed: a feature module that owns an `on*Change` handler
// needs the same translation the controller used to do inline, and duplicating
// these in each module is how the two drift.
//
// Everything here is pure and framework-free — no React, no engine instance.

/** A neutral `ReadonlySet` of IDs as TanStack's ID-keyed boolean record. */
export function setToRecord(
  values: ReadonlySet<string>
): Record<string, boolean> {
  return Object.fromEntries([...values].map((value) => [value, true]));
}

/**
 * TanStack's ID-keyed boolean record as a neutral set.
 *
 * `ExpandedState` has a second form — the literal `true`, meaning "everything is
 * expanded" — which has no set equivalent, so the caller supplies the ID list to
 * expand it against. That list is `table.getCoreRowModel().flatRows`, read from
 * inside the callback, which is the closure the lazy table accessor exists for.
 */
export function recordToSet<RowId extends string>(
  values: RowSelectionState | ExpandedState,
  allExpandedRowIds: readonly RowId[] = []
): ReadonlySet<RowId> {
  if (values === true) {
    return new Set(allExpandedRowIds);
  }

  return new Set(
    Object.entries(values)
      .filter(([, selected]) => selected)
      .map(([id]) => id as RowId)
  );
}

export function neutralFiltersToTanStack(
  filters: readonly DataTableFilterDescriptor[]
): ColumnFiltersState {
  return filters.map(({ id, value }) => ({ id, value }));
}

/**
 * Back-translation, preserving each filter's `operator`. TanStack has no operator
 * concept, so the operator has to be recovered from the previous neutral value
 * for the same column or it is silently dropped on every filter edit.
 */
export function tanStackFiltersToNeutral(
  filters: ColumnFiltersState,
  previous: readonly DataTableFilterDescriptor[]
): readonly DataTableFilterDescriptor[] {
  return filters.map(({ id, value }) => ({
    id,
    ...(previous.find((filter) => filter.id === id)?.operator === undefined
      ? {}
      : { operator: previous.find((filter) => filter.id === id)?.operator }),
    value: value as DataTableFilterDescriptor['value'],
  }));
}

export function resolveUpdater<Value>(
  updater: Updater<Value>,
  previous: Value
): Value {
  return typeof updater === 'function'
    ? (updater as (value: Value) => Value)(previous)
    : updater;
}
