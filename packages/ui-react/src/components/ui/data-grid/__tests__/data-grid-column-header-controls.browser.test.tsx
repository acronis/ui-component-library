import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
// `vitest/browser`, not `@vitest/browser/context`: the latter is the Vitest 3
// path this suite was written against. Vitest 4 moved the context onto the
// runner and re-exports it from the active provider package.
import { userEvent as browserUserEvent } from 'vitest/browser';

import { DataGrid } from '../data-grid';

// The browser sibling of `data-grid-column-header-controls.test.tsx`.
//
// ── WHY THESE TESTS ARE NOT IN THAT FILE ─────────────────────────────────────
// They were `describe.skip`ped there, marked "SKIP(vendor): needs real-browser
// pointer events". The cause is not pointer events specifically — it is that
// happy-dom dispatches **programmatic** events, and React's discrete-event flush
// path is taken only by **trusted** ones. A grip engaged by a synthetic click can
// therefore report the right `aria-pressed` while the keyboard handler it installs
// never runs on the path a user takes.
//
// Run by the `browser` Vitest project (`npm run test:browser`), which uses real
// Chromium via Playwright. That project **fails rather than skips** when no browser
// is available: the entire reason it exists is coverage happy-dom could not see, so
// a green run that tested nothing would be worse than a red one.
//
// Everything here is a straight port — same fixtures, same assertions. The
// interaction is what changes environment, not the test.
//
// Not ported: the 16-test `pointer reorder` suite in the happy-dom file. Those
// stub `getBoundingClientRect` *because* happy-dom performs no layout, and that
// scaffold is wrong in a browser where layout is real. They need rewriting against
// real geometry rather than moving. See `docs/contributing/qa.md`.

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

const gripFor = (columnId: string) =>
  screen.getByRole('button', { name: `Reorder ${columnId} column` });

const renderGrid = () =>
  render(
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      sorting={{}}
      columnsFeatures={{ reordering: true }}
    />
  );

describe('DataGrid column header controls — keyboard reorder', () => {
  it('moves the column once the grip is engaged, and announces the position', async () => {
    const user = userEvent.setup();
    const { container } = renderGrid();

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
    const { container } = renderGrid();

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
    renderGrid();

    await user.click(gripFor('site'));
    await user.keyboard('{ArrowRight}');
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);
  });
});

describe('DataGrid column header controls — pointer reorder, for real', () => {
  // The happy-dom file covers the gesture-to-command mapping in 16 tests, with
  // `getBoundingClientRect` stubbed into a tidy 100px-per-column geometry and
  // `setPointerCapture` stubbed to a no-op (see `vitest.setup.ts`).
  //
  // This is the part those stubs cannot reach, and the only reason to spend a real
  // browser on the pointer gesture:
  //
  //   - **Capture actually retargets.** The pointer is pressed on the grip and
  //     released over a *different* element. Every `pointermove` and the `pointerup`
  //     land on the grip only because the browser redirects them there. With a
  //     no-op `setPointerCapture` nothing redirects — the stubbed suite passes
  //     because it dispatches events at the grip by hand.
  //   - **Real layout answers the hit test.** No rects are stubbed here, so
  //     `columnAtClientX` reads geometry the browser computed. A sign error or an
  //     off-by-one band boundary that a tidy synthetic layout tolerates would show
  //     up here.
  //
  // One test, deliberately. This tier is expensive and the mapping is already
  // covered; what is bought here is the two assumptions above, once.
  it('commits a drag driven by a real pointer, with real capture and real geometry', async () => {
    renderGrid();
    expect(headerOrder()).toEqual(['Name', 'Team', 'Site']);

    await browserUserEvent.dragAndDrop(
      gripFor('name'),
      screen.getByRole('columnheader', { name: /Team/ })
    );

    expect(headerOrder()).toEqual(['Team', 'Name', 'Site']);
  });
});
