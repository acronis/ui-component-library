import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { DataGrid } from '../data-grid';

// The `virtualization` group (U6). Only the rows near the viewport are rendered, so a
// large dataset scrolls at a constant cost.
//
// **Every story here sets `appearance.height`, and the bound is a requirement rather
// than a convention.** Windowing needs a bounded scroll container: without one there is
// no viewport to measure against, every row renders, and the engine reports it as a
// development error.
//
// This used to add that `maxHeight` alone was *not* enough, because it clamped the
// container while leaving the viewport's height unresolved. **That was true and is no
// longer**: `4be051e1` moved the height constraints onto the viewport, so a definite
// `appearance.maxHeight` bounds windowing exactly as `height` does — demonstrated
// positively by the pixel-identical `BoundedByHeightOverflowing` /
// `BoundedByMaxHeightOverflowing` pair in `table.stories.tsx` (`81d68585`).
// `37fe7043` additionally requires the value to be definite and warns on a percentage.
// These stories keep `height` because it is the unambiguous form, not because
// `maxHeight` is broken.
//
// Windowing applies to the **display-row** list rather than to the records, which is
// what keeps row index and count metadata intact (design §7). Scroll with the keyboard
// as well as the wheel: the focused row stays rendered even when it scrolls out of the
// overscan, which is what stops focus being lost mid-list.
//
// Checked in light and dark mode.

interface Event {
  id: string;
  name: string;
  host: string;
  status: string;
}

const STATUSES = ['Delivered', 'Queued', 'Failed', 'Retrying'];
const HOSTS = ['edge-01', 'edge-02', 'core-a', 'core-b', 'relay-7'];

/** Ten thousand rows, so the difference is structural rather than cosmetic. */
const events: Event[] = Array.from({ length: 10000 }, (_, index) => ({
  id: `evt-${index}`,
  name: `Event ${index.toString().padStart(5, '0')}`,
  host: HOSTS[index % HOSTS.length]!,
  status: STATUSES[index % STATUSES.length]!,
}));

const columns: ColumnDef<Event>[] = [
  { accessorKey: 'name', header: 'Event' },
  { accessorKey: 'host', header: 'Host' },
  { accessorKey: 'status', header: 'Status' },
];

/** The whole configuration: `virtualization={{}}` plus a bounded height. */
function Windowed() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Event>[]}
      rows={events}
      getRowId={(row) => row.id}
      appearance={{ height: 420, stickyHeader: true }}
      virtualization={{}}
    />
  );
}

/**
 * `overscan` decides how many rows are rendered beyond each edge. A larger value
 * costs more DOM and hides the render boundary during fast scrolling; a smaller one
 * is cheaper and can flash empty space. The default is 8.
 */
function Overscan() {
  return (
    <div className="flex flex-col gap-8">
      {[0, 8, 40].map((overscan) => (
        <section className="flex flex-col gap-2" key={overscan}>
          <h3 className="text-sm font-medium">overscan: {overscan}</h3>
          <DataGrid
            columns={columns as ColumnDef<Event>[]}
            rows={events}
            getRowId={(row) => row.id}
            appearance={{ height: 240 }}
            virtualization={{ overscan }}
          />
        </section>
      ))}
    </div>
  );
}

/**
 * `measure: 'dynamic'` measures each rendered row instead of trusting
 * `estimateRowHeight`. It is the right choice for variable-height content — wrapped
 * text, a chip that sometimes appears — and costs a measurement pass. With `'fixed'`
 * (the default) a wrong estimate shows up as drifting scroll position.
 */
function VariableHeights() {
  const wordy: Event[] = events.map((event, index) => ({
    ...event,
    name:
      index % 3 === 0
        ? `${event.name} — ${'a longer description that wraps onto more than one line. '.repeat(2)}`
        : event.name,
  }));

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          measure: &apos;fixed&apos; (default) — one estimate for every row
        </h3>
        <DataGrid
          columns={columns as ColumnDef<Event>[]}
          rows={wordy}
          getRowId={(row) => row.id}
          appearance={{ height: 300, width: 640 }}
          virtualization={{ estimateRowHeight: 40 }}
        />
      </section>
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">
          measure: &apos;dynamic&apos; — each rendered row measured
        </h3>
        <DataGrid
          columns={columns as ColumnDef<Event>[]}
          rows={wordy}
          getRowId={(row) => row.id}
          appearance={{ height: 300, width: 640 }}
          virtualization={{ estimateRowHeight: 40, measure: 'dynamic' }}
        />
      </section>
    </div>
  );
}

/**
 * `scrollToIndex` scrolls a row into view, and again whenever the value changes — so
 * it is a *command expressed as state* rather than a one-shot. Useful for "jump to
 * the first failure" without holding a ref to the grid.
 */
function ScrollTo() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Event>[]}
      rows={events}
      getRowId={(row) => row.id}
      appearance={{ height: 320 }}
      virtualization={{ scrollToIndex: 4200 }}
    />
  );
}

/**
 * Windowing composes with selection and the toolbar: the checkbox column, the
 * bulk-action bar and the search all work over the full dataset, because windowing is
 * presentation over the rendered list and changes no counts or state.
 */
function WithSelection() {
  return (
    <DataGrid
      columns={columns as ColumnDef<Event>[]}
      rows={events}
      getRowId={(row) => row.id}
      selection={{ mode: 'multiple' }}
      searchKey="name"
      appearance={{ height: 420, stickyHeader: true }}
      virtualization={{}}
    />
  );
}

const meta = {
  title: 'Components/DataGrid/Virtualization',
  component: DataGrid,
  parameters: { layout: 'padded' },
  // Every story renders its own grid, so these args only satisfy `DataGrid`'s two
  // required props.
  args: { columns: columns as ColumnDef<unknown, unknown>[], rows: events },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    virtualization: { control: false },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

export const Windowing: StoryObj<typeof meta> = { render: () => <Windowed /> };

// Three bounded grids stacked overflow the 720px capture viewport. Without
// `fullPage` the `overscan: 40` case is clipped to a header and one row, so the
// baseline cannot show the comparison it exists for (#89).
export const OverscanRows: StoryObj<typeof meta> = {
  parameters: { snapshot: { fullPage: true } },
  render: () => <Overscan />,
};

// Two 300px grids stacked overflow the capture viewport; without `fullPage` the
// bottom of the `measure: 'dynamic'` grid is clipped away (#89).
export const DynamicRowHeights: StoryObj<typeof meta> = {
  parameters: { snapshot: { fullPage: true } },
  render: () => <VariableHeights />,
};

export const ScrollToIndex: StoryObj<typeof meta> = {
  render: () => <ScrollTo />,
};

export const WithSelectionAndSearch: StoryObj<typeof meta> = {
  render: () => <WithSelection />,
};
