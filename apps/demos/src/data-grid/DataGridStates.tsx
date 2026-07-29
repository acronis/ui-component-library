import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// DataGrid owns its data-state UI. `state="loading"` renders skeleton rows;
// `state="empty"` (or an empty `rows` array) renders the empty message. Both
// are shown here for comparison.
export function DataGridStates() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">Loading</p>
        <DataGrid
          columns={deviceColumns}
          rows={devices}
          state="loading"
          skeletonRows={4}
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Empty</p>
        <DataGrid
          columns={deviceColumns}
          rows={[]}
          state="empty"
          emptyMessage="No devices match your filters."
        />
      </div>
    </div>
  );
}
