import type { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { DataTableChangeEvent } from '../data-table-contract';
import { useDataTable } from '../data-table-controller';
import { withSelectionCause } from '../data-table-selection-cause';

// The provenance of a selection change, across the engine round-trip.
//
// These drive the **engine API** rather than a checkbox, deliberately: that is the
// round-trip under test. A control-level test proves the wiring of one control; the
// question here is whether the cause survives `toggleSelected` at all, and whether
// it stops surviving the moment nobody claims it.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

const rows: Person[] = [
  { id: 'ada', name: 'Ada', role: 'Engineer' },
  { id: 'grace', name: 'Grace', role: 'Engineer' },
  { id: 'alan', name: 'Alan', role: 'Operator' },
];

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
];

function renderController(options?: {
  mode?: 'single' | 'multiple';
  isRowSelectable?: (row: Person) => boolean;
}) {
  const events: DataTableChangeEvent<'selection', Set<string>, string>[] = [];
  const onStateChange = vi.fn((event: unknown) => {
    const typed = event as DataTableChangeEvent<
      'selection',
      Set<string>,
      string
    >;
    if (typed.slice === 'selection') events.push(typed);
  });

  const view = renderHook(() =>
    useDataTable<Person>({
      columns,
      data: rows,
      getRowId: (row) => row.id,
      selection: {
        mode: options?.mode ?? 'multiple',
        ...(options?.isRowSelectable
          ? { isRowSelectable: options.isRowSelectable }
          : {}),
      },
      onStateChange,
    })
  );

  return {
    view,
    events,
    lastCause: () => events[events.length - 1]?.cause,
  };
}

describe('selection cause', () => {
  it('reports the default when nothing claims the change', () => {
    const { view, lastCause } = renderController();

    act(() => {
      view.result.current.table.getRow('ada').toggleSelected(true);
    });

    // A genuinely programmatic change. `'api'` is the honest answer here, and it
    // is what every checkbox used to report.
    expect(lastCause()).toBe('api');
    expect(view.result.current.getState().selection).toEqual(new Set(['ada']));
  });

  it('carries a claimed cause across the engine round-trip', () => {
    const { view, lastCause } = renderController();

    act(() => {
      withSelectionCause('pointer', () => {
        view.result.current.table.getRow('ada').toggleSelected(true);
      });
    });

    expect(lastCause()).toBe('pointer');
  });

  // **The assertion that proves the restore rather than restating the synchrony
  // claim.** The mechanism rests on `setRowSelection` calling
  // `onRowSelectionChange` inside the same call stack, so the value cannot leak
  // past the wrapper. If a future path ever made that asynchronous, the cause
  // would silently persist and every later change would inherit `'pointer'` —
  // this is what turns that from invisible into red.
  it('is not observable after the wrapped call returns', () => {
    const { view, lastCause } = renderController();

    act(() => {
      withSelectionCause('pointer', () => {
        view.result.current.table.getRow('ada').toggleSelected(true);
      });
    });
    expect(lastCause()).toBe('pointer');

    act(() => {
      view.result.current.table.getRow('grace').toggleSelected(true);
    });
    expect(lastCause()).toBe('api');
  });

  it('restores the outer claim when wrapped calls nest', () => {
    const { view, events } = renderController();

    act(() => {
      withSelectionCause('pointer', () => {
        withSelectionCause('keyboard', () => {
          view.result.current.table.getRow('ada').toggleSelected(true);
        });
        // Restoring the previous value rather than clearing to a constant is what
        // makes this second change `'pointer'` and not the default.
        view.result.current.table.getRow('grace').toggleSelected(true);
      });
    });

    expect(events.map((event) => event.cause)).toEqual(['keyboard', 'pointer']);
  });

  // The three behaviours a hand-written updater would have dropped. Each is
  // asserted **through** the wrapper, so the test says both things at once: the
  // cause is honest *and* the engine still decides what changes.
  it('keeps single-mode replacement while reporting pointer', () => {
    const { view, lastCause } = renderController({ mode: 'single' });

    act(() => {
      withSelectionCause('pointer', () => {
        view.result.current.table.getRow('ada').toggleSelected(true);
      });
    });
    act(() => {
      withSelectionCause('pointer', () => {
        view.result.current.table.getRow('grace').toggleSelected(true);
      });
    });

    // Replaced, not accumulated. A hand-written `next.add(id)` would hold both.
    expect(view.result.current.getState().selection).toEqual(
      new Set(['grace'])
    );
    expect(lastCause()).toBe('pointer');
  });

  it('keeps eligibility while reporting pointer', () => {
    const { view } = renderController({
      isRowSelectable: (row) => row.role === 'Engineer',
    });

    act(() => {
      withSelectionCause('pointer', () => {
        view.result.current.table.getRow('alan').toggleSelected(true);
      });
    });

    // `alan` is an Operator, so the engine refuses him. A hand-written updater
    // that trusted the control would have selected him.
    expect(view.result.current.getState().selection).toEqual(new Set());
  });
});
