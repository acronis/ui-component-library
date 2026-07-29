import { renderHook } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';

import {
  useDataTable,
  type DataTableSortingConfig,
} from '../data-table-controller';

// Characterization of the controller's *order-sensitive option groups* — the
// conditional spreads in the `useReactTable({…})` literal, asserted at the
// option level rather than through behavior.
//
// Why this file exists (ADR-0002, BL-5 hazard B). The sorting group is one
// `sortingEnabled` gate wrapping four separate options, and none of the four had
// any coverage: a refactor that moved the group into a feature module could drop
// `sorting.cycle` or `sorting.maxColumns` and pass every other suite. It is a
// separate file from `data-table-controller.test.tsx` deliberately — that suite
// is F2's read-only guard set, so these assertions could not live in it.
//
// These assertions discriminate a dropped key. Verified against the installed
// @tanstack/table-core@8.21.3: `RowSorting.getDefaultOptions` returns only
// `onSortingChange` and `isMultiSortEvent`, and all four options below are read
// as `table.options.<key> ?? fallback` at their use sites
// (`features/RowSorting.js:133`, `:158`, `:168`, `:182`). So the engine never
// supplies one, and an option the controller stops setting reads back
// `undefined` — never a coincidentally-correct default.

interface Person {
  readonly id: string;
  readonly name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = [
  { id: 'person-0', name: 'Ada' },
  { id: 'person-1', name: 'Grace' },
];

/** The four options the `sortingEnabled` gate carries, as TanStack sees them. */
function sortingOptions(sorting?: boolean | DataTableSortingConfig) {
  const { result } = renderHook(() =>
    useDataTable({
      columns,
      data: rows,
      ...(sorting === undefined ? {} : { sorting }),
    })
  );
  const { options } = result.current.table;

  return {
    enableMultiSort: options.enableMultiSort,
    enableSortingRemoval: options.enableSortingRemoval,
    sortDescFirst: options.sortDescFirst,
    maxMultiSortColCount: options.maxMultiSortColCount,
    hasSortedRowModel: options.getSortedRowModel !== undefined,
  };
}

describe('DataTable engine option groups — sorting', () => {
  it('leaves all four options unset for the boolean and omitted forms', () => {
    // `sorting: true` means "enable sorting with the engine defaults", which is
    // not the same as "set the options to their default values": the controller
    // sets none of the four, so TanStack's own fallbacks apply.
    expect(sortingOptions(true)).toEqual({
      enableMultiSort: undefined,
      enableSortingRemoval: undefined,
      sortDescFirst: undefined,
      maxMultiSortColCount: undefined,
      hasSortedRowModel: true,
    });
    expect(sortingOptions()).toEqual({
      enableMultiSort: undefined,
      enableSortingRemoval: undefined,
      sortDescFirst: undefined,
      maxMultiSortColCount: undefined,
      hasSortedRowModel: false,
    });
    expect(sortingOptions(false)).toEqual({
      enableMultiSort: undefined,
      enableSortingRemoval: undefined,
      sortDescFirst: undefined,
      maxMultiSortColCount: undefined,
      hasSortedRowModel: false,
    });
  });

  it('pins enableMultiSort from any object config, including an empty one', () => {
    // `enableMultiSort` is spread whenever the config is an object at all, so an
    // absent `mode` still pins it to `false`. An object config and `sorting:
    // true` are therefore NOT interchangeable, which is the distinction most
    // easily lost in a rewrite.
    expect(sortingOptions({}).enableMultiSort).toBe(false);
    expect(sortingOptions({ mode: 'single' }).enableMultiSort).toBe(false);
    expect(sortingOptions({ mode: 'multiple' }).enableMultiSort).toBe(true);
    // Multi-sort is the mode, not the cycle: a cycle-only config is single-sort.
    expect(sortingOptions({ cycle: ['asc', 'desc'] }).enableMultiSort).toBe(
      false
    );
  });

  it('derives enableSortingRemoval and sortDescFirst from the cycle together', () => {
    // One spread sets both, so they are pinned as a pair — a rewrite that
    // derives only one of them leaves the other `undefined`.
    expect(sortingOptions({ cycle: ['asc', 'desc', 'none'] })).toMatchObject({
      enableSortingRemoval: true,
      sortDescFirst: false,
    });
    expect(sortingOptions({ cycle: ['desc', 'asc', 'none'] })).toMatchObject({
      enableSortingRemoval: true,
      sortDescFirst: true,
    });
    expect(sortingOptions({ cycle: ['asc', 'desc'] })).toMatchObject({
      enableSortingRemoval: false,
      sortDescFirst: false,
    });
    expect(sortingOptions({ cycle: ['desc', 'asc'] })).toMatchObject({
      enableSortingRemoval: false,
      sortDescFirst: true,
    });
    // `none` anywhere in the cycle enables removal; only position 0 decides the
    // first direction.
    expect(sortingOptions({ cycle: ['none', 'asc', 'desc'] })).toMatchObject({
      enableSortingRemoval: true,
      sortDescFirst: false,
    });
  });

  it('treats an empty cycle as present, not absent', () => {
    // `[]` is truthy, so the pair is set to its falsy values rather than left
    // unset. A guard written as `cycle?.length` instead of `cycle` would produce
    // `undefined` for both and silently change what the engine falls back to
    // (`enableSortingRemoval` defaults to `true` inside TanStack).
    expect(sortingOptions({ cycle: [] })).toMatchObject({
      enableSortingRemoval: false,
      sortDescFirst: false,
    });
  });

  it('sets maxMultiSortColCount only when maxColumns is supplied', () => {
    expect(sortingOptions({ maxColumns: 2 }).maxMultiSortColCount).toBe(2);
    // Zero is a supplied value, not an absent one.
    expect(sortingOptions({ maxColumns: 0 }).maxMultiSortColCount).toBe(0);
    expect(sortingOptions({ mode: 'multiple' }).maxMultiSortColCount).toBe(
      undefined
    );
  });

  it('carries every member of a full config in one gate', () => {
    expect(
      sortingOptions({
        mode: 'multiple',
        cycle: ['desc', 'asc', 'none'],
        maxColumns: 3,
      })
    ).toEqual({
      enableMultiSort: true,
      enableSortingRemoval: true,
      sortDescFirst: true,
      maxMultiSortColCount: 3,
      hasSortedRowModel: true,
    });
  });

  it('keeps the option group and the row model on one gate under manual sorting', () => {
    // The gate is `sorting === true || config !== undefined || manualSorting`,
    // and it opens for the whole group — but the client sort model is suppressed
    // inside it. Manual mode tracks sort state and options while the caller
    // sorts server-side, so the two halves of the gate resolve differently.
    const { result } = renderHook(() =>
      useDataTable({
        columns,
        data: rows,
        manualSorting: true,
        sorting: { mode: 'multiple', cycle: ['desc', 'asc'], maxColumns: 4 },
      })
    );
    const { options } = result.current.table;

    expect(options.getSortedRowModel).toBeUndefined();
    expect(options.manualSorting).toBe(true);
    expect(options.enableMultiSort).toBe(true);
    expect(options.enableSortingRemoval).toBe(false);
    expect(options.sortDescFirst).toBe(true);
    expect(options.maxMultiSortColCount).toBe(4);
  });

  it('opens the gate for manual sorting alone without inventing config options', () => {
    const { result } = renderHook(() =>
      useDataTable({ columns, data: rows, manualSorting: true })
    );
    const { options } = result.current.table;

    expect(options.getSortedRowModel).toBeUndefined();
    expect(options.enableMultiSort).toBeUndefined();
    expect(options.enableSortingRemoval).toBeUndefined();
    expect(options.sortDescFirst).toBeUndefined();
    expect(options.maxMultiSortColCount).toBeUndefined();
  });
});
