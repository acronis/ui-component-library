import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// The assembled "Toolbar + Table with Checkbox" layout: the built-in toolbar
// provides a search box (filtering `searchKey` client-side) and a column
// visibility menu, above a selectable grid.
export function DataGridWithToolbar() {
  return (
    <DataGrid
      columns={deviceColumns}
      rows={devices}
      selectable
      toolbar
      searchKey="name"
      searchPlaceholder="Filter by name…"
    />
  );
}
