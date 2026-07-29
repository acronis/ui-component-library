import type { Table } from '@tanstack/react-table';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { Button } from '../button';
import { DataGridColumnSettings } from './data-grid-column-settings';
import { InputText } from '../input-text';

// Private DataGrid chrome (design §4.3, "Toolbar"): the toolbar row, owned by
// DataGrid like `data-grid-column-filters.tsx` and `data-grid-actions.tsx`.
//
// This exists rather than a `viewOptions` prop on `DataTableToolbar` because that
// component is explicitly frozen — `data-table/index.ts` marks the whole
// `DataTable*` companion suite as one-minor compatibility adapters that move
// behind DataGrid and are removed next major, with "do not add new features
// here". Design §1 says the same: the library does not publish a
// batteries-included companion suite. So `toolbar.viewOptions` belongs here.
//
// The markup mirrors `DataTableToolbar`'s except in one deliberate place: the
// column control. `DataTableViewOptions` was a visibility-only menu living in
// `data-table/`, which design §1 lists among the product chrome the library does
// not publish and §4.3 places on the DataGrid side. It is replaced here by
// `DataGridColumnSettings`, which adds pinning and a reset and is gated by
// `columnsFeatures` (U3). The old component stays exported for external callers
// and DataGrid no longer consumes it — the same treatment as the rest of the
// frozen companion suite. Design §5.2's `leading`/`trailing` toolbar members
// extend this file.

interface DataGridToolbarProps<TData> {
  readonly table: Table<TData>;
  /**
   * Show the search box. It drives the engine's **global** filter, not a single
   * column's — which is what makes `filters.global.columnIds` work: the engine
   * ORs the query across every column it reports as globally filterable, and the
   * `filters` feature restricts that set to the configured ids.
   *
   * Before U7 this took a column id and called `column.setFilterValue`, so a
   * multi-column configuration could never have matched more than one column.
   */
  readonly globalSearch?: boolean;
  readonly searchPlaceholder?: string;
  /** Render the column-settings menu. `toolbar.viewOptions`, default true. */
  readonly viewOptions?: boolean;
  /**
   * Which column-settings sections the menu offers, from `columnsFeatures`.
   * Visibility alone when the group is absent, which is what the control it
   * replaced always did.
   */
  readonly columnSettings?: {
    readonly visibility?: boolean;
    readonly pinning?: boolean;
    readonly lockedColumnIds?: readonly string[];
  };
}

export function DataGridToolbar<TData>({
  table,
  globalSearch = false,
  searchPlaceholder = 'Filter…',
  viewOptions = true,
  columnSettings,
}: DataGridToolbarProps<TData>) {
  const query = (table.getState().globalFilter as string | undefined) ?? '';
  // Reset clears both kinds of filter; before U7 it cleared only column filters,
  // which would have left a global query stranded with no visible control.
  const isFiltered = table.getState().columnFilters.length > 0 || query !== '';

  return (
    // The hook design §7 clause 3's rung 3 resolves by query (U6.md §3) — the row
    // is findable without a prop, a ref chain, or any knowledge of virtualization
    // here. Deliberately NOT `tabIndex={-1}`: when this row has no focusable
    // control the fallback must fall THROUGH to the scroll container, because
    // focusing an empty layout div announces nothing.
    <div
      className="flex items-center justify-between"
      data-slot="data-grid-toolbar"
    >
      <div className="flex flex-1 items-center gap-2">
        {globalSearch && (
          <InputText
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-8 gap-2"
          >
            Reset
            <TimesIcon />
          </Button>
        )}
      </div>
      {viewOptions && (
        <DataGridColumnSettings
          table={table}
          visibility={columnSettings?.visibility ?? true}
          pinning={columnSettings?.pinning ?? false}
          {...(columnSettings?.lockedColumnIds === undefined
            ? {}
            : { lockedColumnIds: columnSettings.lockedColumnIds })}
        />
      )}
    </div>
  );
}
