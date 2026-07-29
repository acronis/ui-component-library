import type { ColumnDef } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTablePagination } from '../data-table-pagination';
import { useDataTable } from '../data-table-controller';

// #94, DataTable half. `data-grid-pagination.tsx` carried this expression before it
// was copied into the grid's own pager, and the task asked for both or a reason.
//
// FIXED HERE: the denominator. `getFilteredRowModel().rows.length` is the **loaded**
// row set, and `manualPagination` + `rowCount` are supported controller options
// (`data-table-controller.ts:173`/`:177`), so a DataTable paginating server-side
// announced one window as the whole result set. Reachable through public API — this
// component is exported from the package index.
//
// NOT FIXED HERE: the numerator. The grid's `selectedCount` prop exists because a
// *server selection token* leaves the engine's `rowSelection` slice unwritten, and
// DataTable has no server-selection path — `data-table-engine-options.ts` rejects the
// options that would create one, so there is nothing to produce the prop.

interface Payment {
  readonly id: string;
  readonly email: string;
}

const rows: Payment[] = [
  { id: 'p-1', email: 'a@example.com' },
  { id: 'p-2', email: 'b@example.com' },
  { id: 'p-3', email: 'c@example.com' },
  { id: 'p-4', email: 'd@example.com' },
];

const columns: ColumnDef<Payment, unknown>[] = [
  { accessorKey: 'email', header: 'Email' },
];

/**
 * The label element's own `textContent`, not the body's.
 *
 * The grid's equivalent test records why: over the whole body a `\d+` numerator runs
 * backwards into the row data and glues onto it. The label element has nothing before
 * it to absorb.
 */
function selectionLabel(): string {
  const label = [...document.querySelectorAll('div')]
    .map((node) => node.textContent ?? '')
    .find((text) => /^\d+ of \d+ row\(s\) selected\.$/.test(text));
  if (label === undefined) {
    throw new Error('no pager selection label rendered');
  }
  return label;
}

function Server({ rowCount }: { rowCount?: number }) {
  const controller = useDataTable<Payment>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    manualPagination: true,
    defaultState: { pagination: { pageIndex: 0, pageSize: 10 } },
    ...(rowCount === undefined ? {} : { rowCount }),
  });
  return <DataTablePagination table={controller.table} />;
}

function Client() {
  const controller = useDataTable<Payment>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    pagination: true,
  });
  return <DataTablePagination table={controller.table} />;
}

describe('#94 — DataTablePagination’s total', () => {
  it('reports the owner’s total under manual pagination, not the loaded window', () => {
    render(<Server rowCount={4821} />);
    // Was '4' — the four loaded rows, announced as the result set.
    expect(selectionLabel()).toBe('0 of 4821 row(s) selected.');
  });

  it('leaves a client table on its own row count', () => {
    // Blast radius, and the reason `data-table--toolbar` is baseline-neutral: with no
    // `rowCount` the fallback is the pre-pagination row model, which is the same
    // number the filtered row model gave.
    render(<Client />);
    expect(selectionLabel()).toBe('0 of 4 row(s) selected.');
  });

  it('falls back honestly when manual pagination supplies no total', () => {
    // The discriminator against "always print rowCount": with the option absent
    // `getRowCount()` must not become `undefined` or `NaN` in the sentence.
    render(<Server />);
    expect(selectionLabel()).toBe('0 of 4 row(s) selected.');
  });
});
