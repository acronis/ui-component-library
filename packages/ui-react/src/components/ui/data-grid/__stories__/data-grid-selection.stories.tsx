import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '../../button';
import { DataGrid } from '../data-grid';

// The `selection` group's parity members (U9). `data-grid.stories.tsx` covers the
// shipped wiring — the checkbox column, the modes, the bulk bar; these are only
// the members U9 added.
//
// All three are reachable from the grouped `selection` config alone. The
// deprecated `selectable`/`selectionMode` aliases are flat booleans with nowhere
// to carry a policy flag, so there is no alias story to show.

interface Person {
  id: string;
  name: string;
  role: string;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer' },
  { id: '2', name: 'Grace Hopper', role: 'Engineer' },
  { id: '3', name: 'Alan Turing', role: 'Operator' },
  { id: '4', name: 'Katherine Johnson', role: 'Engineer' },
];

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
];

const engineersOnly = (row: Person) => row.role === 'Engineer';

/**
 * Both indeterminate policies side by side. Select one row in each grid to put its
 * header control in the mixed state, then activate that control: the top grid
 * selects every eligible row (the default, matching what already ships), the
 * bottom clears. The Operator row is ineligible in both, so select-all never
 * reaches it under either policy.
 */
function IndeterminatePolicies() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          Default (unset) — mixed → every eligible row.
        </h3>
        <DataGrid
          columns={columns}
          rows={people}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple', isRowSelectable: engineersOnly }}
        />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          selectAllOnIndeterminate: false — mixed → cleared.
        </h3>
        <DataGrid
          columns={columns}
          rows={people}
          getRowId={(row) => row.id}
          selection={{
            mode: 'multiple',
            selectAllOnIndeterminate: false,
            isRowSelectable: engineersOnly,
          }}
        />
      </section>
    </div>
  );
}

/**
 * `selectByRow` — click a row's cells to toggle it. The Operator row is
 * ineligible, so clicking it does nothing. Clicking the row-actions button, or the
 * checkbox itself, selects nothing extra: each isolates propagation, so the
 * checkbox toggles exactly once rather than twice.
 */
function SelectByRow() {
  return (
    <DataGrid
      columns={columns}
      rows={people}
      getRowId={(row) => row.id}
      selection={{
        mode: 'multiple',
        selectByRow: true,
        isRowSelectable: engineersOnly,
      }}
      actions={{
        items: [{ id: 'edit', label: 'Edit' }],
        onAction: () => {},
      }}
    />
  );
}

/**
 * `reserve` decides what happens to a selected id whose record is gone after a
 * data replacement. Select every row, then drop one: the reserving grid keeps the
 * absent id (so re-adding the record shows it still selected), the pruning grid
 * discards it.
 */
function ReservePolicies() {
  const [rows, setRows] = useState(people);
  const dropped = rows.length !== people.length;

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => setRows(dropped ? people : people.slice(0, 3))}
      >
        {dropped ? 'Restore Katherine Johnson' : 'Drop Katherine Johnson'}
      </Button>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          reserve: true — the absent id survives the replacement.
        </h3>
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple', reserve: true }}
        />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          reserve: false — the default. The absent id is pruned.
        </h3>
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          selection={{ mode: 'multiple' }}
        />
      </section>
    </div>
  );
}

const meta = {
  title: 'Components/DataGrid/Selection parity',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Both stories render their own grids (each shows two policies side by side),
  // so these args only satisfy `DataGrid`'s two required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: people },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    selection: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

export const IndeterminatePolicy: StoryObj<typeof meta> = {
  render: () => <IndeterminatePolicies />,
};

export const SelectByRowPolicy: StoryObj<typeof meta> = {
  render: () => <SelectByRow />,
};

export const ReservePolicy: StoryObj<typeof meta> = {
  render: () => <ReservePolicies />,
};
