import { DataGrid } from '@constructor-lab/ui-react';
import { deviceColumns, devices } from './grid-data';

// DataGrid owns its data-state UI, configured through the `dataState` group — a
// discriminated union on `status`, so each state carries only what it needs.
// `status: 'loading'` renders skeleton rows; `status: 'empty'` (or an empty `rows`
// array) renders the empty message. Both are shown here for comparison.
export function DataGridStates() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">Loading</p>
        <DataGrid
          columns={deviceColumns}
          rows={devices}
          dataState={{ status: 'loading', skeletonRows: 4 }}
        />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Empty</p>
        <DataGrid
          columns={deviceColumns}
          rows={[]}
          dataState={{
            status: 'empty',
            empty: 'No devices match your filters.',
          }}
        />
      </div>
    </div>
  );
}
