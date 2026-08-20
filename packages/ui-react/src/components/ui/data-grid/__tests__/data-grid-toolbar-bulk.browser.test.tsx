import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

// The real stylesheet, and it is a **precondition** rather than a nicety: both
// assertions here are measurements, and without the design system's tokens plus the
// Tailwind utilities the vendored grid uses, Chromium lays out unstyled markup and
// reports numbers that mean nothing. Measured while writing this: a toolbar row 42px
// instead of 40 and a 32px control reported as 21 — assertions failing against a fix
// that was correct.
//
// The same entry Storybook's preview uses, imported here rather than added to
// `vitest.setup.browser.ts` so the existing reorder suite keeps its current startup
// cost and environment. Tailwind v4 compiles it through this package's
// `postcss.config.js`.
//
// **This is a new pattern in the package** — nothing else in the browser tier loads
// CSS — so it is worth saying what earns it, below.
import '../../../../styles/index.css';

import { DataGrid } from '../data-grid';

// PLTFRM-93130, the two claims no other layer can make.
//
// ── WHY NOT HAPPY-DOM ────────────────────────────────────────────────────────
// happy-dom performs no layout and reports zero for every box, so "the table did not
// move" is not a question it can answer. `data-grid-toolbar-bulk.test.tsx` pins the
// *structure* of the fix instead — one element, no sibling row added — which is the
// right layer for that claim and a green suite while the row still changed height.
//
// ── WHY NOT VISUAL REGRESSION ────────────────────────────────────────────────
// It carries most of this ticket: `__stories__/data-grid-toolbar-states.stories.tsx`
// files five baselines, and every *single-state* defect here — the gear off-centre in
// its cell, control heights disagreeing, the search box painted over a filter trigger
// — is visible in one of them. Those assertions were written and deleted; a picture
// says it better.
//
// What a baseline cannot say is a relation **between two states**, because it compares
// each story to its own previous self and never one story to another. And a baseline is
// accepted by a person: `npm run test:visual:update` rewrites all 304 at once, so a
// regression that shifts a row by 8px can ride along in a batch someone approves for an
// unrelated reason — the "gate did not gate" shape `docs/contributing/qa.md` records.
// These two are rules instead of pictures, and a rule cannot be absorbed.
//
// Both are the defect as reported, in pixels: the first fix used `min-h-8`, the `Filter`
// trigger was 40px while the strip's buttons are 32px, and the row **shrank** 8px on the
// first selection — the reported jump, smaller and in the other direction, with every
// unit test green.
//
// Run by the `browser` project (`npm run test:browser`), real Chromium via Playwright,
// which fails rather than skips when no browser is available.

interface Disk {
  readonly id: string;
  readonly name: string;
  readonly status: 'Healthy' | 'Slow';
  readonly type: 'HDD' | 'SSD';
}

const columns: ColumnDef<Disk, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'type', header: 'Type' },
];

const disks: Disk[] = [
  { id: 'd1', name: 'VDA_1', status: 'Slow', type: 'HDD' },
  { id: 'd2', name: 'SDA_1', status: 'Healthy', type: 'SSD' },
  { id: 'd3', name: 'SDA_3', status: 'Healthy', type: 'SSD' },
];

const bulkActions = [
  { id: 'release', label: 'Release', onAction: () => {} },
  { id: 'blink', label: 'Blink', onAction: () => {} },
];

const height = (element: Element | null) => {
  if (element === null) {
    throw new Error('expected an element to measure');
  }
  return Math.round(element.getBoundingClientRect().height);
};

const top = (element: Element | null) => {
  if (element === null) {
    throw new Error('expected an element to measure');
  }
  return Math.round(element.getBoundingClientRect().top);
};

const toolbarRow = () =>
  document.querySelector('[data-slot="data-grid-toolbar"]');
const tableBody = () => document.querySelector('[data-slot="table-container"]');

/**
 * Fixed-width host: the row's contents are width-dependent, so leaving the width to the
 * runner's window would make these pass or fail by machine.
 */
function renderGrid() {
  const host = document.createElement('div');
  host.style.width = '900px';
  document.body.append(host);
  return render(
    <DataGrid
      columns={columns}
      rows={disks}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      filters={{
        columns: [{ columnId: 'status', label: 'Status' }],
        global: { columnIds: ['name'], placeholder: 'Search' },
      }}
      toolbar={{
        columnFilters: true,
        globalSearch: true,
        bulkActions,
        trailing: <span>3 loaded</span>,
      }}
    />,
    { container: host }
  );
}

describe('PLTFRM-93130 — the table does not move when a selection starts', () => {
  it('PLTFRM-93130: keeps the toolbar row the same height once rows are selected', async () => {
    const user = userEvent.setup();
    renderGrid();

    const idle = height(toolbarRow());
    await user.click(screen.getByLabelText('Select all rows'));

    // The whole ticket, as one number. Both states share a container and a `min-h-10`
    // floor; with `min-h-8` this read 32 against 40.
    expect(height(toolbarRow())).toBe(idle);
  });

  it('PLTFRM-93130: leaves the table where it was across select and clear', async () => {
    const user = userEvent.setup();
    renderGrid();

    const idle = top(tableBody());

    await user.click(screen.getByLabelText('Select all rows'));
    expect(top(tableBody())).toBe(idle);

    // And back: the original defect moved the table down on select and up on clear, so
    // a fix that only balanced the first half would still be reported as jumping.
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(top(tableBody())).toBe(idle);
  });
});
