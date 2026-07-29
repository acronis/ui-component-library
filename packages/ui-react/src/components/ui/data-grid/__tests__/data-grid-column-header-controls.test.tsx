import type { ColumnDef } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../data-grid';
import { columnAtClientX } from '../data-grid-column-header-controls';

// OWNERSHIP: **U3.** The resize handle and reorder grip, exercised through a real
// `<DataGrid>` — which is the only configuration that proves the whole chain: the
// config module's `renderHeaderControls`, the engine's `columnPresentation`
// adornment, `TableHead`'s `trailing` slot, and the shared live region from this
// group's `chrome`.
//
// **Every grid here is `sorting`-enabled on purpose.** A records grid is normally
// sortable *and* resizable, and the sortable header is what makes the placement
// matter: `before-label`/`after-label` adornments render inside the sort
// `<button>`, where a control's pointer release sorts, its Enter/Space sorts, and
// its label is absorbed into the header's accessible name. Asserting on a
// non-sortable grid would pass on the broken placement — that exact harness gap is
// why the first version of the seam's tests could not fail.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly site: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'team', accessorKey: 'team', header: 'Team' },
  { id: 'site', accessorKey: 'site', header: 'Site' },
];

const rows: Person[] = [
  { id: 'p1', name: 'Ada', team: 'Engine', site: 'eu-central-1' },
  { id: 'p2', name: 'Grace', team: 'Compiler', site: 'us-east-1' },
];

const liveRegion = (container: HTMLElement) =>
  container.querySelector('[data-slot="data-grid-column-announcer"]');

const headerOrder = () =>
  screen.getAllByRole('columnheader').map((cell) => cell.textContent ?? '');

const handleFor = (columnId: string) =>
  screen.getByRole('separator', { name: `Resize ${columnId} column` });

const gripFor = (columnId: string) =>
  screen.getByRole('button', { name: `Reorder ${columnId} column` });

describe('DataGrid column header controls — placement', () => {
  it('renders the controls in the header cell but outside the sort button', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true, reordering: true }}
      />
    );

    const header = screen.getByRole('columnheader', { name: 'Name' });
    const handle = handleFor('name');
    const grip = gripFor('name');

    expect(header).toContainElement(handle);
    expect(header).toContainElement(grip);

    // The sort button is the first button in the cell; the grip must not be inside
    // it. This is the assertion the `edge` placement exists for.
    const sortButton = header.querySelector('button');
    expect(sortButton).not.toBe(grip);
    expect(sortButton).not.toContainElement(grip);
    expect(sortButton).not.toContainElement(handle);
  });

  it('keeps the header accessible name free of the controls', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true, reordering: true }}
      />
    );

    // Asserting the **name**, not the nesting. A version that renders the handle
    // in the right place and still folds its label into the header passes every
    // nesting assertion — and that version shipped once. A column header is
    // announced when navigating every cell of the column, so the cost is
    // "Name Resize name column" on every row.
    expect(
      screen.getByRole('columnheader', { name: 'Name' })
    ).toHaveAccessibleName('Name');
  });

  it('does not sort when the handle is used', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true }}
      />
    );

    const header = screen.getByRole('columnheader', { name: 'Name' });
    expect(header).toHaveAttribute('aria-sort', 'none');

    await user.click(handleFor('name'));
    // Nested in the sort button, the click's release would have sorted.
    expect(header).toHaveAttribute('aria-sort', 'none');

    handleFor('name').focus();
    await user.keyboard('{Enter}');
    // And Enter would have sorted instead of doing nothing.
    expect(header).toHaveAttribute('aria-sort', 'none');
  });

  it('mounts exactly one live region for the grid', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true, reordering: true }}
      />
    );

    // Not one per control, and not one per column: three columns with two controls
    // each would otherwise be six regions competing to speak.
    expect(
      container.querySelectorAll('[data-slot="data-grid-column-announcer"]')
    ).toHaveLength(1);
  });
});

describe('DataGrid column header controls — keyboard resize', () => {
  it('grows the column on ArrowRight and announces the new width', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true }}
      />
    );

    const handle = handleFor('name');
    const before = Number(handle.getAttribute('aria-valuenow'));
    handle.focus();
    await user.keyboard('{ArrowRight}');

    const after = before + 16;
    expect(handleFor('name')).toHaveAttribute('aria-valuenow', String(after));
    // The width has to reach the cell, not just the handle's own state.
    expect(
      screen.getByRole('columnheader', { name: 'Name' }).style.minWidth
    ).toBe(`${after}px`);
    expect(liveRegion(container)).toHaveTextContent(
      `name column width ${after} pixels`
    );
  });

  it('shrinks on ArrowLeft and stops announcing once it is at the minimum', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={[
          {
            id: 'name',
            accessorKey: 'name',
            header: 'Name',
            size: 120,
            minSize: 112,
          },
          ...columns.slice(1),
        ]}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true }}
      />
    );

    handleFor('name').focus();
    await user.keyboard('{ArrowLeft}');
    expect(handleFor('name')).toHaveAttribute('aria-valuenow', '112');
    expect(liveRegion(container)).toHaveTextContent(
      'name column width 112 pixels'
    );
    const announced = liveRegion(container)?.textContent;

    await user.keyboard('{ArrowLeft}');
    // Still at the clamp, so the engine reports nothing and the region is not
    // rewritten. A composer that announced regardless would say "112 pixels" on
    // every further press.
    //
    // Compared as *text identity*, not against the sentence: the announcer
    // alternates a zero-width space so an identical repeat is still spoken, so a
    // re-announcement changes the text while reading the same. Asserting the
    // sentence would pass either way — which is precisely the announcement bug
    // this is here to catch.
    expect(handleFor('name')).toHaveAttribute('aria-valuenow', '112');
    expect(liveRegion(container)?.textContent).toBe(announced);
  });

  it('publishes a valuemax only for a column the caller capped', () => {
    render(
      <DataGrid
        columns={[
          { id: 'name', accessorKey: 'name', header: 'Name', maxSize: 300 },
          ...columns.slice(1),
        ]}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ resizing: true }}
      />
    );

    expect(handleFor('name')).toHaveAttribute('aria-valuemax', '300');
    // The engine's resolved maximum is `Number.MAX_SAFE_INTEGER`; announcing it
    // would be the nine-quadrillion `max-width` defect read out loud.
    expect(handleFor('team')).not.toHaveAttribute('aria-valuemax');
    // A minimum is real, so it is published.
    expect(handleFor('team')).toHaveAttribute('aria-valuemin');
  });
});

describe('DataGrid column header controls — keyboard reorder', () => {
  it('moves the column once the grip is engaged, and announces the position', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ reordering: true }}
      />
    );

    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);

    const grip = gripFor('name');
    grip.focus();
    await user.keyboard('{ArrowRight}');
    // Nothing yet: the grip has to be engaged first, so the header's arrow keys
    // are not claimed from the grid by a control that merely has focus.
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);

    await user.click(grip);
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'true');
    expect(liveRegion(container)).toHaveTextContent(
      'name column: use the arrow keys to move it'
    );

    await user.keyboard('{ArrowRight}');
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
    expect(liveRegion(container)).toHaveTextContent(
      'name column moved to position 2 of 3'
    );
  });

  it('ends the interaction on Escape without moving the column back', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ reordering: true }}
      />
    );

    await user.click(gripFor('name'));
    await user.keyboard('{ArrowRight}');
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);

    await user.keyboard('{Escape}');
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'false');
    // Escape finishes; it does not undo. Every arrow press was applied and
    // announced as it happened, so the announcement states where the column is.
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
    expect(liveRegion(container)).toHaveTextContent(
      'name column at position 2 of 3'
    );

    await user.keyboard('{ArrowRight}');
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
  });

  it('refuses to move past the end of the column set', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ reordering: true }}
      />
    );

    await user.click(gripFor('site'));
    await user.keyboard('{ArrowRight}');
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });
});

/* -------------------------------------------------------------------------- */
/*                        Pointer reorder — the gesture                       */
/* -------------------------------------------------------------------------- */

// ── WHAT THIS FILE CAN AND CANNOT REACH ──────────────────────────────────────
// happy-dom performs no layout, so nothing below observes a real drag. Two halves
// are separated on purpose:
//
//  - `columnAtClientX` is pure and needs no DOM, so its containment rule — the one
//    place a right-to-left mistake could live if it formed a direction, and it does
//    not — is tested directly and exactly.
//  - the gesture-to-command mapping is tested through a real `<DataGrid>` with the
//    header cells' rects **stubbed**, which is what makes the hit test
//    discriminating at all: unstubbed, every rect is zero, `columnAtClientX`
//    declines by design, and a drag test would pass while targeting nothing.
//
// ⚠ **The rendered gesture is verified by hand in a browser and by nothing here or
// in CI** (#78). No assertion below can see whether the drop outline paints, where
// it paints, whether pointer capture actually retargets the move events, or whether
// `lostpointercapture` arrives after `pointerup` as the spec says — the commit path
// depends on that order and happy-dom does not model it.

describe('columnAtClientX', () => {
  const rects = [
    { columnId: 'name', left: 0, right: 100 },
    { columnId: 'team', left: 100, right: 220 },
    { columnId: 'site', left: 220, right: 300 },
  ];

  it('answers with the column whose band contains the pointer', () => {
    expect(columnAtClientX(rects, 50)).toBe('name');
    expect(columnAtClientX(rects, 150)).toBe('team');
    expect(columnAtClientX(rects, 299)).toBe('site');
  });

  it('gives a shared edge to exactly one column', () => {
    // Half-open, so the answer at a boundary does not depend on the order the
    // candidates happen to be measured in.
    expect(columnAtClientX(rects, 100)).toBe('team');
    expect(columnAtClientX([...rects].reverse(), 100)).toBe('team');
    expect(columnAtClientX(rects, 220)).toBe('site');
  });

  it('declines outside every band rather than picking the nearest', () => {
    expect(columnAtClientX(rects, -1)).toBeUndefined();
    expect(columnAtClientX(rects, 300)).toBeUndefined();
    expect(columnAtClientX([], 50)).toBeUndefined();
  });

  it('declines when there was no layout to measure', () => {
    // Every rect reads zero under happy-dom and in any un-laid-out subtree. A
    // function comparing measurements requires there to have been a measurement;
    // the alternative here would be to silently return the first candidate.
    const unmeasured = rects.map((rect) => ({ ...rect, left: 0, right: 0 }));
    expect(columnAtClientX(unmeasured, 0)).toBeUndefined();
    expect(columnAtClientX(unmeasured, 50)).toBeUndefined();
  });
});

/**
 * Hands each header cell a 100px band, left to right in DOM order.
 *
 * The numbers are arbitrary; the containment they express is the thing under test.
 * Returned so a caller can assert on the same elements it just laid out.
 */
const layOutHeaderCells = (): HTMLElement[] => {
  const cells = screen.getAllByRole('columnheader');
  cells.forEach((cell, index) => {
    const left = index * 100;
    cell.getBoundingClientRect = () =>
      ({
        left,
        right: left + 100,
        top: 0,
        bottom: 40,
        width: 100,
        height: 40,
        x: left,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
  });
  return cells;
};

/** The band centre of the nth header cell, in the geometry above. */
const bandCentre = (index: number) => index * 100 + 50;

const dropTarget = () =>
  document
    .querySelector('[data-reorder-target]')
    ?.getAttribute('data-column-id');

describe('DataGrid column header controls — pointer reorder', () => {
  const renderGrid = (
    props: Partial<React.ComponentProps<typeof DataGrid>> = {}
  ) =>
    render(
      <DataGrid
        columns={columns as ColumnDef<unknown, unknown>[]}
        rows={rows as unknown[]}
        getRowId={(row) => (row as Person).id}
        sorting={{}}
        columnsFeatures={{ reordering: true }}
        {...props}
      />
    );

  it('moves the column onto the one the pointer was released over', () => {
    const { container } = renderGrid();
    layOutHeaderCells();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });

    expect(headerOrder()).toEqual(['Team', 'Site', 'Name']);
    // The keyboard path's sentence, word for word — both go through
    // `announcementFor`, so a pointer user and a keyboard user hear the same thing.
    expect(liveRegion(container)).toHaveTextContent(
      'name column moved to position 3 of 3'
    );
  });

  it('paints the drop target during the drag and clears it on release', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    expect(dropTarget()).toBeUndefined();

    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });
    expect(dropTarget()).toBe('team');

    // Moving on repaints one cell, never two.
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(1);
    expect(dropTarget()).toBe('site');

    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    // The attribute is written outside React, so nothing would remove it for the
    // gesture. Left behind, it would be a permanent outline on a header cell.
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
  });

  it('leaves a press below the drag threshold as a click', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    // 3px, under the 4px threshold — an unsteady click, not a drag.
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(0) + 3,
      clientY: 20,
    });
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(0) + 3,
      clientY: 20,
    });
    // `fireEvent.pointerUp` does not synthesize the click a browser would send
    // after it, so the click is fired explicitly: the assertion is about what
    // happens *when* it arrives, not about whether it does.
    //
    // `detail: 1` is not decoration. A pointer's click carries a click count;
    // `fireEvent.click`'s default is `detail: 0`, which is the *keyboard*
    // activation shape — so the default would model the wrong event here.
    fireEvent.click(grip, { detail: 1 });

    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'true');
    expect(liveRegion(container)).toHaveTextContent(
      'name column: use the arrow keys to move it'
    );
  });

  it('does not also engage the keyboard mode when the press was a drag', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });
    fireEvent.click(grip, { detail: 1 });

    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'false');
  });

  it('never swallows a keyboard activation, even one left over from a drag', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: 50,
      clientY: 20,
    });
    fireEvent.pointerMove(grip, { pointerId: 1, clientX: 150, clientY: 20 });
    fireEvent.pointerUp(grip, { pointerId: 1, clientX: 150, clientY: 20 });
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);

    // The drag's own trailing click never arrived — capture lost, or released over
    // an element that had scrolled away. The suppression is still armed. **The next
    // Enter press must not be what disarms it**: `detail: 0` is what a keyboard
    // activation carries, and it is the only entry point this control has for
    // someone not using a pointer.
    fireEvent.click(gripFor('name'), { detail: 0 });
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'true');
  });

  it('suppresses one pointer click only — the next press starts clean', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: 50,
      clientY: 20,
    });
    fireEvent.pointerMove(grip, { pointerId: 1, clientX: 150, clientY: 20 });
    fireEvent.pointerUp(grip, { pointerId: 1, clientX: 150, clientY: 20 });
    fireEvent.click(grip, { detail: 1 });
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);

    // A second press that is only a click engages the keyboard mode as always.
    const moved = gripFor('name');
    fireEvent.pointerDown(moved, {
      pointerId: 2,
      button: 0,
      clientX: 150,
      clientY: 20,
    });
    fireEvent.pointerUp(moved, { pointerId: 2, clientX: 150, clientY: 20 });
    fireEvent.click(moved, { detail: 1 });
    expect(gripFor('name')).toHaveAttribute('aria-pressed', 'true');
  });

  it('abandons the drag on Escape with nothing moved', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(dropTarget()).toBe('site');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);

    // Release after the abort commits nothing: unlike the keyboard path, where
    // every arrow press is already applied, the pointer path applies nothing until
    // release — so there is a state in which abandoning really means nothing moved.
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
    expect(liveRegion(container)).toHaveTextContent('');
  });

  /* ── THE EVENT-ORDER DEPENDENCY, WHICH IS ONLY ASSERTABLE HERE ───────────────
     `lostpointercapture` fires on every normal release, not only when capture is
     yanked. An earlier version aborted on it, which made the commit depend on it
     arriving AFTER `pointerup` — and the failure that bought was the worst shape
     available: the move was silently lost and the drag appeared to do nothing,
     which is indistinguishable from the feature never having been built.

     The spec orders them `pointerup` → `lostpointercapture`, and it was measured
     that way in Chromium 148.0.7778.96 — ONE engine, one version, and a browser
     measurement is not something any test can hold. happy-dom will dispatch them in
     either sequence, so BOTH orders are asserted: that is the whole reason the
     order-independent shape is worth having over a documented dependency. Asserting
     only the inverted order would not notice the normal path regressing. */
  const dragNameOntoTeam = (grip: HTMLElement) => {
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });
  };

  it('commits when lostpointercapture follows pointerup (the observed order)', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    dragNameOntoTeam(grip);
    expect(dropTarget()).toBe('team');

    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });
    fireEvent.lostPointerCapture(grip, { pointerId: 1 });

    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
    expect(liveRegion(container)).toHaveTextContent(
      'name column moved to position 2 of 3'
    );
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
  });

  it('commits when lostpointercapture precedes pointerup (the inverted order)', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    dragNameOntoTeam(grip);
    expect(dropTarget()).toBe('team');

    // Capture goes first. The drop paint must be gone by now — nothing is tracking
    // any more — but the record has to survive so the release can still name its
    // target.
    fireEvent.lostPointerCapture(grip, { pointerId: 1 });
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);

    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(1),
      clientY: 20,
    });

    // The same outcome as the observed order, which is the point.
    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
    expect(liveRegion(container)).toHaveTextContent(
      'name column moved to position 2 of 3'
    );
  });

  it('stops tracking once capture is lost, and commits nothing without a release', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    dragNameOntoTeam(grip);
    fireEvent.lostPointerCapture(grip, { pointerId: 1 });

    // A stray move must not re-arm the affordance: the record outlives capture so a
    // late release can commit, but the gesture is over as far as tracking goes.
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);

    // And with no release at all, nothing is applied and nothing is announced.
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
    expect(liveRegion(container)).toHaveTextContent('');
  });

  it('abandons the drag when the pointer is cancelled', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    fireEvent.pointerCancel(grip, { pointerId: 1 });

    expect(document.querySelectorAll('[data-reorder-target]')).toHaveLength(0);
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });

  it('ignores a release over the dragged column itself', () => {
    const { container } = renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(0),
      clientY: 20,
    });
    // Past the threshold, but still inside the source column's own band — which
    // is also where the resize handle beside the grip lives.
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(0) + 20,
      clientY: 20,
    });
    expect(dropTarget()).toBeUndefined();

    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(0) + 20,
      clientY: 20,
    });
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
    expect(liveRegion(container)).toHaveTextContent('');
  });

  it('ignores a secondary button', () => {
    renderGrid();
    layOutHeaderCells();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 2,
      clientX: bandCentre(0),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });

    expect(dropTarget()).toBeUndefined();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });

  it('offers no locked column as a drop target', () => {
    renderGrid({
      selection: { mode: 'multiple' },
      columnsFeatures: { reordering: true },
    });
    const cells = layOutHeaderCells();
    // The selection column is locked by default (`lockSystemColumns`), so it
    // carries no grip — and a cell with no grip is not a candidate. The legality
    // rule is read off the rendered output, not restated by the gesture.
    expect(
      cells[0]?.querySelector('[data-slot="column-reorder-grip"]')
    ).toBeNull();

    const grip = gripFor('name');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(1),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(0),
      clientY: 20,
    });
    expect(dropTarget()).toBeUndefined();

    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(0),
      clientY: 20,
    });
    expect(headerOrder().slice(1)).toEqual(['Name', 'Team', 'Site']);
  });

  it('offers no column in another pin region as a drop target', () => {
    renderGrid({
      columnsFeatures: { reordering: true, pinning: true },
      defaultState: { columnPinning: { left: ['name'], right: [] } },
    });
    layOutHeaderCells();

    // §6.9: a move stays inside the column's own pin region. `data-pinned` is
    // absent on a centre column and `'start'` on this one, which is the region
    // boundary as it reaches the DOM.
    const grip = gripFor('team');
    fireEvent.pointerDown(grip, {
      pointerId: 1,
      button: 0,
      clientX: bandCentre(1),
      clientY: 20,
    });
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(0),
      clientY: 20,
    });
    expect(dropTarget()).toBeUndefined();

    // …while its own region's peer is still reachable.
    fireEvent.pointerMove(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(dropTarget()).toBe('site');
    fireEvent.pointerUp(grip, {
      pointerId: 1,
      clientX: bandCentre(2),
      clientY: 20,
    });
    expect(headerOrder()).toEqual(['Name', 'Site', 'Team']);
  });

  it('is unavailable when reordering is off', () => {
    renderGrid({ columnsFeatures: { resizing: true } });
    expect(
      document.querySelectorAll('[data-slot="column-reorder-grip"]')
    ).toHaveLength(0);
    // And the paint rule is not published either, so no cell can be marked.
    expect(
      screen
        .getAllByRole('columnheader')
        .filter((cell) => cell.className.includes('data-reorder-target'))
    ).toHaveLength(0);
  });
});

describe('DataGrid column header controls — what does not render one', () => {
  it('renders no controls for a group that only offers visibility', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        columnsFeatures={{ visibility: true }}
      />
    );

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Reorder / })).toBeNull();
    // The live region still mounts: the column-settings menu announces into it.
    expect(liveRegion(container)).toBeInTheDocument();
  });

  it('shares the grid-mounted region with the column-settings menu', async () => {
    // The claim this closes: "one live region per grid, **shared** with the
    // settings menu". Both halves were asserted separately — the menu announcing
    // into a hand-mounted region, and the grid mounting a region for this config —
    // and neither shows that the menu reaches *the grid's own* region. A channel
    // keyed on the wrong object passes both halves and fails only here, which is
    // the "reachable in aggregate, unreachable in its own case" shape.
    const user = userEvent.setup();
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        toolbar={{ viewOptions: true }}
        columnsFeatures={{ visibility: true, resizing: true }}
      />
    );

    expect(
      container.querySelectorAll('[data-slot="data-grid-column-announcer"]')
    ).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: /view/i }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'team' }));
    expect(liveRegion(container)).toHaveTextContent('team column hidden');

    // And the header controls reach the same one — the reason it is shared at all.
    handleFor('name').focus();
    await user.keyboard('{ArrowRight}');
    expect(liveRegion(container)).toHaveTextContent('name column width');
  });

  it('renders no controls at all without the group', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
      />
    );

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.queryByRole('button', { name: /^Reorder / })).toBeNull();
  });

  it('leaves the system columns alone by default', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        selection={{ mode: 'multiple' }}
        actions={{ items: [{ id: 'edit', label: 'Edit' }], onAction: () => {} }}
        columnsFeatures={{ resizing: true, reordering: true }}
      />
    );

    // `lockSystemColumns` defaults to true, so the selection and actions columns
    // carry no handle and no grip — a focusable resize handle on a checkbox column
    // is not what "stays locked" means.
    expect(screen.getAllByRole('separator')).toHaveLength(columns.length);
    expect(screen.getAllByRole('button', { name: /^Reorder / })).toHaveLength(
      columns.length
    );
  });

  it('offers them once the caller unlocks them', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sorting={{}}
        selection={{ mode: 'multiple' }}
        columnsFeatures={{
          resizing: true,
          reordering: true,
          lockSystemColumns: false,
        }}
      />
    );

    // The selection column joins in — which is what makes the default above a
    // policy rather than an accident of the column set.
    expect(screen.getAllByRole('separator')).toHaveLength(columns.length + 1);
  });
});
