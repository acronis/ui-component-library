import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// The minimal DataGrid: just `columns` + `rows`. Sorting is available on every
// column header out of the box; no toolbar, selection, or pagination chrome.
export function DataGridBasic() {
  return <DataGrid columns={deviceColumns} rows={devices} />;
}
