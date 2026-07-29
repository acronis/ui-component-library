import { DataTable } from '@constructor-lab/ui-react';
import { invoiceColumns, invoices } from './table-rows';

// `highlightCurrentRow` tracks the row the user last clicked and paints it with
// the active-row token — the "current" record state (distinct from selection)
// from the Figma "Row / Table data" states. Click a row to make it current.
export function DataTableCurrentRow() {
  return (
    <DataTable columns={invoiceColumns} data={invoices} highlightCurrentRow />
  );
}
