import type { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DataTableChangeEvent } from '../data-table-contract';
import { useDataTable } from '../data-table-controller';
import { withSelectionCause } from '../data-table-selection-cause';

// The public `toggle({ type: 'select-row' | 'select-all' })` actions, which used to
// write the selection slice by hand and so disagreed with the checkbox.
//
// ── Why every fixture here is deliberately NOT the default configuration ──────
//
// A test in the default shape — multi-select, all rows eligible, flat data — passes
// on **both** the broken and the fixed implementation, because that is precisely the
// case where a bare `next.add(id)` and the engine's `mutateRowIsSelected` agree. So
// each divergence gets a configuration built to expose it, and the negative control
// on this file checks each one fails on its own when the hand-written version is
// restored. A fixture that survives that control is not testing anything.
//
//   - single-select needs a PRIOR SELECTION to be cleared — selecting one row into an
//     empty set looks identical either way;
//   - eligibility needs a row `isRowSelectable` REFUSES, and the assertion is that
//     the set stays as it was;
//   - cascade needs a parent WITH CHILDREN and sub-row selection on, and the
//     assertion is that descendants followed.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly reports?: readonly Person[];
}

const flat: Person[] = [
  { id: 'ada', name: 'Ada' },
  { id: 'grace', name: 'Grace' },
  { id: 'alan', name: 'Alan' },
];

/** A parent with two children, for the cascade case. */
const nested: Person[] = [
  {
    id: 'ada',
    name: 'Ada',
    reports: [
      { id: 'grace', name: 'Grace' },
      { id: 'alan', name: 'Alan' },
    ],
  },
  { id: 'radia', name: 'Radia' },
];

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
];

interface Options {
  readonly data?: readonly Person[];
  readonly mode?: 'single' | 'multiple';
  readonly isRowSelectable?: (row: Person) => boolean;
  readonly selection?: readonly string[];
  readonly tree?: boolean;
}

function renderController({
  data = flat,
  mode,
  isRowSelectable,
  selection = [],
  tree = false,
}: Options = {}) {
  const causes: string[] = [];
  const onStateChange = vi.fn((event: unknown) => {
    const typed = event as DataTableChangeEvent<'selection', unknown, string>;
    if (typed.slice === 'selection') {
      causes.push(typed.cause);
    }
  });

  const hook = renderHook(() =>
    useDataTable<Person>({
      columns,
      data: data as Person[],
      // Annotated because the `as never` below kills contextual typing for the whole
      // literal — `pnpm test` was green with this implicitly `any`, which is the trap
      // #64 recorded: run `pnpm typecheck` after touching any test.
      getRowId: (row: Person) => row.id,
      selection: {
        ...(mode === undefined ? {} : { mode }),
        ...(isRowSelectable === undefined ? {} : { isRowSelectable }),
      },
      ...(tree ? { getSubRows: (row: Person) => row.reports } : {}),
      defaultState: { selection: new Set(selection) },
      onStateChange,
    } as never)
  );

  return {
    controller: () => hook.result.current,
    selected: () => [...hook.result.current.getState().selection].sort(),
    causes,
  };
}

describe('toggle select-row — the three divergences from the checkbox', () => {
  it('REPLACES the selection in single-select mode', () => {
    // The bare version accumulated: `{ada, grace}`. The engine clears every key when
    // `!row.getCanMultiSelect()`, so single-select means one row.
    const { controller, selected } = renderController({
      mode: 'single',
      selection: ['ada'],
    });

    act(() => controller().toggle({ type: 'select-row', id: 'grace' }));

    expect(selected()).toEqual(['grace']);
  });

  it('REFUSES a row `isRowSelectable` rejects', () => {
    // The bare version added it regardless — a row the caller marked unselectable
    // ended up selected, and the checkbox for it is disabled, so the two paths
    // disagreed about a row the user cannot even click.
    const { controller, selected } = renderController({
      isRowSelectable: (row) => row.id !== 'alan',
      selection: ['ada'],
    });

    act(() => controller().toggle({ type: 'select-row', id: 'alan' }));

    expect(selected()).toEqual(['ada']);
  });

  it('CASCADES to sub-rows, which is a policy it used to drop by omission', () => {
    // The worst of the three: the arm re-implemented selection while omitting another
    // unit's policy, so a parent selected through the action left its descendants
    // behind while the same parent selected through its checkbox took them.
    const { controller, selected } = renderController({
      data: nested,
      tree: true,
    });

    act(() => controller().toggle({ type: 'select-row', id: 'ada' }));

    expect(selected()).toEqual(['ada', 'alan', 'grace']);
  });

  it('still deselects, and takes descendants with it', () => {
    // The `selected: false` direction of the same delegation — worth its own case
    // because `mutateRowIsSelected` handles it in a different branch.
    const { controller, selected } = renderController({
      data: nested,
      tree: true,
      selection: ['ada', 'grace', 'alan'],
    });

    act(() =>
      controller().toggle({ type: 'select-row', id: 'ada', selected: false })
    );

    expect(selected()).toEqual([]);
  });

  it('toggles when `selected` is omitted', () => {
    // The default-configuration case, kept BECAUSE it is undiscriminating: it is the
    // shape that must not regress while the three above change behaviour.
    const { controller, selected } = renderController();

    act(() => controller().toggle({ type: 'select-row', id: 'ada' }));
    expect(selected()).toEqual(['ada']);

    act(() => controller().toggle({ type: 'select-row', id: 'ada' }));
    expect(selected()).toEqual([]);
  });

  it('is a no-op for an id no row has', () => {
    // A deliberate non-delegation: the engine's own lookup throws for an unknown id,
    // and an exception inside a caller's event handler would be a new failure mode.
    // The old behaviour added the phantom, which the data-reconcile effect pruned on
    // the next data change anyway.
    const { controller, selected } = renderController({ selection: ['ada'] });

    act(() => controller().toggle({ type: 'select-row', id: 'nobody' }));

    expect(selected()).toEqual(['ada']);
  });
});

describe('toggle select-all — the same delegation', () => {
  it('skips ineligible rows instead of selecting them', () => {
    const { controller, selected } = renderController({
      isRowSelectable: (row) => row.id !== 'alan',
    });

    act(() => controller().toggle({ type: 'select-all' }));

    expect(selected()).toEqual(['ada', 'grace']);
  });

  it('keeps one row in single-select mode rather than selecting the page', () => {
    // `mutateRowIsSelected` clears on every row it visits when multi-select is off, so
    // the last visited row wins. The hand-written version selected the whole page,
    // which single-select mode forbids.
    const { controller, selected } = renderController({ mode: 'single' });

    act(() => controller().toggle({ type: 'select-all' }));

    expect(selected()).toHaveLength(1);
  });

  it('carries descendants when sub-rows are selectable', () => {
    const { controller, selected } = renderController({
      data: nested,
      tree: true,
    });

    act(() => controller().toggle({ type: 'select-all' }));

    expect(selected()).toEqual(['ada', 'alan', 'grace', 'radia']);
  });

  it('clears the page when every eligible row is already selected', () => {
    // The toggle default now comes from `getIsAllPageRowsSelected()`, which filters to
    // eligible rows BEFORE comparing — so a page whose only unselected row is
    // ineligible counts as fully selected and toggling clears it. The hand-written
    // version compared against every id including the ineligible one, concluded "not
    // all selected", and pointlessly re-added.
    const { controller, selected } = renderController({
      isRowSelectable: (row) => row.id !== 'alan',
      selection: ['ada', 'grace'],
    });

    act(() => controller().toggle({ type: 'select-all' }));

    expect(selected()).toEqual([]);
  });
});

describe('toggle selection — the cause is no longer hardcoded', () => {
  it('reports `api` for a bare action, which is the honest answer', () => {
    const { controller, causes } = renderController();

    act(() => controller().toggle({ type: 'select-row', id: 'ada' }));

    expect(causes).toEqual(['api']);
  });

  it('reports a claimed cause when the caller wrapped the action', () => {
    // This is the assertion that discriminates "delegates and reads the channel" from
    // "hardcodes `'api'`". Both report `api` for a bare call, so the bare case above
    // cannot tell them apart — only a wrapped call can, and it is reachable because
    // `withSelectionCause` is exported.
    const { controller, causes } = renderController();

    act(() =>
      withSelectionCause('pointer', () =>
        controller().toggle({ type: 'select-row', id: 'ada' })
      )
    );

    expect(causes).toEqual(['pointer']);
  });

  it('emits exactly one change event per action', () => {
    // Call COUNT, not just the final value: delegation routes through
    // `onRowSelectionChange`, and a version that both wrote the slice AND delegated
    // would land on the right selection while emitting twice.
    const { controller, causes } = renderController({
      data: nested,
      tree: true,
    });

    act(() => controller().toggle({ type: 'select-row', id: 'ada' }));

    expect(causes).toHaveLength(1);
  });
});
