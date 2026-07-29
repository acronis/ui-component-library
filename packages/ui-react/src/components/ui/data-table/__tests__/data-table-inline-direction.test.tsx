import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// `DataTableRoot` + `DataTableView`, which is exactly what `data-table.tsx` renders
// — not the frozen `DataTable` wrapper, which builds its own controller internally
// and so gives no handle on the options this fix writes into.
import { DataTableRoot, DataTableView, useDataTable } from '..';
import {
  inlineDirectionSign,
  resolveInlineDirection,
} from '../data-table-inline-direction';

// #97's fix: the resize DRAG and the KEYBOARD path now resolve direction from one
// place, so they cannot disagree about which way the inline axis runs.
//
// ── WHAT THIS FILE CAN REACH, AND WHAT IT PROVABLY CANNOT ────────────────────
// **happy-dom implements no style resolution for `direction`.** Measured, not
// assumed: `getComputedStyle(el).direction` returns `'ltr'` for an element carrying
// `dir="rtl"`, for every descendant of one, and for `document.body` alike. So NO
// test in this environment can observe the right-to-left case, and the only way to
// fake it is to stub `getComputedStyle` — at which point the test asserts the stub
// and would pass against a completely broken resolver.
//
// So the module is deliberately split, and the split is what makes the logic
// testable at all: `resolveInlineDirection` holds the single browser read, and
// `inlineDirectionSign` maps a direction *value* to a multiplier. Everything below
// tests the second, plus the wiring's left-to-right case and its default.
//
// ⚠ **THE RIGHT-TO-LEFT BEHAVIOUR IS VERIFIED IN A BROWSER AND BY NOTHING HERE.**
// Measured with `/tmp/rtl-harness.mjs` in Chromium: dragging the handle in the
// widening direction moves the column +60.0px for 60px of travel in both writing
// directions, where before the fix right-to-left gave −60.0px. That is #78's gap,
// stated rather than left to be inferred from a green run.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'team', accessorKey: 'team', header: 'Team' },
];

const rows: Person[] = [{ id: 'p1', name: 'Ada', team: 'Engine' }];

describe('inlineDirectionSign', () => {
  it('maps a direction to the multiplier a stepping path needs', () => {
    // The whole of #97's arithmetic, and it is pure: no element, no computed style,
    // nothing stubbed.
    expect(inlineDirectionSign('ltr')).toBe(1);
    expect(inlineDirectionSign('rtl')).toBe(-1);
  });
});

describe('resolveInlineDirection', () => {
  it('answers ltr when there is no element to measure', () => {
    // Not a defensive branch: the controller holds `'ltr'` until the view reports,
    // and that default has to match both the browser's and `table-core`'s so a
    // table with no view behaves exactly as it did before this existed.
    expect(resolveInlineDirection(null)).toBe('ltr');
    expect(resolveInlineDirection(undefined)).toBe('ltr');
  });

  it('is a TRIPWIRE, not a test of right-to-left resolution', () => {
    // This asserts happy-dom's limitation, deliberately. If it ever starts failing,
    // happy-dom has gained `direction` support — and the right-to-left cases in this
    // file and the wiring below become reachable in CI for the first time. That is
    // worth being told about; today the honest record is that they are not.
    const { container } = render(
      <div dir="rtl">
        <span data-testid="inside">x</span>
      </div>
    );
    const outer = container.firstElementChild;
    const inside = screen.getByTestId('inside');

    expect(resolveInlineDirection(outer)).toBe('ltr');
    expect(resolveInlineDirection(inside)).toBe('ltr');
  });
});

describe('the engine option the view reports into', () => {
  const Harness = () => {
    const controller = useDataTable({
      columns,
      data: rows,
      columnsFeatures: { resizing: true },
    });
    return (
      <>
        <span data-testid="direction">
          {String(controller.table.options.columnResizeDirection)}
        </span>
        <DataTableRoot table={controller}>
          <DataTableView />
        </DataTableRoot>
      </>
    );
  };

  it('is SET, where it used to be absent — which is the whole mechanism', () => {
    render(<Harness />);
    // Before the fix this option was never passed, so `table-core` fell back to its
    // own build-time `'ltr'` default and multiplied every drag delta by +1 even
    // where the handle had moved to the opposite physical edge. The option being
    // present and owned by the kit is what closes that; the VALUE here is `'ltr'`
    // because happy-dom reports every element as left-to-right.
    expect(screen.getByTestId('direction')).toHaveTextContent('ltr');
    expect(screen.getByTestId('direction').textContent).not.toBe('undefined');
  });

  it('leaves a table with no view on the default rather than undefined', () => {
    const NoView = () => {
      const controller = useDataTable({ columns, data: rows });
      return (
        <span data-testid="bare">
          {String(controller.table.options.columnResizeDirection)}
        </span>
      );
    };
    render(<NoView />);
    // Nothing reports a direction here, so the controller's own default is what the
    // engine sees. `'ltr'` and not `undefined`: a controller used without the view
    // (a headless consumer, a test harness) must not hand the engine a hole.
    expect(screen.getByTestId('bare')).toHaveTextContent('ltr');
  });
});
