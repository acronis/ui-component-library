import type { ColumnDef } from '@tanstack/react-table';
import { ButtonIcon, DataTable } from '@constructor-lab/ui-react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { type Invoice, invoiceColumns, invoices } from './table-rows';

// Row expansion: `getRowCanExpand` marks which rows have detail and
// `renderExpandedRow` renders the disclosed content in a full-width row beneath
// the parent. A leading expander column toggles it via TanStack's row API — the
// "expanded" behavior from the table parity spec.
const columns: ColumnDef<Invoice>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <ButtonIcon
          variant="ghost"
          aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </ButtonIcon>
      ) : null,
  },
  ...invoiceColumns,
];

export function DataTableExpandableRows() {
  return (
    <DataTable
      columns={columns}
      data={invoices}
      getRowCanExpand={() => true}
      renderExpandedRow={(row) => (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          {row.original.note}
        </div>
      )}
    />
  );
}
