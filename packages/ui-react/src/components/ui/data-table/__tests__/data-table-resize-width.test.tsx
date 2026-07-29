import type { ColumnDef } from '@tanstack/react-table';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../data-table-controller';
import type { DataTableColumnControls } from '../data-table-features/columns';
import type { DataTableHeaderContext } from '../data-table-render-context';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// User-reported: "resize indicator not properly positioned … first column cannot
// be resized", then the correction that located it —
//
//   "no for the first column indicator appears, width changes internally, because
//    as i see indicator appears at new spot each time but table column width
//    visually not changing"
//
// ── WHY THIS IS A SEPARATE FILE FROM THE INDICATOR'S ─────────────────────────
// `data-table-resize-indicator.test.tsx` owns the line. **This file owns the
// column**, and the defect was precisely that those two came apart: every visible
// half of the feature worked — the handle armed, the drag tracked, `columnSizing`
// updated, the indicator moved to a new offset on every drag — while the width
// `columnPresentation` emitted stayed at the number in the column def forever. A
// suite that only exercised the indicator was green throughout, which is why the
// assertions below are on the `<th>`'s own style and nowhere near the line.
//
// The mechanism: `declaredSizeStyle` (`data-table-features/columns.tsx`) built
// `width`/`minWidth` from `caller.size` — the *definition's* number, read out of
// `table.options.columns` — rather than from `column.getSize()`, which is the only
// expression of a committed resize. With `minWidth` pinned to the same constant the
// column could not shrink either, so it was inert in both directions.
//
// ── WHAT THIS FILE CAN AND CANNOT PROVE ──────────────────────────────────────
// **Style assertions, not layout ones**, exactly as
// `data-grid-chrome-column-width.test.tsx` states for its own subject: happy-dom
// has no layout engine, so "renders 60px wider" is not checkable here. What is
// checkable — and what was actually broken — is whether a resize reaches the
// element as a changed constraint at all. The rendered geometry is verified against
// Chromium separately.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const rows: Person[] = [
  { id: 'p1', name: 'Ada', team: 'Engine' },
  { id: 'p2', name: 'Grace', team: 'Compiler' },
];

/**
 * `name` is sized and `team` is not — the story's shape, and the one that matters.
 *
 * The two columns take **different arms** of the presentation: a sized column goes
 * through `declaredSizeStyle`, an unsized one through the `fit` fallback. The
 * defect lived in the first arm only, which is why the user reported the first
 * column and not the others, and why an unsized control belongs in every case.
 */
const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 200 },
  { id: 'team', accessorKey: 'team', header: 'Team' },
];

/** `name` capped at 120–320, so both of `getSize()`'s clamps are reachable. */
const boundedColumns: ColumnDef<Person, unknown>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    minSize: 120,
    maxSize: 320,
  },
  columns[1]!,
];

type WithControls = DataTableHeaderContext & {
  readonly columns: DataTableColumnControls;
};

/** Header cells, in visual order. */
const headers = () => [...document.querySelectorAll<HTMLElement>('thead th')];

/** The first body row's cells — a table column has one width for `th` and `td`. */
const firstRowCells = () => [
  ...document.querySelectorAll<HTMLElement>('tbody tr:first-child td'),
];

function renderTable(
  columnDefs: ColumnDef<Person, unknown>[],
  options?: {
    readonly columnSizing?: Readonly<Record<string, number>>;
    readonly fit?: 'content' | 'container' | false;
    /** Receives each column's controls, so a test can assert on the seam itself. */
    readonly onControls?: (controls: DataTableColumnControls) => void;
  }
) {
  function Harness() {
    const controller = useDataTable({
      columns: columnDefs,
      data: rows,
      getRowId: (row) => row.id,
      columnsFeatures: {
        resizing: true,
        ...(options?.fit === undefined ? {} : { fit: options.fit }),
      },
      ...(options?.columnSizing === undefined
        ? {}
        : { defaultState: { columnSizing: options.columnSizing } }),
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person>
          renderHeader={(context, defaultContent) => {
            const controls = (context as WithControls).columns;
            options?.onControls?.(controls);
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

/**
 * A complete drag, through the engine's own `getResizeHandler`.
 *
 * **Released, not just moved**, and that is load-bearing: `resizeMode` defaults to
 * `'onEnd'` (`columns.tsx`), so `columnSizing` is written on `mouseup` and a probe
 * that stopped at `mousemove` would read the old width and call the defect fixed
 * for the wrong reason. `mousemove` goes to `document` because that is where the
 * handler registers — see the note in the indicator's suite.
 */
function resize(
  view: ReturnType<typeof renderTable>,
  columnId: string,
  delta: number
) {
  fireEvent.mouseDown(view.getByTestId(`handle-${columnId}`), { clientX: 500 });
  fireEvent.mouseMove(document, { clientX: 500 + delta });
  fireEvent.mouseUp(document, { clientX: 500 + delta });
}

describe('a committed resize reaches the sized column’s width', () => {
  it('emits the declared size at rest', () => {
    // The **baseline-neutrality** case, pinned so it cannot be traded away. With no
    // entry in `columnSizing`, `getSize()` resolves to `columnDef.size` — the same
    // number `caller.size` produced — so nothing about an unresized grid changes and
    // no visual baseline moves. This assertion is the whole of that claim; if it
    // ever has to be updated, every committed PNG of a sized column moved with it.
    renderTable(columns);

    expect(headers()[0]!.style.width).toBe('200px');
    expect(headers()[0]!.style.minWidth).toBe('200px');
  });

  it('widens the column when the drag widens it', () => {
    const view = renderTable(columns);

    resize(view, 'name', 60);

    // 260, not 200. Before the fix this read `200px` at every delta, on every
    // release, forever.
    expect(headers()[0]!.style.width).toBe('260px');
    expect(headers()[0]!.style.minWidth).toBe('260px');
    // Both halves of the column, or the header moves and the body does not.
    expect(firstRowCells()[0]!.style.width).toBe('260px');
  });

  it('narrows the column when the drag narrows it', () => {
    // The direction a one-property fix could miss. `minWidth` was pinned to the
    // same constant as `width`, so a narrowing drag was blocked by the floor even
    // in a world where `width` had been fixed alone — the column would have been
    // half-inert, which is harder to notice than fully inert.
    const view = renderTable(columns);

    resize(view, 'name', -70);

    expect(headers()[0]!.style.width).toBe('130px');
    expect(headers()[0]!.style.minWidth).toBe('130px');
  });

  // ⚠ **One `render` per test below, and the cases are split for that reason
  // alone.** Testing Library's cleanup is per-test, not per-render, so a second
  // `render` in the same `it` leaves *both* tables in the document and
  // `headers()[0]` then reads whichever tree the query walked into first. Written
  // as two renders per case, the clamp assertions below passed while measuring the
  // other fixture's at-rest column.

  it('stops at the caller’s maximum rather than at the pointer', () => {
    // `getSize()` clamps on read, so the emitted constraint agrees with the
    // indicator's own clamp instead of overshooting it — the two are computed by
    // different code and these are the only cases that check them against the same
    // numbers.
    const view = renderTable(boundedColumns);

    resize(view, 'name', 400);

    expect(headers()[0]!.style.width).toBe('320px');
  });

  it('stops at the caller’s minimum rather than at the pointer', () => {
    const view = renderTable(boundedColumns);

    resize(view, 'name', -400);

    expect(headers()[0]!.style.width).toBe('120px');
  });

  it('publishes no maximum for a column the caller never capped', () => {
    // Half of the asymmetry in `declaredSizeStyle`: `width`/`minWidth` read
    // `getSize()`, but `maxWidth` must keep reading `caller.maxSize`, because the
    // *resolved* def defaults `maxSize` to `Number.MAX_SAFE_INTEGER` and this
    // file's subject once emitted `max-width: 9007199254740991px`. A value with a
    // default cannot express "unset", so the caller's own array stays the source
    // for that one member — and a resize must not start filling it in.
    const view = renderTable(columns);

    resize(view, 'name', 60);

    expect(headers()[0]!.style.width).toBe('260px');
    expect(headers()[0]!.style.maxWidth).toBe('');
  });

  it('leaves a capped column’s maximum at the caller’s number after a resize', () => {
    const view = renderTable(boundedColumns);

    resize(view, 'name', 60);

    // The cap is the caller's 320 and does not follow the width to 260.
    expect(headers()[0]!.style.width).toBe('260px');
    expect(headers()[0]!.style.maxWidth).toBe('320px');
  });

  it('leaves an unsized sibling on its own arm', () => {
    // Blast radius. The fix touches `declaredSizeStyle`, which only exists for a
    // column whose def declares a size; an unsized column must keep publishing a
    // floor and nothing else, or every grid in the kit re-flows.
    const view = renderTable(columns);

    resize(view, 'name', 60);

    const team = headers()[1]!;
    expect(team.style.width).toBe('');
    expect(team.style.maxWidth).toBe('');
    // TanStack's 150px default, as a floor only — the pre-existing behaviour of the
    // unsized arm, asserted here so the fix is attributable.
    expect(team.style.minWidth).toBe('150px');
  });
});

// #107, user-approved: storage restored `columnSizing: { name: 320 }` and the column
// rendered at **643.1px**. `name` declared no `size`, so it took the unsized arm,
// which published `min-width` only — and under `w-full` + `table-layout: auto` a
// floor below the width auto-layout already distributes does nothing at all.
//
// ── WHAT THESE TESTS CAN AND CANNOT REACH ────────────────────────────────────
// The fix has two halves and **only one of them is testable here**:
//
//  1. `columnPresentation` publishes a real `width` for a column carrying a
//     `columnSizing` entry. State-driven, so it is checkable in happy-dom, and every
//     case below is on it.
//  2. `seedRenderedSize` writes the column's *rendered* width into `columnSizing` on
//     `pointerdown`, so the engine's notional `startSize` and the edge on screen are
//     the same number. **Unreachable from any test in this file**: happy-dom performs
//     no layout, every `getBoundingClientRect().width` is 0, and the seed's own guard
//     returns early. Verified in Chromium only — see the last case, which pins the
//     early return so the limitation is visible rather than inferred.
//
// Half 1 alone is WRONG, and the two must not be separated: without the seed, a first
// drag of a column rendering 348.7px with a notional 150 publishes 210 and the column
// jumps backwards. Measured in Chromium at 1280px: +60px of pointer travel moved the
// edge 82.0px before, 60.3px after; the drag indicator's residual on an unsized
// column went from 22.0px (1280) and 72.2px (1920) to 0.0px at both — the same
// residual the sized column already had.
describe('#107 — an authored width is published as a width, not a floor', () => {
  it('publishes a restored width on a column that declares no size', () => {
    // The reported defect, in the only form a DOM test can hold: the constraint the
    // browser is given. Was `min-width: 320px` and nothing else.
    renderTable(columns, { columnSizing: { team: 320 } });

    const team = headers()[1]!;
    expect(team.style.width).toBe('320px');
    expect(team.style.minWidth).toBe('320px');
  });

  it('publishes it on the body cells too', () => {
    // A table column has one width for `th` and `td`; a fix that reached only the
    // header would tear the column in half. `columnPresentation` runs per cell, so
    // this is a real risk rather than a formality.
    renderTable(columns, { columnSizing: { team: 320 } });

    expect(firstRowCells()[1]!.style.width).toBe('320px');
  });

  it('keeps `fit: content` for a column with NO entry, in the same table', () => {
    // The discriminator. If the new arm were reached unconditionally it would take
    // every unsized column out of `fit`, which is #91's failure mode in reverse:
    // `team` is authored and `name`'s sibling arm must be untouched.
    renderTable(
      [columns[1]!, { id: 'other', accessorKey: 'team', header: 'Other' }],
      {
        columnSizing: { team: 320 },
        fit: 'content',
      }
    );

    expect(headers()[0]!.style.width).toBe('320px');
    // No entry: still the `fit` arm, still a floor, no width.
    expect(headers()[1]!.style.width).toBe('');
    expect(headers()[1]!.style.minWidth).toBe('fit-content');
  });

  it('keeps `fit: container` emitting nothing for a column with no entry', () => {
    // The `container` arm emits an empty style, so "working" and "reached by the new
    // arm" look alike unless the absence is asserted. Its own defect is separate and
    // measured: before the fix a drag under `fit: 'container'` moved the edge **0px**,
    // because the committed size had no CSS expression at all.
    renderTable(
      [columns[1]!, { id: 'other', accessorKey: 'team', header: 'Other' }],
      {
        fit: 'container',
      }
    );

    expect(headers()[0]!.style.width).toBe('');
    expect(headers()[0]!.style.minWidth).toBe('');
  });

  it('leaves a column that declares a size on the declared arm', () => {
    // `declaredSizeStyle` is checked first, so a sized column with an entry must go
    // through the arm #98 fixed and not through the new one. Both publish
    // `width: getSize()`, which is exactly why an assertion on the width alone cannot
    // tell them apart — `maxWidth` is the discriminator, because only the declared
    // arm carries the caller's cap.
    renderTable(boundedColumns, { columnSizing: { name: 280 } });

    expect(headers()[0]!.style.width).toBe('280px');
    expect(headers()[0]!.style.maxWidth).toBe('320px');
  });

  it('publishes onPointerDown on the resize-handle seam', () => {
    // The seam half 2 travels through. A composer that spreads `resizeHandleProps`
    // gets it for free; one that hand-picks `onMouseDown` silently loses the fix,
    // which is why the prop's docblock says so.
    //
    // Asserted on the **controls object**, not by firing the event on the handle.
    // Firing it proves nothing: with no handler attached, "nothing happened" is
    // exactly what a passing assertion looks like, so that version of this test
    // passed against pristine code as well.
    const seen: (string[] | undefined)[] = [];
    renderTable(columns, {
      onControls: (controls) =>
        seen.push(
          controls.resizeHandleProps === undefined
            ? undefined
            : Object.keys(controls.resizeHandleProps).sort()
        ),
    });

    expect(seen.length).toBeGreaterThan(0);
    for (const keys of seen) {
      expect(keys).toEqual(['onMouseDown', 'onPointerDown', 'onTouchStart']);
    }
  });

  it('writes nothing from the seed when there is no layout', () => {
    // The limitation, pinned rather than left to be discovered. happy-dom reports a
    // 0px rect and the seed refuses to publish 0 as a width — so a `pointerdown` here
    // is inert, and no test in this file can exercise the seed's actual arithmetic.
    // If this ever starts failing, the environment gained layout and the seed became
    // testable, which is a good thing to be told about.
    const view = renderTable(columns);

    fireEvent.pointerDown(view.getByTestId('handle-team'), { clientX: 500 });

    expect(headers()[1]!.style.width).toBe('');
    expect(headers()[1]!.style.minWidth).toBe('150px');
  });
});
