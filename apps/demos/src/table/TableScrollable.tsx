import {
  ScrollArea,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';
import { scrollColumns, scrollRows } from './scroll-data';

// A table that overflows both axes inside a bounded viewport. The `Table`
// primitive's built-in `overflow-auto` wrapper only shows a native (macOS:
// hidden-at-rest) bar, so this demo drives a single `ScrollArea` — its overlay
// scrollbars appear on hover/scroll in both directions — and composes the table
// parts into a raw `<table>` inside it. Give it a fixed height + wide columns
// and 30 rows so both scrollbars are actually exercised.

export function TableScrollable() {
  return (
    <ScrollArea
      orientation="both"
      className="h-[360px] w-full rounded-md border"
    >
      <table className="w-full caption-bottom border-collapse text-sm text-[var(--ui-table-data-value-color-idle)]">
        <TableHeader>
          <TableRow>
            {scrollColumns.map((column) => (
              <TableHead
                key={column.key}
                className="whitespace-nowrap"
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {scrollRows.map((row) => (
            <TableRow key={row.id}>
              {scrollColumns.map((column) => (
                <TableCell
                  key={column.key}
                  className={
                    column.key === 'hostname'
                      ? 'whitespace-nowrap font-medium'
                      : 'whitespace-nowrap'
                  }
                >
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </ScrollArea>
  );
}
