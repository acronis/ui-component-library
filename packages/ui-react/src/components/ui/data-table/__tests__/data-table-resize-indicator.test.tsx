import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ColumnDef } from '@tanstack/react-table';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../data-table-controller';
import type { DataTableColumnControls } from '../data-table-features/columns';
import type { DataTableHeaderContext } from '../data-table-render-context';
import {
  resizeIndicatorOffset,
  spansTableTrailingEdge,
} from '../data-table-resize-indicator';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// F19 — the column-resize drag indicator.
//
// ── WHAT THIS FILE CAN AND CANNOT PROVE ──────────────────────────────────────
// **It proves the arithmetic and the wiring. It proves nothing about the line.**
// The suite runs in happy-dom, which has no layout engine: every
// `getBoundingClientRect()` reads zero, so the *anchor* term is 0 by construction
// in every rendered case below, and no assertion here can tell where a 1px
// pseudo-element actually paints, whether the z-55 rung clears the sticky header,
// or whether the rounded corners clip it. Those are owed against a browser and are
// not claimed here — an `expect` on a class string is not a render check, and this
// file does not pretend otherwise.
//
// What *is* real: the offset the DOM would receive, exercised through the genuine
// `getResizeHandler` drag path rather than by poking state. Column sizes are real
// numbers from the column defs, so the delta arithmetic, both clamps and the
// at-rest/teardown behaviour are all discriminating.
//
// ── WHY THE HANDLE IS RENDERED BY THE TEST ───────────────────────────────────
// `DataTable` renders no resize handle — that is DataGrid's job (see
// `data-grid-column-header-controls.tsx`). Wiring a bare `<span>` to the engine's
// own `resizeHandleProps` is therefore the *composer* path, and proving the
// indicator there proves it for any composer, not only for the one component that
// ships chrome. It also keeps this file's failure modes to F19's own: a DataGrid
// harness would fail here for a header-chrome regression too.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const rows: Person[] = [
  { id: 'p1', name: 'Ada', team: 'Engine' },
  { id: 'p2', name: 'Grace', team: 'Compiler' },
];

/** `name` starts at 200 with no bounds of its own — the plain case. */
const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 200 },
  { id: 'team', accessorKey: 'team', header: 'Team', size: 100 },
];

/** `name` capped at 120–320, so both clamps are reachable from 200. */
const boundedColumns: ColumnDef<Person, unknown>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    minSize: 120,
    maxSize: 320,
  },
  { id: 'team', accessorKey: 'team', header: 'Team', size: 100 },
];

type WithControls = DataTableHeaderContext & {
  readonly columns: DataTableColumnControls;
};

const OFFSET_PROPERTY = '--table-resize-indicator-x';

/** The container box — where the indicator's rule and offset both land (#90). */
function container(): HTMLDivElement {
  const box = document.querySelector('[data-slot="table-container"]');
  if (box === null) throw new Error('no table container in the document');
  return box as HTMLDivElement;
}

/** The offset the `::after`'s `left` would read, or `null` when unset. */
function offsetProperty(): string | null {
  const value = container().style.getPropertyValue(OFFSET_PROPERTY);
  return value === '' ? null : value;
}

/** Whether the box carries the rule that paints the line. */
function hasIndicatorRule(): boolean {
  return container().className.includes(`after:left-[var(${OFFSET_PROPERTY})]`);
}

function renderTable(columnDefs: ColumnDef<Person, unknown>[]) {
  function Harness() {
    const controller = useDataTable({
      columns: columnDefs,
      data: rows,
      getRowId: (row) => row.id,
      columnsFeatures: { resizing: true },
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          renderHeader={(context, defaultContent) => {
            const controls = (context as WithControls).columns;
            return (
              <>
                {defaultContent}
                {controls.resizeHandleProps === undefined ? null : (
                  <span
                    data-testid={`handle-${controls.columnId}`}
                    {...controls.resizeHandleProps}
                  />
                )}
              </>
            );
          }}
        />
      </DataTableRoot>
    );
  }

  return render(<Harness />);
}

/** Grab a handle at `clientX`, which is where `startOffset` comes from. */
function grab(view: ReturnType<typeof renderTable>, columnId: string) {
  fireEvent.mouseDown(view.getByTestId(`handle-${columnId}`), { clientX: 500 });
}

/**
 * Move the pointer by `delta`.
 *
 * On `document`, not on the handle: `getResizeHandler` registers its listeners
 * there, which is what lets a drag continue once the pointer has left the 6px
 * handle. Dispatching on the handle would pass through bubbling today and stop
 * discriminating the moment the implementation stopped relying on it.
 */
function dragBy(delta: number) {
  fireEvent.mouseMove(document, { clientX: 500 + delta });
}

function release(delta: number) {
  fireEvent.mouseUp(document, { clientX: 500 + delta });
}

// The Tailwind-visibility guard. **This reads the SOURCE FILE AS TEXT, and that is
// the whole point** — the shipped defect was `after:left-[var(${OFFSET_PROPERTY})]`
// assembled by interpolation, which Tailwind's static scanner never sees, so no CSS
// rule was generated and the line pinned to the container's left edge on every drag.
//
// **A test asserting the runtime string would have PASSED on the broken code**, because
// the runtime string was always correct — `'…after:left-[var(--table-resize-indicator-x)]'`
// either way. Only the source text distinguishes a literal Tailwind can scan from a
// value assembled after the build. So the assertion has to be about the file, not the
// module, and anything that "tidies" this back into interpolation fails here.
describe('the indicator rule must be statically scannable', () => {
  // Resolved from the package root — `import.meta.url` is not a `file:` URL under
  // Vitest's transform pipeline.
  const source = readFileSync(
    resolve(
      process.cwd(),
      'src/components/ui/data-table/data-table-resize-indicator.ts'
    ),
    'utf8'
  );

  // The recognition denominator. Without it, a wrong path or an empty read makes
  // the `not.toMatch` assertion below pass for the worst possible reason — matching
  // nothing because there is nothing to match. Same hole as a set-membership check
  // that recognises zero members and reports a clean negative.
  it('actually read the module it claims to be checking', () => {
    expect(source.length).toBeGreaterThan(2000);
    expect(source).toContain('export function resizeIndicatorOffset');
  });

  it('carries the complete left utility as a literal in the source', () => {
    expect(source).toContain('after:left-[var(--table-resize-indicator-x)]');
  });

  it('declares the class as one uninterpolated literal', () => {
    // Scoped to the DECLARATION, not the whole file — and that scoping is itself a
    // finding. A file-wide regex for `after:…-[var(${` failed here, matching the
    // docblock above the constant, which quotes the defective form on purpose so the
    // next reader knows what not to do. A guard that cannot tell code from prose
    // punishes documenting the bug, so it has to look at the declaration.
    const declaration = source.slice(
      source.indexOf('const INDICATOR_CLASS ='),
      source.indexOf(';', source.indexOf('const INDICATOR_CLASS ='))
    );
    expect(declaration.length).toBeGreaterThan(80); // the slice actually landed
    expect(declaration).not.toContain('${'); // no interpolation
    expect(declaration).not.toContain('`'); // no template literal
    expect(declaration).not.toContain('+'); // no concatenation
  });

  it('agrees with the property name the style object actually sets', () => {
    // Both directions: the literal above is only correct if it names the property
    // `useDataTableResizeIndicator` writes. Catches a rename of one without the other.
    expect(source).toContain(
      "const OFFSET_PROPERTY = '--table-resize-indicator-x'"
    );
  });
});

// ── The notional/rendered split ──────────────────────────────────────────────
// **Every case in the `resizeIndicatorOffset` block below passes
// `measuredWidth === startSize`**, which is the shape of a column whose declared
// size the browser honours. That is deliberate and it is why those expectations did
// not move when the two were separated — but it also means none of them can catch
// the two being confused. These can.
//
// User-reported, after the resize fix landed: "for others its shown at place of
// previous column but resizing properly". `startSize` is
// `columnSizingInfo.startSize` = `column.getSize()`, which for an **unsized** column
// is TanStack's 150px default and has no relationship to the width the cell renders
// at under `table-layout: auto`. Measured on `Resizing`, dragging +60:
//
//   column   trueAnchor   rendered   line (before)   true edge + 60   error
//   name          0          200          260              260          0
//   region      200       348.66          410           608.66    -198.66
//   status   548.66       348.66      758.656           957.31    -198.65
//
// ...and at a 1920px viewport, where the unsized columns render 562px, the error
// grows to **-412px**. The line lands nearer the column's leading edge — the previous
// column's boundary — than its own trailing edge, which is exactly what was reported.
//
// `name` looked right for one reason only: it declares `size: 200` and renders at
// 200, so the two systems coincide there and nowhere else. A suite built only on
// sized columns is blind to this by construction.
describe('resizeIndicatorOffset when rendered width diverges from notional', () => {
  /** `region` at 1280px: notional 150, rendered 348.66, anchor 200, drag +60. */
  it('places the line on the MEASURED trailing edge, not the notional one', () => {
    expect(
      resizeIndicatorOffset({
        anchor: 200,
        startSize: 150,
        measuredWidth: 348.66,
        deltaOffset: 60,
        minSize: 20,
        maxSize: Number.POSITIVE_INFINITY,
      })
      // 200 + 348.66 + 60. The old formula gave 410 — 198.66px short, sitting just
      // past the previous column's trailing edge at 200.
    ).toBeCloseTo(608.66, 2);
  });

  it('scales with the rendered width rather than staying put', () => {
    // The same column at 1920px, where it renders 562px. A formula reading the
    // notional width returns 410 for BOTH viewports; the error is what changes.
    expect(
      resizeIndicatorOffset({
        anchor: 200,
        startSize: 150,
        measuredWidth: 562,
        deltaOffset: 60,
        minSize: 20,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(822);
  });

  it('sits exactly on the current edge at zero travel', () => {
    // The cheapest statement of correctness, and the one the user was making: before
    // the pointer has moved, the line is the edge. Previously this was off by
    // `rendered - notional` on every unsized column.
    expect(
      resizeIndicatorOffset({
        anchor: 200,
        startSize: 150,
        measuredWidth: 348.66,
        deltaOffset: 0,
        minSize: 20,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBeCloseTo(548.66, 2);
  });

  it('still stops where the COMMITTED width stops', () => {
    // The clamp stays in notional space, because that is the space TanStack commits
    // in. Notional 150 with a 120 floor can only give up 30px, so the line travels
    // 30px left of the measured edge and no further — however far the pointer goes.
    const atFloor = {
      anchor: 200,
      startSize: 150,
      measuredWidth: 348.66,
      minSize: 120,
      maxSize: Number.POSITIVE_INFINITY,
    };
    expect(
      resizeIndicatorOffset({ ...atFloor, deltaOffset: -100 })
    ).toBeCloseTo(518.66, 2);
    expect(
      resizeIndicatorOffset({ ...atFloor, deltaOffset: -100_000 })
    ).toBeCloseTo(518.66, 2);
  });

  it('falls back to the notional width when there is no layout', () => {
    // ⚠ The case that keeps this file's RENDERED tests meaningful. happy-dom has no
    // layout engine, so `measuredWidth` is 0 there for every column. Treating 0 as a
    // real width would put every line at `anchor + (clamped - startSize)` — 60px
    // instead of 260px in the drag tests below — so a zero width means "unmeasured"
    // and the notional value is the best estimate available without layout.
    expect(
      resizeIndicatorOffset({
        anchor: 0,
        startSize: 200,
        measuredWidth: 0,
        deltaOffset: 60,
        minSize: 20,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(260);
  });
});

describe('resizeIndicatorOffset', () => {
  it('places the line at the leading edge plus the prospective width', () => {
    expect(
      resizeIndicatorOffset({
        anchor: 40,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: 30,
        minSize: 20,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(270);
  });

  it('clamps up to the minimum instead of following the pointer past it', () => {
    // The defect this exists to prevent: TanStack writes the dragged width
    // unclamped and clamps in `getSize()` ON READ, so an unclamped line keeps
    // travelling after the column has already stopped.
    expect(
      resizeIndicatorOffset({
        anchor: 0,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: -150,
        minSize: 120,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(120);
  });

  it('clamps down to the maximum', () => {
    expect(
      resizeIndicatorOffset({
        anchor: 0,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: 400,
        minSize: 20,
        maxSize: 320,
      })
    ).toBe(320);
  });

  it('never reports a negative width, however far the pointer travels back', () => {
    // `table-core` floors the percentage at -0.999999, so the width collapses
    // towards 0 and never inverts. With no minimum to catch it, that floor is the
    // only thing standing between a big backwards drag and a line to the left of
    // the column's own start.
    expect(
      resizeIndicatorOffset({
        anchor: 60,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: -100_000,
        minSize: 0,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(60);
  });

  it('rounds to two decimals like the engine, not like the algebra', () => {
    // The discriminating case for mirroring `ColumnSizing.js` instead of the
    // equivalent-looking `startSize + deltaOffset`: the tidy form gives 200.005,
    // the engine commits 200.01, and only one of those is where the edge lands.
    expect(
      resizeIndicatorOffset({
        anchor: 0,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: 0.005,
        minSize: 0,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBe(200.01);
  });

  it('reports no line rather than a non-finite offset', () => {
    // Both holes, because they poison the result at different points and a guard
    // over the inputs can be complete for the ones it names and wrong anyway. An
    // unmeasured anchor survives every intermediate step — it is only added at the
    // end — and a zero `startSize` divides.
    expect(
      resizeIndicatorOffset({
        anchor: Number.NaN,
        startSize: 200,
        measuredWidth: 200,
        deltaOffset: 10,
        minSize: 0,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBeUndefined();

    expect(
      resizeIndicatorOffset({
        anchor: 0,
        startSize: 0,
        measuredWidth: 0,
        deltaOffset: 0,
        minSize: 0,
        maxSize: Number.POSITIVE_INFINITY,
      })
    ).toBeUndefined();
  });
});

describe('spansTableTrailingEdge', () => {
  // User-reported: "for the last column we either should not show it or change
  // table width itself" — they chose not showing it. The table is `w-full` under
  // `table-layout: auto`, so its right edge is fixed by the container and a line
  // claiming that edge is about to move is claiming something that cannot happen.
  //
  // **Only the pure predicate is exercised here, and that is the honest limit of
  // this environment**: the rendered cases in this file cannot reach it at all,
  // because happy-dom reports every rect as zero — which is itself one of the cases
  // below, and the reason the predicate declines rather than suppresses when it has
  // no geometry.

  it('suppresses the line when the column ends where the table ends', () => {
    expect(
      spansTableTrailingEdge({
        columnRight: 900,
        tableRight: 900,
        tableWidth: 900,
      })
    ).toBe(true);
  });

  it('draws the line for a column with columns after it', () => {
    // 180px of table to the right of this column — three more columns, or one.
    expect(
      spansTableTrailingEdge({
        columnRight: 720,
        tableRight: 900,
        tableWidth: 900,
      })
    ).toBe(false);
  });

  it('treats a sub-pixel gap as the same edge', () => {
    // Fractional layout and a table border are what the tolerance is for. It cannot
    // swallow a real column: the gap for an inner column is the sum of the columns
    // after it, and TanStack's `minSize` default alone puts that at 20px.
    expect(
      spansTableTrailingEdge({
        columnRight: 899.4,
        tableRight: 900,
        tableWidth: 900,
      })
    ).toBe(true);

    expect(
      spansTableTrailingEdge({
        columnRight: 880,
        tableRight: 900,
        tableWidth: 900,
      })
    ).toBe(false);
  });

  it('declines to answer when there is no layout, rather than suppressing', () => {
    // ⚠ **The case that decides whether the whole suite above still discriminates.**
    // happy-dom has no layout engine, so every rect reads zero and `columnRight ===
    // tableRight` is vacuously true for *every* column. A predicate that answered
    // `true` here would suppress the indicator in every rendered test in this file,
    // and they would all pass for the worst possible reason — asserting the absence
    // of a line that was never drawn.
    //
    // So a zero-width table means "unmeasured", not "one column wide", and the
    // answer is the pre-existing behaviour: draw the line.
    expect(
      spansTableTrailingEdge({ columnRight: 0, tableRight: 0, tableWidth: 0 })
    ).toBe(false);
  });

  it('declines on an unmeasurable element rather than throwing or suppressing', () => {
    // `NaN` is a different failure from zero — a detached or `display: none`
    // subtree, not an un-laid-out one — and `x <= 0` would let it through to the
    // comparison, where `Math.abs(NaN) <= 1` is `false` by luck rather than by
    // design. Pinned so the guard keeps being written as `!(width > 0)`.
    expect(
      spansTableTrailingEdge({
        columnRight: Number.NaN,
        tableRight: Number.NaN,
        tableWidth: Number.NaN,
      })
    ).toBe(false);
  });
});

describe('the drag indicator through a real drag', () => {
  it('draws nothing at rest', () => {
    renderTable(columns);

    expect(offsetProperty()).toBeNull();
    expect(hasIndicatorRule()).toBe(false);
  });

  it('tracks the prospective edge while the pointer moves', () => {
    const view = renderTable(columns);

    grab(view, 'name');
    dragBy(60);

    // 200 (the column's own size) + 60 of travel. The anchor term is 0 because
    // happy-dom reports every rect as zero — so this asserts the delta arithmetic
    // and the wiring, NOT the measured position of anything.
    expect(offsetProperty()).toBe('260px');
    expect(hasIndicatorRule()).toBe(true);

    dragBy(-40);
    expect(offsetProperty()).toBe('160px');
  });

  it('stops at the caller’s bounds rather than following the pointer', () => {
    const view = renderTable(boundedColumns);

    grab(view, 'name');
    dragBy(400);
    // Not 600. A line at the pointer would claim a width the release cannot
    // produce, which is the one failure mode worse than having no line.
    expect(offsetProperty()).toBe('320px');

    dragBy(-400);
    expect(offsetProperty()).toBe('120px');
  });

  it('removes both halves on release', () => {
    const view = renderTable(columns);

    grab(view, 'name');
    dragBy(60);
    expect(hasIndicatorRule()).toBe(true);

    release(60);

    // `isResizingColumn` is back to `false`, so the rule and the property both go
    // — a line left behind after release would read as a column border.
    expect(hasIndicatorRule()).toBe(false);
    expect(offsetProperty()).toBeNull();
  });

  it('follows the handle that was grabbed, not the first resizable column', () => {
    const view = renderTable(columns);

    grab(view, 'team');
    dragBy(25);

    // `team` is 100 wide; reading the wrong column's size would give 225.
    expect(offsetProperty()).toBe('125px');
  });
});
