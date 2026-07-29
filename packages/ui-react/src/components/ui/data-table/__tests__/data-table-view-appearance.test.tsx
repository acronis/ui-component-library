import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../data-table-controller';
import { DataTableRoot } from '../data-table-root';
import { DataTableView, type DataTableViewProps } from '../data-table-view';

// NB-6. `DataTableView` rendered `<Table>` bare inside a hardcoded wrapper and
// `DataTableViewProps` carried no box props, so F3's presentation and
// scroll-container props were reachable from a hand-written composition and
// unreachable from DataGrid. These tests pin the pass-through, because it is the
// precondition for U6 (virtualization needs a bounded container) and the target of
// U9's `appearance` wiring.

interface Person {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'team', header: 'Team' },
];

const rows: Person[] = [
  { id: 'person-0', name: 'Ada', team: 'Engine' },
  { id: 'person-1', name: 'Grace', team: 'Compiler' },
];

function renderView(props: DataTableViewProps<Person>) {
  function Harness() {
    const controller = useDataTable({
      columns,
      data: rows,
      getRowId: (row) => row.id,
    });

    return (
      <DataTableRoot table={controller}>
        <DataTableView<Person> {...props} />
      </DataTableRoot>
    );
  }

  return render(<Harness />);
}

// The scroll container is a ScrollArea: the ROOT carries the box size, and the
// VIEWPORT is the element that actually scrolls and so carries `data-bounded` and
// the owner's ref. Asserting the right one matters — a ref on the root reports
// `scrollTop: 0` forever, which is why the split exists.
const container = (root: HTMLElement) =>
  root.querySelector('[data-slot="table-container"]') as HTMLElement;
const viewport = (root: HTMLElement) =>
  root.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;

describe('DataTableView appearance box-prop pass-through', () => {
  it('leaves the container unbounded and free of box sizes by default', () => {
    const { container: root } = renderView({});

    expect(viewport(root)).not.toHaveAttribute('data-bounded');
    // Not `toBeNull()`: under ScrollArea *every* element in the chain carries an
    // inline style — the root its position and corner-size custom properties, the
    // viewport its `overflow: scroll` and overflow metrics, the content wrapper
    // `min-width: fit-content`. Measured in a browser: there is no style-free
    // element left, so this assertion's original form is unsatisfiable by any
    // arrangement rather than by this one.
    //
    // Enumerated rather than pattern-matched: a regex over the style string for
    // `width|height|max-height` silently misses `min-height` and the logical
    // aliases. Anything unset reads `''`, and asserting the object names the
    // offending property on failure.
    const boxSizes = Object.fromEntries(
      (
        [
          'width',
          'minWidth',
          'maxWidth',
          'height',
          'minHeight',
          'maxHeight',
          'blockSize',
          'minBlockSize',
          'maxBlockSize',
          'inlineSize',
          'minInlineSize',
          'maxInlineSize',
        ] as const
      )
        .map((property) => [
          property,
          container(root).style[property] as string,
        ])
        .filter(([, value]) => value !== '')
    );
    expect(boxSizes).toEqual({});
  });

  // Both constraints are asserted on the **viewport** rather than on the box
  // (#76). `maxHeight` on the box left the viewport free to grow to its content:
  // it reported itself bounded, clipped its overflow, and never scrolled, which
  // made windowing inert in exactly the configuration this test names. The
  // assertion moved with the constraint; the `data-bounded` half was always right.
  it('bounds the scroll container from maxHeight, which is what windowing needs', () => {
    const { container: root } = renderView({ maxHeight: 240 });

    // `data-bounded` is the seam virtualization keys off: a bounded container is
    // the one precondition windowed rendering cannot supply for itself.
    expect(viewport(root)).toHaveAttribute('data-bounded', 'true');
    expect(viewport(root).style.maxHeight).toBe('240px');
    // And nothing bounds the box, which is what made the pass-through inert.
    expect(container(root).style.maxHeight).toBe('');
  });

  it('passes height, and accepts a bare number as px', () => {
    const { container: root } = renderView({ height: 320 });

    expect(viewport(root).style.height).toBe('320px');
    expect(viewport(root)).toHaveAttribute('data-bounded', 'true');
  });

  it('passes size and background to the table element', () => {
    const { container: root } = renderView({
      size: 'small',
      background: 'subtle',
    });
    const table = root.querySelector('table')!;

    expect(table.className).toContain('bg-muted');
    expect(table.className).toContain('--table-sticky-surface');
  });

  it('passes independent borders through to the table element', () => {
    const { container: root } = renderView({
      borders: { top: true, bottom: false, horizontal: false, vertical: true },
    });
    const table = root.querySelector('table')!;

    expect(table.className).toMatch(/border/);
  });

  it('pins the header when stickyHeader is set', () => {
    const { container: root } = renderView({
      maxHeight: 200,
      stickyHeader: true,
    });

    expect(root.querySelector('thead')).toHaveAttribute('data-sticky', 'true');
  });

  it('hides the header row but keeps the column model and the body', () => {
    renderView({ showHeader: false });

    expect(
      screen.queryByRole('columnheader', { name: 'Name' })
    ).not.toBeInTheDocument();
    // The body still renders every column, so the column model is untouched.
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('Engine')).toBeInTheDocument();
  });

  // ── #90 ─────────────────────────────────────────────────────────────────────
  // This test used to be `keeps the legacy wrapper and its bordered classes
  // intact` and asserted `wrapper.firstElementChild === container(root)` — i.e. it
  // pinned a **bordered wrapper that was a different element from the scroll
  // container**. That separation *was* the defect: the wrapper took no width, so
  // `width` (which lands on the scroll container) drew a narrow scroll region
  // inside a full-width border. The test passed throughout, because it asserted
  // the structure rather than the relationship.
  //
  // Rewritten to assert the relationship. It is the only thing that would have
  // caught #90, and it fails on any arrangement that separates the two again.
  it('puts the border and the width constraint on the SAME element', () => {
    const { container: root } = renderView({ bordered: true, width: 640 });
    const box = container(root);

    // One element, three responsibilities: the boundary, the width, the scrolling.
    expect(box.className).toContain('rounded-md');
    expect(box.className).toContain('border');
    expect(box.className).toContain('[&_td:not(:last-child)]:border-e');
    expect(box.style.width).toBe('640px');

    // And no *other* element carries a border. A second bordered box is how the
    // two drifted apart in the first place; `toBe(box)` on a single query would
    // still pass if a wrapper existed but sorted later in document order.
    const bordered = [...root.querySelectorAll('*')].filter((el) =>
      /(^|\s)border($|\s)/.test((el as HTMLElement).className || '')
    );
    expect(bordered).toEqual([box]);
  });

  it('leaves the scroll container free of a width when none is asked for', () => {
    // The negative half: the fix must not hand every table an inline width.
    const { container: root } = renderView({ bordered: true });
    expect(container(root).style.width).toBe('');
  });
});

describe('DataTableView appearance class and style resolvers', () => {
  it('applies rowClassName and rowStyle from the row context', () => {
    renderView({
      rowClassName: (row) =>
        row.data.team === 'Engine' ? 'engine-row' : undefined,
      rowStyle: (row) => (row.id === 'person-1' ? { opacity: 0.5 } : undefined),
    });

    expect(screen.getByText('Ada').closest('tr')).toHaveClass('engine-row');
    expect(screen.getByText('Grace').closest('tr')).not.toHaveClass(
      'engine-row'
    );
    expect(screen.getByText('Grace').closest('tr')!.style.opacity).toBe('0.5');
  });

  it('applies cellClassName and cellStyle from the cell context', () => {
    renderView({
      cellClassName: (cell) =>
        cell.columnId === 'team' ? 'team-cell' : undefined,
      cellStyle: (cell) =>
        cell.columnId === 'name' ? { fontWeight: 700 } : undefined,
    });

    expect(screen.getByText('Engine')).toHaveClass('team-cell');
    expect(screen.getByText('Ada')).not.toHaveClass('team-cell');
    expect(screen.getByText('Ada').style.fontWeight).toBe('700');
  });

  it('applies headerClassName and headerStyle from the header context', () => {
    renderView({
      headerClassName: (header) =>
        header.columnId === 'name' ? 'name-head' : undefined,
      headerStyle: (header) =>
        header.columnId === 'team' ? { width: '40%' } : undefined,
    });

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass(
      'name-head'
    );
    expect(screen.getByRole('columnheader', { name: 'Team' }).style.width).toBe(
      '40%'
    );
  });

  it('resolves each callback against every row, not just the first', () => {
    const seen: string[] = [];
    renderView({
      rowClassName: (row) => {
        seen.push(row.id);
        return undefined;
      },
    });

    expect(seen).toEqual(['person-0', 'person-1']);
  });
});
