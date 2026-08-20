import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// The assembled "Toolbar + Table with Checkbox" layout: the built-in toolbar
// provides a search box and a column visibility menu, above a selectable grid.
// The toolbar only decides *whether* the search box renders — the columns it
// matches against, and its placeholder, come from `filters.global`.
export function DataGridWithToolbar() {
  return (
    <DataGrid
      columns={deviceColumns}
      rows={devices}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      toolbar={{ globalSearch: true }}
      filters={{
        global: { columnIds: ['name'], placeholder: 'Filter by name…' },
      }}
    />
  );
}
