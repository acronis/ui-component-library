import type { ColumnDef } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
} from '../../data-table';
import { DataGrid } from '../data-grid';

// #94, user-reported: the pager reported **"0 of 4 row(s) selected."** over a grid
// with everything selected.
//
// ── THE MECHANISM ────────────────────────────────────────────────────────────
// `server.selection` in `all-results` mode means "everything the query matches
// except `excludedIds`", and the engine's `rowSelection` slice is **deliberately
// never written** in that mode — the controlled token stays authoritative and
// nothing is committed internally (`data-grid-config/selection.tsx`). The pager
// asked `getFilteredSelectedRowModel()`, which counts per-row selection, so the
// numerator was 0 however much was selected. Nothing was broken; the pager was
// asking a question the mode does not answer.
//
// ── WHY THE COUNT IS RESOLVED BEFORE IT REACHES THE PAGER ────────────────────
// The prop is a `number`, not the `DataGridServerSelection` union, so the pager
// never learns that `all-results` counts by exclusion while `explicit` counts by
// enumeration. `pagination.tsx`'s `chrome` resolves it from
// `resolved.server.selection` — the *effective* token, which is `undefined` when an
// `all-results` token is scoped to a stale `queryRequestKey`, so a dead token
// cannot be counted as a live selection.

interface Device {
  readonly id: string;
  readonly hostname: string;
}

const devices: Device[] = [
  { id: 'd-1', hostname: 'web-01' },
  { id: 'd-2', hostname: 'web-02' },
  { id: 'd-3', hostname: 'db-01' },
  { id: 'd-4', hostname: 'db-02' },
];

const columns: ColumnDef<Device, unknown>[] = [
  { accessorKey: 'hostname', header: 'Host' },
];

const TOTAL = 4821;

const query = () =>
  createDataTableQuery(
    createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize: 10 } })
  );

/**
 * The pager's own label, read from **the label element**, not from
 * `document.body.textContent`.
 *
 * Scoped deliberately: over the whole body the numerator's `\d+` runs backwards
 * into the row data and glues onto it — `db-02` immediately precedes the count, so
 * a body-wide match returned `024821` for a numerator of `4821`. The label element's
 * own `textContent` has nothing before it to absorb.
 */
function selectionLabel(): {
  readonly selected: string;
  readonly total: string;
} {
  const label = [...document.querySelectorAll('div')]
    .map((node) => node.textContent ?? '')
    .find((text) => /^\d+ of \d+ row\(s\) selected\.$/.test(text));
  if (label === undefined) {
    throw new Error('no pager selection label rendered');
  }
  const [, selected, total] = /^(\d+) of (\d+)/.exec(label)!;
  return { selected: selected!, total: total! };
}

/**
 * Only the numerator. **The denominator is a separate defect and a separate
 * commit** — `getFilteredRowModel().rows.length` is the *loaded* row set, so under
 * server pagination the "of N" reports one window rather than the total. Asserting
 * it here would make this commit's test fail for a reason this commit did not cause,
 * and would then have to be "updated" by the next one, which is how a moved
 * goalpost looks in a diff.
 */
const selectedCountText = () => selectionLabel().selected;

// ── The denominator, a separate defect in the same sentence ──────────────────
// `getFilteredRowModel().rows.length` is the **loaded** row set, so under server
// pagination the pager announced one window as the whole result set. It is
// self-proving: measured, a grid with `server.rowCount: 4821` and a 4-row window
// rendered "0 of 4 row(s) selected." while its own page counter rendered "Page 1 of
// 483". Two numbers in one component describing the same total, and the component
// already held the right one.
describe('#94 — the pager’s total', () => {
  it('reports the owner’s total, not the loaded window', () => {
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        server={{ query: query(), rowCount: TOTAL, onQueryChange: () => {} }}
      />
    );

    // Was '4' — the loaded window, announced as the result set.
    expect(selectionLabel().total).toBe('4821');
  });

  it('leaves a client grid on its own row count', () => {
    // Blast radius. `getRowCount()` falls back to the pre-pagination row model when
    // the owner supplies no `rowCount`, which is the same number the row model gave
    // — so every client-side pager label is unchanged, and that is what keeps the
    // 16 unaffected pager baselines safe.
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple' }}
      />
    );

    expect(selectionLabel().total).toBe('4');
  });

  it('reads correctly as a whole sentence with the numerator', () => {
    // The pair, now that both halves are fixed — and the only place the two commits
    // are checked together. This is the label the user will actually read over a
    // fully-selected server grid.
    const q = query();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query: q,
          rowCount: TOTAL,
          selection: {
            mode: 'all-results',
            queryRequestKey: q.requestKey,
            excludedIds: new Set(['d-2']),
            token: 'srv-token',
          },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    const { selected, total } = selectionLabel();
    expect(`${selected} of ${total}`).toBe('4820 of 4821');
  });
});

describe('#94 — the pager’s selected count under a server selection', () => {
  it('counts all results minus exclusions, not the loaded rows', () => {
    // The reported defect. Everything selected, nothing excluded.
    const q = query();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query: q,
          rowCount: TOTAL,
          selection: {
            mode: 'all-results',
            queryRequestKey: q.requestKey,
            excludedIds: new Set(),
            token: 'srv-token',
          },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    // Was 0 — a numerator the mode cannot produce.
    expect(selectedCountText()).toBe('4821');
  });

  it('subtracts each exclusion', () => {
    // Discriminates "counts the total" from "counts by exclusion". A fix that
    // simply printed `getRowCount()` twice would pass the case above and fail here.
    const q = query();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query: q,
          rowCount: TOTAL,
          selection: {
            mode: 'all-results',
            queryRequestKey: q.requestKey,
            excludedIds: new Set(['d-2', 'd-3']),
            token: 'srv-token',
          },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    expect(selectedCountText()).toBe('4819');
  });

  it('ignores an all-results token scoped to a different query', () => {
    // The staleness guard, and it is the reason the count is resolved from
    // `resolved.server.selection` rather than `server.selection`. A token issued
    // for another `queryRequestKey` is not a selection of *this* query, so
    // `server.ts` resolves it away and the pager must fall back to the engine —
    // which here means 0, honestly, rather than 4821 attributed to the wrong query.
    const q = query();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query: q,
          rowCount: TOTAL,
          selection: {
            mode: 'all-results',
            queryRequestKey: 'issued-for-some-other-query',
            excludedIds: new Set(),
            token: 'srv-token',
          },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    expect(selectedCountText()).toBe('0');
  });

  it('counts the owner’s enumerated ids in explicit mode', () => {
    // Including ids the loaded window does not contain — `d-9` is not in `devices`,
    // so the engine cannot see it and would report 2.
    const q = query();
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple' }}
        server={{
          query: q,
          rowCount: TOTAL,
          selection: { mode: 'explicit', ids: new Set(['d-1', 'd-3', 'd-9']) },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
      />
    );

    expect(selectedCountText()).toBe('3');
  });

  it('leaves a client grid on the engine’s own count', () => {
    // The blast-radius guard. With no controlled server selection the engine owns
    // selection outright, the prop is omitted rather than passed as 0, and the label
    // is byte-for-byte what it always was — which is what keeps every unchanged
    // pager baseline safe.
    render(
      <DataGrid
        columns={columns}
        rows={devices}
        getRowId={(row) => row.id}
        pagination
        selection={{ mode: 'multiple' }}
      />
    );

    expect(selectedCountText()).toBe('0');
  });
});
