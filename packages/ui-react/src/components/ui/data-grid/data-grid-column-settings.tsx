import type { Column, Table } from '@tanstack/react-table';
import { CogIcon } from '@constructor-lab/icons-react/stroke-mono';

import { Button } from '../button';
import { columnAnnouncerFor } from './data-grid-column-announcer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';

// OWNERSHIP: **U3.** Private DataGrid chrome (design §4.3, "Column settings"),
// alongside `data-grid-toolbar.tsx` and `data-grid-actions.tsx`.
//
// This replaces `DataTableViewOptions` in DataGrid's toolbar. That component is a
// `DataTable*` product-chrome component, which design §1 lists among the things
// the library does not publish and §4.3 places on the DataGrid side — so moving
// the control here is a correction of the layer, not a rename. It stays exported
// for external callers and DataGrid no longer consumes it, the same treatment the
// rest of the frozen companion suite has.
//
// It is also strictly more than the control it replaces: visibility **plus**
// pinning and a reset, which is why `columnsFeatures` gates each section rather
// than the menu rendering a fixed list.
//
// Announcements live here, not in the primitive: design §4.3 puts live-region
// rendering and focus management on the DataGrid side, and `Table` presents only
// what it is handed.

export interface DataGridColumnSettingsProps<TData> {
  readonly table: Table<TData>;
  /** Offer show/hide per column. `columnsFeatures.visibility`. */
  readonly visibility?: boolean;
  /** Offer pin-to-start / pin-to-end / unpin. `columnsFeatures.pinning`. */
  readonly pinning?: boolean;
  /** Columns that may not be pinned — the resolved `lockSystemColumns` ids. */
  readonly lockedColumnIds?: readonly string[];
}

/**
 * Columns a person can meaningfully act on: real data columns, not the system
 * ones DataGrid splices in. `accessorFn` is the discriminator TanStack gives us —
 * a display-only column has none.
 */
function settableColumns<TData>(
  table: Table<TData>,
  lockedColumnIds: readonly string[]
): Column<TData, unknown>[] {
  return table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== 'undefined' &&
        !lockedColumnIds.includes(column.id)
    );
}

export function DataGridColumnSettings<TData>({
  table,
  visibility = true,
  pinning = false,
  lockedColumnIds = [],
}: DataGridColumnSettingsProps<TData>) {
  // The grid's one column live region, resolved from the engine instance rather
  // than threaded down as a prop. The menu and the per-column header controls sit
  // in different subtrees and both have to reach the same region; see
  // `data-grid-column-announcer.tsx` for why every prop route fails.
  const { announce } = columnAnnouncerFor(table);
  const columns = settableColumns(table, lockedColumnIds);
  const pinnedCount = columns.filter((column) => column.getIsPinned()).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="secondary"
            className="ms-auto hidden h-8 gap-2 lg:flex"
          />
        }
      >
        <CogIcon />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {visibility && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(next) => {
                    column.toggleVisibility(!!next);
                    announce(
                      `${column.id} column ${next ? 'shown' : 'hidden'}`
                    );
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuGroup>
        )}

        {pinning && (
          <DropdownMenuGroup>
            {visibility && <DropdownMenuSeparator />}
            <DropdownMenuLabel>Pin columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns
              .filter((column) => column.getCanPin())
              .map((column) => {
                const pinned = column.getIsPinned();
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={pinned === 'left'}
                    onCheckedChange={(next) => {
                      // `'left'` is not a mismatch to tidy up. TanStack's pin
                      // API is **physical**, so start-pinning is `left` even in a
                      // right-to-left locale where the column appears on the
                      // right. The announcement below says "start" because that
                      // is what a person perceives; the call says `left` because
                      // that is what the engine means. Making the two agree would
                      // break one of them.
                      column.pin(next ? 'left' : false);
                      announce(
                        `${column.id} column ${next ? 'pinned to start' : 'unpinned'}`
                      );
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuGroup>
        )}

        {pinnedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.resetColumnPinning();
                announce('All columns unpinned');
              }}
            >
              Unpin all
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
