import { DataTable } from '@constructor-lab/ui-react';
import { invoiceColumns } from './table-rows';

// The loading state: `skeleton` renders shimmering placeholder rows shaped like
// the columns while data loads; `skeletonRows` controls how many.
export function DataTableSkeleton() {
  return (
    <DataTable columns={invoiceColumns} data={[]} skeleton skeletonRows={5} />
  );
}
