import type { ReactNode } from 'react';
import type { Row, Table } from '@tanstack/react-table';

import { TableCell, TableRow } from '../../table';
import type { SerializableValue } from '../data-table-contract';
import { defineDataTableFeature } from './registry';

// The `footer` feature — whole-table summaries (U5).
//
// The layer split follows design §4.3: **DataTable owns the summary model and the
// footer render context; DataGrid owns the formatted presentation.** So this file
// computes values and renders cells aligned to the visible columns, and renders
// nothing formatted — no currency, no locale, no Tooltip. A DataGrid-side
// renderer arrives through the config's `render`.
//
// The row itself is a `kind: 'footer'` display row emitted from
// `tableDisplayRows`, because a table-scoped footer hangs off no record row. The
// view routes that kind into `<TableFooter>` rather than `<TableBody>`, and
// `sticky` reaches the section through the `stickyFooter` view prop — a footer
// feature renders the `<TableRow>` *inside* the section and can never reach the
// section element itself.
//
// **Group-scoped footers are out of scope.** The design does not address them.
// The display-row kind carries `scope: 'table' | 'group'` so the shape need not
// change later, but this feature emits only `'table'`. Escalate rather than
// invent the group case, even after U4 lands.

/** Named aggregations. Serializable, so a server can compute them instead. */
export type DataTableSummaryAggregate =
  'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct';

/**
 * Which rows feed a summary.
 *
 * `'filtered'` is every row after filtering, sorting and tree expansion but
 * **before** the page slice — the grand total. `'page'` is the current page only.
 * Defaults to `'filtered'`, because a footer under a paginated table almost
 * always means the total across the query rather than across the visible page.
 *
 * A tree's visible descendants appear in `'filtered'` exactly as the row model
 * holds them, so a `sum` over a parent-and-children column double-counts by
 * construction. Leaves-only aggregation is not addressed by the design;
 * escalate rather than inventing it here.
 */
export type DataTableSummaryScope = 'filtered' | 'page';

export interface DataTableSummaryDefinition<TData> {
  readonly columnId: string;
  /**
   * A named aggregation, or a reducer for anything the named set cannot express.
   * The named form is serializable; the reducer is the escape hatch and is not.
   */
  readonly aggregate:
    DataTableSummaryAggregate | ((rows: readonly TData[]) => SerializableValue);
  readonly scope?: DataTableSummaryScope;
}

/** One computed summary, as the render context exposes it. */
export interface DataTableSummaryValue {
  readonly columnId: string;
  readonly value: SerializableValue;
  /** `'custom'` for a reducer, so a formatter can tell them apart. */
  readonly aggregate: DataTableSummaryAggregate | 'custom';
  readonly scope: DataTableSummaryScope;
  /** How many rows the aggregation actually saw. */
  readonly rowCount: number;
}

/**
 * The footer render context (`behavior.md` — "footer context exposes summary
 * values and commands"). Values and metadata only; never a formatted control.
 */
export interface DataTableFooterContext<TData> {
  readonly summaries: readonly DataTableSummaryValue[];
  /** The summary for one column, or `undefined` when it has none. */
  summaryFor(columnId: string): DataTableSummaryValue | undefined;
  /** The rows behind `scope: 'filtered'` — the grand-total set. */
  readonly rows: readonly TData[];
  /** The current page's rows, for a `'page'`-scoped renderer. */
  readonly pageRows: readonly TData[];
  readonly visibleColumnIds: readonly string[];
  readonly visibleColumnCount: number;
}

/**
 * Footer behavior at the DataTable layer.
 *
 * **`summaries` and `render` are deliberately NOT mutually exclusive here**, even
 * though design §5.2 says they are. §5.2 describes the *DataGrid* grouped API,
 * and that is the layer the XOR belongs to: a caller picks either the standard
 * formatted summary presentation or their own renderer.
 *
 * Underneath, DataGrid composes both — it takes the caller's `summaries` as the
 * model and supplies its *own* `render` to format them. If this layer enforced
 * the XOR, `DataTableFooterContext.summaries` could never be non-empty for a
 * renderer, because declaring summaries would forbid the renderer that reads
 * them. The field would be permanently hollow and the "footer context exposes
 * summary values" scenario unsatisfiable.
 *
 * So: `summaries` defines the model, `render` decides the presentation, and
 * `data-grid-config/footer.ts` enforces the caller-facing XOR.
 *
 * `sticky` is presentation and reaches `<TableFooter>` through the view's
 * `stickyFooter` prop — DataGrid maps it; a direct DataTable composition sets
 * `stickyFooter` on `DataTableView` itself.
 */
export interface DataTableFooterConfig<TData> {
  readonly summaries?: readonly DataTableSummaryDefinition<TData>[];
  /**
   * Renders the footer's cells from the typed context. Omitted, the feature
   * renders one cell per visible column carrying the raw summary value.
   *
   * Design §5.2 writes this as `(rows) => Content`. It takes the whole context
   * here instead, which is a superset — `context.rows` is that same argument —
   * because a renderer that had only the rows would have to re-aggregate what the
   * model already computed.
   */
  readonly render?: (context: DataTableFooterContext<TData>) => ReactNode;
  readonly sticky?: boolean;
}

function numericValues<TData>(
  rows: readonly Row<TData>[],
  columnId: string
): number[] {
  const numbers: number[] = [];

  for (const row of rows) {
    const value = row.getValue(columnId);
    const numeric =
      typeof value === 'number'
        ? value
        : typeof value === 'string' && value.trim() !== ''
          ? Number(value)
          : Number.NaN;

    if (!Number.isNaN(numeric)) {
      numbers.push(numeric);
    }
  }

  return numbers;
}

/**
 * Applies one named aggregation. Every one returns `undefined` rather than 0 for
 * an empty input, so "no rows" and "sums to zero" stay distinguishable — a footer
 * that shows 0 for an empty table states something false.
 */
function aggregateNamed<TData>(
  aggregate: DataTableSummaryAggregate,
  rows: readonly Row<TData>[],
  columnId: string
): SerializableValue {
  if (aggregate === 'count') {
    return rows.length;
  }
  if (aggregate === 'countDistinct') {
    return new Set(rows.map((row) => row.getValue(columnId))).size;
  }

  const numbers = numericValues(rows, columnId);
  if (numbers.length === 0) {
    return undefined as unknown as SerializableValue;
  }

  switch (aggregate) {
    case 'sum':
      return numbers.reduce((total, value) => total + value, 0);
    case 'avg':
      return (
        numbers.reduce((total, value) => total + value, 0) / numbers.length
      );
    case 'min':
      return Math.min(...numbers);
    case 'max':
      return Math.max(...numbers);
  }
}

function computeSummaries<TData>(
  definitions: readonly DataTableSummaryDefinition<TData>[],
  table: Table<TData>
): readonly DataTableSummaryValue[] {
  // `getPrePaginationRowModel()` chains back through every optional stage —
  // expanded → sorted → grouped → filtered → core — so it is available whether
  // or not those models are installed, and it always means "before the page
  // slice".
  const filteredRows = table.getPrePaginationRowModel().rows;
  const pageRows = table.getRowModel().rows;

  return definitions.map((definition) => {
    const scope = definition.scope ?? 'filtered';
    const rows = scope === 'page' ? pageRows : filteredRows;

    return {
      columnId: definition.columnId,
      scope,
      rowCount: rows.length,
      ...(typeof definition.aggregate === 'function'
        ? {
            aggregate: 'custom' as const,
            value: definition.aggregate(rows.map((row) => row.original)),
          }
        : {
            aggregate: definition.aggregate,
            value: aggregateNamed(
              definition.aggregate,
              rows,
              definition.columnId
            ),
          }),
    };
  });
}

/** `false`/absent means the feature is off; an empty config still renders a row. */
function resolveConfig<TData>(
  config: unknown
): DataTableFooterConfig<TData> | undefined {
  return config === undefined || config === false
    ? undefined
    : (config as DataTableFooterConfig<TData>);
}

export const footerFeature = defineDataTableFeature({
  id: 'footer',

  // A table-scoped footer row hangs off no record row, which is why this point
  // exists rather than `displayRows`.
  tableDisplayRows(ctx) {
    return resolveConfig(ctx.config) === undefined
      ? []
      : [{ kind: 'footer', scope: 'table' }];
  },

  renderDisplayRow(displayRow, ctx) {
    if (displayRow.kind !== 'footer') {
      return undefined;
    }
    // Only the table scope is emitted here. A group-scoped row would belong to a
    // feature the design has not specified, so it is not silently swallowed.
    if (displayRow.scope !== 'table') {
      return undefined;
    }

    const config = resolveConfig<unknown>(ctx.config);
    // `undefined`, not `null`: with the feature off this module emits no footer
    // row, so a table-scoped row arriving here came from somewhere else and must
    // be passed on rather than silently swallowed.
    if (config === undefined) {
      return undefined;
    }

    const table = ctx.table();
    const definitions = config.summaries ?? [];
    const { render } = config;
    const visibleColumns = table.getVisibleLeafColumns();
    // Computed once. A reducer in `aggregate` is caller code and may be
    // expensive, so it must not run once per lookup.
    const summaries = computeSummaries(definitions, table);
    const byColumn = new Map(
      summaries.map((summary) => [summary.columnId, summary])
    );

    if (render !== undefined) {
      const context: DataTableFooterContext<unknown> = {
        summaries,
        summaryFor: (columnId) => byColumn.get(columnId),
        rows: table.getPrePaginationRowModel().rows.map((row) => row.original),
        pageRows: table.getRowModel().rows.map((row) => row.original),
        visibleColumnIds: visibleColumns.map((column) => column.id),
        visibleColumnCount: visibleColumns.length,
      };

      return <TableRow>{render(context)}</TableRow>;
    }

    // One cell per visible column so the summary lines up with what it summarizes.
    // The value is coerced, never formatted — formatting is DataGrid's (§4.3).
    return (
      <TableRow>
        {visibleColumns.map((column) => {
          const summary = byColumn.get(column.id);

          return (
            <TableCell key={column.id}>
              {summary === undefined || summary.value === undefined
                ? null
                : String(summary.value)}
            </TableCell>
          );
        })}
      </TableRow>
    );
  },
});
