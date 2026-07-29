import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { useDataTable } from '../data-table-controller';
import type { DataTableFooterConfig } from '../data-table-features/footer';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

// Whole-table footer summaries (U5). The footer is a `kind: 'footer'` display row
// the feature emits from `tableDisplayRows`; the view routes it into
// `<TableFooter>` rather than `<TableBody>`, so it is never a record row.
//
// **DataTable renders no formatted summary** (design §4.3) — these stories show
// the raw model. The labelled, locale-formatted presentation is DataGrid's half.

interface Sale {
  id: string;
  region: string;
  rep: string;
  amount: number;
}

const sales: Sale[] = [
  { id: 's1', region: 'EMEA', rep: 'Ada', amount: 412_000 },
  { id: 's2', region: 'EMEA', rep: 'Grace', amount: 96_500 },
  { id: 's3', region: 'APAC', rep: 'Hedy', amount: 210_750 },
  { id: 's4', region: 'AMER', rep: 'Katherine', amount: 780_000 },
  { id: 's5', region: 'AMER', rep: 'Radia', amount: 54_250 },
  { id: 's6', region: 'APAC', rep: 'Barbara', amount: 133_000 },
];

const columns: ColumnDef<Sale, unknown>[] = [
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'rep', header: 'Representative' },
  { accessorKey: 'amount', header: 'Amount' },
];

function FooterView({
  footer,
  stickyFooter,
  paginate,
}: {
  footer: false | DataTableFooterConfig<Sale>;
  stickyFooter?: boolean;
  paginate?: boolean;
}) {
  const controller = useDataTable({
    columns,
    data: sales,
    getRowId: (row) => row.id,
    footer,
    ...(paginate
      ? {
          pagination: true,
          defaultState: { pagination: { pageIndex: 0, pageSize: 3 } },
        }
      : {}),
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Sale>
        maxHeight={260}
        {...(stickyFooter === undefined ? {} : { stickyFooter })}
      />
    </DataTableRoot>
  );
}

const meta = {
  title: 'Components/DataTable/Footer summaries',
  component: FooterView,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FooterView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One summarized column; the others contribute empty cells so nothing shifts. */
export const Sum: Story = {
  args: { footer: { summaries: [{ columnId: 'amount', aggregate: 'sum' }] } },
};

/** Several columns at once, each with its own aggregation. */
export const MixedAggregations: Story = {
  args: {
    footer: {
      summaries: [
        { columnId: 'region', aggregate: 'countDistinct' },
        { columnId: 'rep', aggregate: 'count' },
        { columnId: 'amount', aggregate: 'avg' },
      ],
    },
  },
};

/**
 * The default scope is the grand total across the query, not the visible page —
 * three rows render and the footer still totals all six.
 */
export const GrandTotalWhilePaginated: Story = {
  args: {
    paginate: true,
    footer: { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
  },
};

/** The same table scoped to the page, for contrast. */
export const PageScopedWhilePaginated: Story = {
  args: {
    paginate: true,
    footer: {
      summaries: [{ columnId: 'amount', aggregate: 'sum', scope: 'page' }],
    },
  },
};

/** A reducer for anything the named aggregations cannot express. */
export const CustomReducer: Story = {
  args: {
    footer: {
      summaries: [
        {
          columnId: 'region',
          aggregate: (rows) =>
            `${new Set(rows.map((row) => row.region)).size} regions`,
        },
        { columnId: 'amount', aggregate: 'max' },
      ],
    },
  },
};

/** A renderer owning the whole row, reading the values the model computed. */
export const CustomRenderer: Story = {
  args: {
    footer: {
      summaries: [{ columnId: 'amount', aggregate: 'sum' }],
      render: (context) => (
        <td
          colSpan={context.visibleColumnCount}
          className="text-end font-semibold"
        >
          {`${context.rows.length} deals — ${String(context.summaryFor('amount')?.value ?? 0)}`}
        </td>
      ),
    },
  },
};

/**
 * Pinned to the bottom of the bounded scroll container. `stickyFooter` is the
 * view's route to `TableFooter`, because the feature renders the row *inside* the
 * section and cannot reach the section element.
 */
export const StickyFooter: Story = {
  args: {
    stickyFooter: true,
    footer: { summaries: [{ columnId: 'amount', aggregate: 'sum' }] },
  },
};

/** No footer at all — `<tfoot>` is absent rather than empty. */
export const Disabled: Story = { args: { footer: false } };
