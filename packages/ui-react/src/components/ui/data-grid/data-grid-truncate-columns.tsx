import type { ReactNode } from 'react';
import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { TruncatedText } from '../truncated-text';
import type { TruncatedTextProps } from '../truncated-text';

// Deliberately not a `data-grid-config/` module: those are caller-configured
// through a top-level `<DataGrid>` prop (`columnsFeatures`, `filters`, …), and
// this has no such prop — it is driven entirely by each column's own `meta`, the
// same escape hatch `filtering.ts`'s `globalFilterFn` uses. `data-grid.tsx`
// applies it directly, one call after `composeColumns`, rather than through the
// module registry that mechanism exists for.

/** Per-column escape hatch, read from `columnDef.meta`. */
export interface DataGridTruncateColumnMeta {
  /**
   * Truncate this column instead of wrapping or overflowing. `'end'` is the
   * familiar CSS ellipsis. `'middle'` is not yet supported locally (falls back
   * to end truncation). Anything else — omitted, `undefined`, or an
   * unrecognized value from an untyped caller — renders the column exactly as
   * it would with no `truncate` at all.
   *
   * Setting it to `'middle'` or `'end'` does two things, both handled here,
   * neither requiring anything else from the caller — not even importing
   * `TruncatedText`:
   *
   * 1. The column gets an explicit `size`, computed from the table's own
   *    measured width. Not a cosmetic default: without one, this column's width
   *    would come from `table-layout: auto`, which recomputes off whatever rows
   *    virtualization currently has mounted — and the column's own truncated
   *    content would be exactly what that computation measures, a
   *    content-drives-width-drives-content loop that does not reliably settle
   *    under a live resize (confirmed: inconsistent truncation between rows at
   *    rest, the table not adapting to a resize at all, staying stuck until a
   *    hard refresh). An explicit `size` breaks the loop.
   * 2. If the column declares no `cell`, its default (raw accessor value)
   *    rendering is replaced with `<TruncatedText>`. A column that *does*
   *    declare one keeps it, but its `cell` context gains a `truncate`
   *    function — see `DataGridTruncateCellContext` — for wrapping just the
   *    text node it wants truncated, so a caller whose cell renders more than
   *    plain text (an icon button alongside a link, say) never has to import
   *    `TruncatedText` itself.
   */
  readonly truncate?: 'middle' | 'end';
}

/**
 * What a column's own `cell` receives once `meta.truncate` is set — the
 * standard TanStack `CellContext` plus a ready-made truncator. `truncate` is
 * absent (not merely a no-op) on any column without `meta.truncate`, so a
 * `cell` that destructures it should treat it as optional.
 *
 * `TValue` defaults to `unknown` (PLTFRM-93046), matching `DataGridProps` — and it
 * matters more here, because this type exists to be written by hand in a `cell`
 * signature, which is precisely where a consumer reaches for the one-argument
 * spelling.
 */
export interface DataGridTruncateCellContext<
  TData,
  TValue = unknown,
> extends CellContext<TData, TValue> {
  /** Wraps `text` per this column's `meta.truncate` mode. */
  truncate?: (text: string) => ReactNode;
}

// TanStack's own `ColumnMeta<TData, TValue>` is an empty interface, specifically
// so a consumer can widen it via declaration merging — this is that, for this
// field. Without it, `meta: { truncate: 'middle' }` on a real `ColumnDef` fails
// TypeScript's excess-property check against the empty interface — confirmed:
// the failure surfaces as a confusing "not assignable to
// AccessorFnColumnDefBase" error pointing at an unrelated `accessorFn`, because
// `ColumnDef` is a large discriminated union and losing the `accessorKey` variant
// to the excess-property check just falls through to try the next one.
//
// `CellContext` gets the same treatment, for the same reason: a `cell` typed
// against the stock (un-augmented) `CellContext` would reject destructuring
// `truncate` as an excess property, even though `applyTruncateColumns` puts it
// there at runtime.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> extends DataGridTruncateColumnMeta {
    /** Seeds initial column pinning (design §6.9). `'left'`/`'right'` map to TanStack's `'left'`/`'right'` edge. */
    pin?: 'left' | 'right';
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface CellContext<TData, TValue> {
    /** Present only on a column whose `meta.truncate` is set. */
    truncate?: (text: string) => ReactNode;
  }
}

// Not exposed as per-column tuning (yet): the goal is "one prop, no other
// decisions" — a caller who needs a different balance is almost certainly
// better served by an explicit `size` and no `truncate` at all, which already
// works today and always will (design §6.10, explicit sizes win).
const WIDTH_FRACTION = 0.3;
const MIN_SIZE = 160;
const MAX_SIZE = 500;

function truncateColumnSize(tableWidth: number): number {
  if (tableWidth === 0) return MIN_SIZE;
  return Math.min(
    MAX_SIZE,
    Math.max(MIN_SIZE, Math.round(tableWidth * WIDTH_FRACTION))
  );
}

/**
 * Applies every column's `meta.truncate` against the table's own measured
 * width. Pure and independent of the config module registry — see the file
 * header for why — so it takes `tableWidth` as a plain argument rather than
 * through `DataGridColumnContext`.
 */
export function applyTruncateColumns<TData, TValue>(
  columns: readonly ColumnDef<TData, TValue>[],
  tableWidth: number,
  portalContainer: TruncatedTextProps['portalContainer']
): readonly ColumnDef<TData, TValue>[] {
  return columns.map((column) => {
    const meta = column.meta as DataGridTruncateColumnMeta | undefined;
    const truncate = meta?.truncate;
    if (truncate !== 'middle' && truncate !== 'end') return column;

    const renderTruncated = (text: string) => (
      <TruncatedText portalContainer={portalContainer}>{text}</TruncatedText>
    );
    const originalCell = column.cell;

    // `cell` may also be a plain string template (TanStack's `ColumnDefTemplate`)
    // rather than a render function — nothing to inject a `truncate` helper
    // into there, so it's left untouched, same as a column with no `cell` at
    // all would be if this feature weren't in play.
    return {
      ...column,
      size: truncateColumnSize(tableWidth),
      cell:
        typeof originalCell === 'function'
          ? (context: DataGridTruncateCellContext<TData, TValue>) =>
              originalCell({ ...context, truncate: renderTruncated })
          : (originalCell ??
            (({ getValue }: CellContext<TData, TValue>) =>
              renderTruncated(String(getValue() ?? '')))),
    };
  });
}
