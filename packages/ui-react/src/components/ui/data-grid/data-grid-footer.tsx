// Imported from the owning feature module rather than the `data-table` barrel:
// the barrel is a manifest file (integrator-only) and these types are staged for
// it, so this import is what keeps the tree compiling in the meantime.
import type { DataTableSummaryValue } from '../data-table/data-table-features/footer';
import { TableCell } from '../table';
import type { DataGridSummaryPresentation } from './data-grid-config/footer';

// DataGrid's half of the footer (design §4.3): **the formatted summary
// presentation.** DataTable computed the values and told us which columns are
// visible; everything here is presentation and nothing here aggregates.
//
// Private DataGrid chrome. Not exported from the package — the design forbids a
// parallel public `DataTable*`/`DataGrid*` companion suite (§4.3), so this is
// named and tested as chrome.

interface PresentationEntry extends DataGridSummaryPresentation {
  readonly columnId: string;
}

interface DataGridFooterRowProps {
  /** The computed model, from the DataTable footer render context. */
  readonly summaries: readonly DataTableSummaryValue[];
  /** Per-column label/format, in the order the caller declared them. */
  readonly presentation: readonly PresentationEntry[];
  /** Visible columns, in render order — what the cells must line up with. */
  readonly visibleColumnIds: readonly string[];
}

/**
 * Formats an aggregate for display.
 *
 * `undefined` renders as an em dash rather than `0` or an empty cell: an empty
 * table has no total, and showing `0` would state something false while showing
 * nothing is indistinguishable from a column that was never summarized.
 *
 * Numbers use the ambient locale via `toLocaleString`, so thousands separators
 * follow the user's locale rather than a hardcoded one. `avg` is capped at two
 * fraction digits — an unrounded mean is nearly always noise in a summary row.
 */
function formatValue(summary: DataTableSummaryValue): string {
  const { value } = summary;

  if (value === undefined || value === null) {
    return '—';
  }
  if (typeof value === 'number') {
    return summary.aggregate === 'avg'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : value.toLocaleString();
  }

  return String(value);
}

/**
 * One `<tr>`'s worth of `<TableCell>`s, one per visible column.
 *
 * A cell per visible column rather than only per summary: the footer has to line
 * up with the body, so an unsummarized column contributes an empty cell instead
 * of shifting everything after it.
 */
export function DataGridFooterRow({
  summaries,
  presentation,
  visibleColumnIds,
}: DataGridFooterRowProps) {
  const byColumn = new Map(
    summaries.map((summary) => [summary.columnId, summary])
  );
  const presentationByColumn = new Map(
    presentation.map((entry) => [entry.columnId, entry])
  );

  return visibleColumnIds.map((columnId) => {
    const summary = byColumn.get(columnId);
    if (summary === undefined) {
      return <TableCell key={columnId} />;
    }

    const entry = presentationByColumn.get(columnId);
    const formatted = (entry?.format ?? formatValue)(summary);

    return (
      <TableCell key={columnId} className="font-semibold">
        {entry?.label === undefined ? (
          formatted
        ) : (
          <>
            <span className="font-normal text-muted-foreground">
              {entry.label}
            </span>{' '}
            {formatted}
          </>
        )}
      </TableCell>
    );
  });
}
