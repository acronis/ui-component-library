import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// The `selection` group prepends the selection column: a header "select all"
// checkbox (with an indeterminate partial state) and a per-row checkbox, matching
// the "Table with Checkbox" frame. Selected rows carry the active-row token.
// Selection is identity-bearing, so `getRowId` is required alongside it — the
// selected ids have to survive a data change.
export function DataGridSelectable() {
  return (
    <DataGrid
      columns={deviceColumns}
      rows={devices}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
    />
  );
}
