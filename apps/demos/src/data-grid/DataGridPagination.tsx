import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// The `pagination` group renders the footer with page controls and a page-size
// selector. `pageSize` sets the initial page size; `pageSizeOptions` the offered
// sizes.
export function DataGridPagination() {
  return (
    <DataGrid
      columns={deviceColumns}
      rows={devices}
      pagination={{ pageSize: 5, pageSizeOptions: [5, 10, 25] }}
    />
  );
}
