import { DataTable } from '@constructor-lab/ui-react';
import { invoiceColumns, invoices } from './table-rows';

// Presentational density options: `striped` alternates row backgrounds and
// `bordered` adds vertical dividers between columns (rows always have horizontal
// borders). Both are independent visual flags on the DataTable.
export function DataTableStriped() {
  return (
    <DataTable columns={invoiceColumns} data={invoices} striped bordered />
  );
}
