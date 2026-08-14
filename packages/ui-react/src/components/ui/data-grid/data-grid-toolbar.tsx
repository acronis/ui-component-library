import type { ReactNode } from 'react';
import type { Table } from '@tanstack/react-table';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { Button } from '@constructor-lab/ui-react';
import { InputText } from '@constructor-lab/ui-react';

// Private DataGrid chrome (design §4.3, "Toolbar"): the toolbar row, owned by
// DataGrid like `data-grid-column-filters.tsx` and `data-grid-actions.tsx`.
//
// This exists rather than a `viewOptions` prop on `DataTableToolbar` because that
// component is explicitly frozen — `data-table/index.ts` marks the whole
// `DataTable*` companion suite as one-minor compatibility adapters that move
// behind DataGrid and are removed next major, with "do not add new features
// here". Design §1 says the same: the library does not publish a
// batteries-included companion suite.
//
// ── One row, two states (PLTFRM-93130) ───────────────────────────────────────
//
// The row is **always present at a constant height** and its contents are swapped:
// idle members (filter triggers, search, `leading`, `trailing`) while nothing is
// selected, the bulk-action strip once something is. Before this, the bulk bar was
// a separate row in the `top` chrome slot that mounted on the first selection, so
// selecting a row inserted ~56px above the table and pushed the whole grid down —
// the reported bug. Nothing here mounts or unmounts the row itself, and both states
// are built from `h-8` controls inside a `min-h-8` container, so the height is a
// constant rather than a coincidence.
//
// Two things that used to live here have moved out, and their absence is deliberate:
//
//  - **The column-settings menu.** It is the `⚙` in the header cell of the trailing
//    column now (`data-grid-config/toolbar.tsx`'s `columns` transform), per the
//    design-system table spec. This component takes no `viewOptions` prop at all.
//  - **The applied-filter chips.** They stay in the `under-toolbar` slot; only the
//    filter *triggers* come up here, as the `filters` node.
//
// Design §5.2's `leading`/`trailing` toolbar members are implemented here.

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
  /**
   * The bulk-action strip. **Supplying it is what puts the row in its selected
   * state**: when present it replaces every idle member, when absent the idle
   * members render. The decision of *when* a selection warrants it belongs to the
   * config layer, which owns the count — this component only places it.
   */
  readonly bulk?: ReactNode;
  /** The column-filter trigger controls, from `filters.columns`. */
  readonly filters?: ReactNode;
  /** Caller content at the start of the row, before search. `toolbar.leading`. */
  readonly leading?: ReactNode;
  /**
   * Caller content at the end of the row — a loaded/total count, a primary action.
   * `toolbar.trailing`.
   */
  readonly trailing?: ReactNode;
}

export function DataGridToolbar<TData>({
  table,
  globalSearch = false,
  searchPlaceholder = 'Filter…',
  bulk,
  filters,
  leading,
  trailing,
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
    //
    // `min-h-10` is load-bearing, not spacing: **one floor, shared by both states**,
    // is what makes the swap free of layout change even when a state is empty — a
    // grid whose only toolbar member is `bulkActions` reserves the row while nothing
    // is selected, instead of growing one later.
    //
    // 40 rather than 32 with room to spare, and the history is worth keeping. It was
    // originally *forced*: the `Filter` trigger shipped a literal `h-10` while every
    // other control here is 32px, so a floor of 32 let the row **shrink** by 8px on
    // the first selection — the reported jump, smaller and in the other direction.
    // The trigger now takes its height from the button token like everything else, so
    // the floor is no longer pinned by one outlier; it stays 40 because a 32px
    // control in a 32px row has no breathing room, and because a floor above the
    // strip's own content is what absorbs a caller's `leading`/`trailing` node
    // without moving the table.
    //
    // Both facts were measured in a browser at `Composites/DataGrid/Toolbar`. The
    // unit tests cannot see either — happy-dom has no layout engine — which is why
    // they assert the class contract instead.
    <div
      className="flex min-h-10 items-center justify-between gap-2"
      data-slot="data-grid-toolbar"
    >
      {bulk === undefined ? (
        <>
          {/* `overflow-hidden` on the idle group, and the search box is the member
              allowed to shrink. Without both, a narrow row *overlapped*: the filter
              wrapper is `min-w-0`, its trigger buttons do not shrink, so it
              overflowed its own box and the fixed-width search input was painted on
              top of a trigger. Measured at a 468px row — the `Type` trigger spanned
              126–217 and the input 141–291. Clipping is the honest failure here:
              wrapping would grow the row and move the table, which is the bug this
              row exists to prevent. */}
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            {leading}
            {filters}
            {globalSearch && (
              // The width and the shrink live on **this wrapper**, not on
              // `InputText`. Its `className` reaches the inner `<input>`, while the
              // flex item is a wrapper the primitive renders itself — one carrying
              // `min-width: var(--ui-input-text-global-container-width-min)` (128px).
              // So `w-[150px] shrink` on the component sized the `<input>` and left
              // the flex item rigid: measured, the box stayed 150px wide inside a
              // 128px item and simply overhung it.
              //
              // With the basis here the search box is the member that gives way as
              // the row narrows, down to that 128px token floor; past it the group's
              // `overflow-hidden` clips the search rather than the row growing a
              // second line or the trailing action being pushed out.
              <div className="min-w-0 shrink basis-[150px] lg:basis-[250px]">
                <InputText
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                  }
                  className="h-8 w-full"
                />
              </div>
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
          {trailing !== undefined && (
            <div className="flex shrink-0 items-center gap-2">{trailing}</div>
          )}
        </>
      ) : (
        bulk
      )}
    </div>
  );
}
