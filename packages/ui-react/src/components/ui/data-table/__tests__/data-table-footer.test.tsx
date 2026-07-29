import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDataTable } from '../data-table-controller';
import type { DataTableFooterConfig } from '../data-table-features/footer';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// U5 — whole-table footer summaries.
//
// `packages/ui-spec/components/data-table/behavior.md` — "Footer and tooltip
// models expose render context": footer context exposes summary values and
// commands, and **DataTable renders no formatted summary**. So these tests assert
// values and cell alignment, never currency/locale formatting — that is DataGrid's
// half (design §4.3).

interface Sale {
  readonly id: string;
  readonly region: string;
  readonly amount: number;
}

const columns: ColumnDef<Sale, unknown>[] = [
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'amount', header: 'Amount' },
];

const sales: Sale[] = [
  { id: 's1', region: 'EMEA', amount: 100 },
  { id: 's2', region: 'EMEA', amount: 250 },
  { id: 's3', region: 'APAC', amount: 50 },
  { id: 's4', region: 'AMER', amount: 400 },
];

function renderFooter(
  footer: false | DataTableFooterConfig<Sale>,
  options: {
    readonly data?: Sale[];
    readonly paginate?: boolean;
    readonly stickyFooter?: boolean;
  } = {}
) {
  function Harness() {
    const controller = useDataTable({
      columns,
      data: options.data ?? sales,
      getRowId: (row) => row.id,
      footer,
      ...(options.paginate
        ? {
            pagination: true,
            defaultState: { pagination: { pageIndex: 0, pageSize: 2 } },
          }
        : {}),
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Sale>
          maxHeight={240}
          {...(options.stickyFooter === undefined
            ? {}
            : { stickyFooter: options.stickyFooter })}
        />
      </DataTableRoot>
    );
  }

  return render(<Harness />);
}

const footerCells = (root: HTMLElement) =>
  [...root.querySelectorAll('tfoot td')].map((cell) => cell.textContent);

describe('DataTable footer — rendering and placement', () => {
  it('renders nothing when the feature is off', () => {
    const { container } = renderFooter(false);

    expect(container.querySelector('tfoot')).toBeNull();
  });

  it('renders the summary row inside <tfoot>, never in the body', () => {
    const { container } = renderFooter({
      summaries: [{ columnId: 'amount', aggregate: 'sum' }],
    });

    expect(container.querySelector('tfoot')).not.toBeNull();
    expect(footerCells(container)).toEqual(['', '800']);
    // The footer is not a record row: nothing walking <tbody> should see it.
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
  });

  it('emits one cell per visible column so the summary lines up', () => {
    const { container } = renderFooter({
      summaries: [{ columnId: 'amount', aggregate: 'sum' }],
    });

    // Two columns, two cells — the summarized column carries the value and the
    // other is empty rather than absent, or the columns would shift.
    expect(container.querySelectorAll('tfoot td')).toHaveLength(2);
  });

  it('follows column visibility rather than the column definitions', () => {
    function Harness() {
      const controller = useDataTable({
        columns,
        data: sales,
        getRowId: (row) => row.id,
        footer: { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
        defaultState: { columnVisibility: { region: false } },
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Sale> />
        </DataTableRoot>
      );
    }

    const { container } = render(<Harness />);
    expect(footerCells(container)).toEqual(['800']);
  });

  it('pins the footer only when the view asks for it', () => {
    const config: DataTableFooterConfig<Sale> = {
      summaries: [{ columnId: 'amount', aggregate: 'sum' }],
    };

    expect(
      renderFooter(config).container.querySelector('tfoot')
    ).not.toHaveAttribute('data-sticky');
    expect(
      renderFooter(config, { stickyFooter: true }).container.querySelector(
        'tfoot'
      )
    ).toHaveAttribute('data-sticky', 'true');
  });
});

describe('DataTable footer — named aggregations', () => {
  it.each([
    ['sum', '800'],
    ['avg', '200'],
    ['min', '50'],
    ['max', '400'],
    ['count', '4'],
  ] as const)('computes %s', (aggregate, expected) => {
    const { container } = renderFooter({
      summaries: [{ columnId: 'amount', aggregate }],
    });

    expect(footerCells(container)[1]).toBe(expected);
  });

  it('counts distinct values, not rows', () => {
    const { container } = renderFooter({
      summaries: [{ columnId: 'region', aggregate: 'countDistinct' }],
    });

    // EMEA appears twice across four rows.
    expect(footerCells(container)[0]).toBe('3');
  });

  it('distinguishes "no rows" from "sums to zero"', () => {
    // An empty table must not claim a total of 0 — that states something false.
    const empty = renderFooter(
      { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
      { data: [] }
    );
    expect(footerCells(empty.container)[1]).toBe('');

    const zeroes = renderFooter(
      { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
      { data: [{ id: 'z', region: 'EMEA', amount: 0 }] }
    );
    expect(footerCells(zeroes.container)[1]).toBe('0');
  });

  it('ignores non-numeric values in a numeric aggregation', () => {
    const { container } = renderFooter({
      summaries: [{ columnId: 'region', aggregate: 'sum' }],
    });

    // No region parses as a number, so there is no total rather than NaN.
    expect(footerCells(container)[0]).toBe('');
  });
});

describe('DataTable footer — scope', () => {
  it('defaults to the grand total across the query, not the page', () => {
    const { container } = renderFooter(
      { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
      { paginate: true }
    );

    // Page size 2 shows 100 + 250; the default scope still totals all four.
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(footerCells(container)[1]).toBe('800');
  });

  it('totals only the current page when scope is "page"', () => {
    const { container } = renderFooter(
      { summaries: [{ columnId: 'amount', aggregate: 'sum', scope: 'page' }] },
      { paginate: true }
    );

    expect(footerCells(container)[1]).toBe('350');
  });
});

describe('DataTable footer — custom reducer and renderer', () => {
  it('passes the records to a reducer, not the engine rows', () => {
    const aggregate = vi.fn(
      (rows: readonly Sale[]) =>
        rows.filter((row) => row.region === 'EMEA').length
    );

    const { container } = renderFooter({
      summaries: [{ columnId: 'region', aggregate }],
    });

    expect(footerCells(container)[0]).toBe('2');
    // The reducer sees TData, so caller code never touches a TanStack row.
    expect(aggregate.mock.calls[0]?.[0]).toEqual(sales);
  });

  it('gives a renderer the summary values it would otherwise recompute', () => {
    renderFooter({
      summaries: [{ columnId: 'amount', aggregate: 'sum' }],
      render: (context) => (
        <td colSpan={context.visibleColumnCount}>
          {`${String(context.summaryFor('amount')?.value ?? 'none')} over ${context.rows.length} rows, ${context.pageRows.length} on this page`}
        </td>
      ),
    });

    expect(
      screen.getByText('800 over 4 rows, 4 on this page')
    ).toBeInTheDocument();
  });

  it('composes summaries WITH a renderer — the model and the presentation', () => {
    // Design §5.2's summaries-XOR-render rule is caller-facing and belongs to
    // DataGrid. At this layer the two compose, which is what DataGrid itself
    // relies on: it takes the caller's summaries as the model and supplies its own
    // renderer to format them. Enforcing the XOR here would make
    // `context.summaries` permanently empty for every renderer.
    const { container } = renderFooter({
      summaries: [{ columnId: 'amount', aggregate: 'max' }],
      render: (context) => (
        <td>{String(context.summaryFor('amount')?.value)}</td>
      ),
    });

    // Scoped to the footer: 400 is also a body value, so an unscoped query would
    // match either and prove nothing.
    expect(footerCells(container)).toEqual(['400']);
  });
});

describe('DataTable footer — render context metadata', () => {
  it('labels a reducer as custom so a formatter can tell them apart', () => {
    let captured: unknown;

    renderFooter({
      summaries: [
        { columnId: 'amount', aggregate: 'sum' },
        { columnId: 'region', aggregate: () => 'x' },
      ],
      render: (context) => {
        captured = context.summaries;
        return <td>ok</td>;
      },
    });

    expect(captured).toEqual([
      {
        columnId: 'amount',
        aggregate: 'sum',
        scope: 'filtered',
        rowCount: 4,
        value: 800,
      },
      {
        columnId: 'region',
        aggregate: 'custom',
        scope: 'filtered',
        rowCount: 4,
        value: 'x',
      },
    ]);
  });

  it('exposes the visible column ids the footer must line up with', () => {
    let captured: readonly string[] | undefined;

    renderFooter({
      render: (context) => {
        captured = context.visibleColumnIds;
        return <td>ok</td>;
      },
    });

    expect(captured).toEqual(['region', 'amount']);
  });
});
