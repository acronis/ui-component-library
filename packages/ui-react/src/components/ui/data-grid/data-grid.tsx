import { type ReactNode, useMemo, useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Checkbox } from '../checkbox';
import { DataTablePagination, DataTableToolbar } from '../data-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Phase 1).
//
// DataGrid is the batteries-included, config-driven composite the proposal calls
// for: `<DataGrid columns={…} rows={…} />`. Where the `Table` primitive is
// maximally compositional and `DataTable` renders just the grid (leaving toolbar
// and pagination as detached parts the consumer must wire), DataGrid owns its own
// TanStack instance and assembles the *whole* approved layout — toolbar (search +
// column visibility), the grid, an optional selection column, loading/empty
// states, and pagination — so every grid in the app reads the same way.
//
// Flexibility lives one layer down: DataGrid is built on the `Table` primitive and
// the `DataTable*` parts, so anything it can't express drops down to those.

export interface DataGridProps<TData, TValue> {
  /** TanStack column definitions (the same `ColumnDef[]` DataTable accepts). */
  columns: ColumnDef<TData, TValue>[];
  /** Row data. */
  rows: TData[];
  /**
   * Data state. `loaded` (default) renders the rows; `loading` renders skeleton
   * rows; `empty` forces the empty message. When `loaded` but `rows` is empty,
   * the empty message shows anyway.
   */
  state?: 'loading' | 'empty' | 'loaded';
  /** Prepend a selection checkbox column and enable row selection. */
  selectable?: boolean;
  /** Render the built-in toolbar (search + column visibility). */
  toolbar?: boolean;
  /** Column id the toolbar search box filters (client-side). Implies `toolbar`. */
  searchKey?: string;
  searchPlaceholder?: string;
  /** Render the built-in pagination footer. */
  pagination?: boolean;
  /** Initial page size when `pagination` is set. */
  pageSize?: number;
  /** Page-size options offered in the pagination footer. */
  pageSizeOptions?: number[];
  /** Called with the row's original data when a body row is clicked. */
  onRowClick?: (row: TData) => void;
  /** Message shown in the empty state. */
  emptyMessage?: ReactNode;
  /** Number of skeleton rows rendered while `state="loading"`. */
  skeletonRows?: number;
  /** Alternating row backgrounds. */
  striped?: boolean;
}

export function DataGrid<TData, TValue>({
  columns,
  rows,
  state = 'loaded',
  selectable = false,
  toolbar = false,
  searchKey,
  searchPlaceholder,
  pagination = false,
  pageSize = 10,
  pageSizeOptions,
  onRowClick,
  emptyMessage = 'No results.',
  skeletonRows = 5,
  striped = false,
}: DataGridProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Prepend a selection column when `selectable`; memoized so the identity is
  // stable across renders (TanStack re-derives on a new columns array).
  const resolvedColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!selectable) return columns;
    const selectionColumn = {
      id: '__select__',
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(Boolean(checked))
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
        />
      ),
    } satisfies ColumnDef<TData, TValue>;
    return [selectionColumn, ...columns];
  }, [columns, selectable]);

  const options: TableOptions<TData> = {
    data: rows,
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: selectable,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  };
  if (pagination) {
    options.getPaginationRowModel = getPaginationRowModel();
    options.initialState = { pagination: { pageIndex: 0, pageSize } };
  }

  const table = useReactTable(options);

  const isLoading = state === 'loading';
  const isEmpty = !isLoading && (state === 'empty' || rows.length === 0);
  const bodyRows = table.getRowModel().rows;
  const colSpan = resolvedColumns.length;

  return (
    <div className="flex flex-col gap-4">
      {(toolbar || searchKey) && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
        />
      )}

      <div className="rounded-md border border-[var(--ui-table-global-row-border-color)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow
                  // eslint-disable-next-line @eslint-react/no-array-index-key -- skeleton placeholders have no data identity; position is the only key
                  key={`skeleton-${rowIndex}`}
                  className="hover:bg-transparent"
                >
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      <div className="h-4 w-full animate-pulse rounded bg-[var(--ui-background-surface-secondary)]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={colSpan}
                  className="h-24 text-center text-[var(--ui-table-data-value-color-disabled)]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              bodyRows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  selected={row.getIsSelected()}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    striped &&
                      rowIndex % 2 === 1 &&
                      !row.getIsSelected() &&
                      'bg-[var(--ui-background-surface-secondary)]'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}
