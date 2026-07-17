import * as React from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { BinIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  Badge,
  type BadgeProps,
  Button,
  Checkbox,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableViewOptions,
  Filter,
  InputText,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';
import { RowActions } from './RowActions';
import type { DataRow } from '../../types';

interface DataTableProps {
  data: DataRow[];
  onEdit: (row: DataRow) => void;
  onDelete: (id: string) => void;
  onView: (row: DataRow) => void;
  onBulkDelete: (ids: string[]) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: DataRow['status'][] = ['active', 'inactive', 'pending'];

const statusVariant: Record<DataRow['status'], BadgeProps['variant']> = {
  active: 'success',
  inactive: 'neutral',
  pending: 'warning',
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// The table view — the `table-view` + `data-table-bulk-actions` +
// `filter-popover` patterns composed over the kit's DataTable sub-parts. We lift
// `useReactTable` here (rather than the self-contained `DataTable` composite)
// because the composite manages sorting/filter/selection/pagination internally
// and exposes no `table` instance — and we need that instance to drive the
// toolbar search, the filter popover, the bulk-delete bar, and pagination off a
// single source of truth.
export function DataTable({
  data,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  isLoading = false,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'name', desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = React.useMemo<ColumnDef<DataRow>[]>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(Boolean(checked))
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('name')}</span>
        ),
        // The search box wires to this column, but the match spans several
        // fields — preserving the original multi-field search behavior.
        filterFn: (row, _columnId, filterValue) => {
          const query = String(filterValue).toLowerCase();
          const r = row.original;
          return (
            r.name.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query) ||
            r.status.toLowerCase().includes(query) ||
            (r.description?.toLowerCase().includes(query) ?? false)
          );
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue<DataRow['status']>('status');
          return (
            <Badge variant={statusVariant[status]} className="capitalize">
              {status}
            </Badge>
          );
        },
        filterFn: (row, columnId, filterValue: string[]) =>
          filterValue.length === 0 ||
          filterValue.includes(row.getValue(columnId)),
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, columnId, filterValue: string[]) =>
          filterValue.length === 0 ||
          filterValue.includes(row.getValue(columnId)),
      },
      {
        accessorKey: 'value',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Value" />
        ),
        cell: ({ row }) => `$${row.getValue<number>('value').toLocaleString()}`,
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {format(row.getValue<Date>('updatedAt'), 'MMM d, yyyy')}
          </span>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <RowActions
            row={row.original}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original.id)}
            onView={() => onView(row.original)}
          />
        ),
      },
    ],
    [onEdit, onDelete, onView]
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, rowSelection, columnVisibility },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoryOptions = React.useMemo(
    () => Array.from(new Set(data.map((row) => row.category))).sort(),
    [data]
  );

  const statusFilter =
    (table.getColumn('status')?.getFilterValue() as string[] | undefined) ?? [];
  const categoryFilter =
    (table.getColumn('category')?.getFilterValue() as string[] | undefined) ??
    [];
  const activeFilterCount = statusFilter.length + categoryFilter.length;

  const toggleFilter = (
    columnId: 'status' | 'category',
    current: string[],
    value: string
  ) => {
    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];
    table.getColumn(columnId)?.setFilterValue(next.length ? next : undefined);
  };

  const clearFilters = () => {
    table.getColumn('status')?.setFilterValue(undefined);
    table.getColumn('category')?.setFilterValue(undefined);
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const handleBulkDelete = () => {
    onBulkDelete(selectedRows.map((row) => row.original.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="rounded-lg border border-border">
          <div className="h-[400px] animate-pulse bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <InputText
            placeholder="Search by name, category, or status..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="h-8 w-full max-w-sm"
          />
          <Popover>
            <PopoverTrigger render={<Filter count={activeFilterCount} />}>
              Filter
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56">
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Status</p>
                  <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                      <Checkbox
                        key={status}
                        label={capitalize(status)}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={() =>
                          toggleFilter('status', statusFilter, status)
                        }
                      />
                    ))}
                  </div>
                </div>
                {categoryOptions.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Category</p>
                    <div className="space-y-2">
                      {categoryOptions.map((category) => (
                        <Checkbox
                          key={category}
                          label={category}
                          checked={categoryFilter.includes(category)}
                          onCheckedChange={() =>
                            toggleFilter('category', categoryFilter, category)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="h-8 w-full"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="h-8 gap-2"
              >
                <BinIcon className="h-4 w-4" />
                Delete selected
              </Button>
            </>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="rounded-md border border-border">
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} selected={row.getIsSelected()}>
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

      <DataTablePagination table={table} pageSizeOptions={[10, 25, 50]} />
    </div>
  );
}
