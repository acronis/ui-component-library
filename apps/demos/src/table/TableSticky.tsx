import {
  ScrollArea,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@constructor-lab/ui-react';
import { scrollColumns, scrollRows } from './scroll-data';

// Sticky header + sticky trailing column, from the Figma "Basic table behavior"
// section ("Sticky by default … the rest of columns should be scrolled under
// the last one"). A single `ScrollArea` owns both scroll axes; the header row
// stays pinned to the top during vertical scroll and the actions column stays
// pinned to the end during horizontal scroll. Sticky cells carry their own
// background (so scrolled content passes under them) and layer above the grid
// via z-index — the header/column intersection sits on top of both.

const headerBg = 'bg-background';
const borderColor = 'border-[color:var(--ui-table-global-row-border-color)]';

export function TableSticky() {
  return (
    <ScrollArea
      orientation="both"
      // Keep the overlay scrollbars above the sticky (z-raised) header and
      // actions column so they are never hidden underneath them.
      className="h-[360px] w-full rounded-md border [&_[data-slot=scroll-area-scrollbar]]:z-40"
    >
      <table className="w-full caption-bottom border-separate border-spacing-0 text-sm text-[var(--ui-table-data-value-color-idle)]">
        <TableHeader>
          <TableRow>
            {scrollColumns.map((column) => (
              <TableHead
                key={column.key}
                style={{ minWidth: column.minWidth }}
                className={`sticky top-0 z-20 whitespace-nowrap border-b ${borderColor} ${headerBg}`}
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead
              className={`sticky end-0 top-0 z-30 w-[80px] whitespace-nowrap border-b border-s ${borderColor} ${headerBg} text-center`}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scrollRows.map((row) => (
            <TableRow key={row.id}>
              {scrollColumns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`whitespace-nowrap border-b ${borderColor} ${
                    column.key === 'hostname' ? 'font-medium' : ''
                  }`}
                >
                  {row[column.key]}
                </TableCell>
              ))}
              <TableCell
                className={`sticky end-0 z-10 border-b border-s ${borderColor} ${headerBg} text-center text-[var(--ui-table-header-sort-icon-color-inactive)]`}
              >
                •••
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </ScrollArea>
  );
}
