import type { Table } from '@tanstack/react-table';
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { ButtonIcon } from '../button-icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  /** Page-size options offered in the rows-per-page select. */
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* The NUMERATOR is deliberately left on the engine (#94). The defect that
            forced `DataGridPagination`'s `selectedCount` prop is a *server*
            selection token, and DataTable has no server-selection path at all —
            `data-table-engine-options.ts` rejects the options that would create
            one. A prop with no producer is a wider surface guarding nothing; the
            day DataTable gains a controlled selection, this is where it lands.

            The DENOMINATOR is a different story and is fixed here, because it is
            reachable today: `manualPagination` + `rowCount` are supported
            controller options (`data-table-controller.ts`) and this component is a
            public export, so `getFilteredRowModel().rows.length` announced one
            loaded window as the whole result set — the same defect measured on the
            grid, where a 4-row window over `rowCount: 4821` rendered "of 4"
            beside its own "Page 1 of 483". `getRowCount()` is
            `options.rowCount ?? prePaginationRowModel.rows.length`, so it is the
            client total when the owner supplies none. */}
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getRowCount()} row(s) selected.
      </div>
      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger aria-label="Rows per page" className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <ButtonIcon
            variant="secondary"
            aria-label="Go to first page"
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirstIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label="Go to previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label="Go to next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </ButtonIcon>
          <ButtonIcon
            variant="secondary"
            aria-label="Go to last page"
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLastIcon />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
}
