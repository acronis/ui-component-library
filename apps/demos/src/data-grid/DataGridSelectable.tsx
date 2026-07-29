import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// `selectable` prepends the selection column: a header "select all" checkbox
// (with an indeterminate partial state) and a per-row checkbox, matching the
// "Table with Checkbox" frame. Selected rows carry the active-row token.
export function DataGridSelectable() {
  return <DataGrid columns={deviceColumns} rows={devices} selectable />;
}
