import { useLayoutEffect } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { act, render, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DataTableController } from '../data-table-controller';

import type { DataTableBodyWindow } from '../data-table-body-window';
import { defineDataTableFeature } from '../data-table-features/registry';

// BL-9 and BL-10 from the build review: three capabilities were declared,
// documented, and reached by nothing. That is the inverse of the defect the rest
// of the wave chased — a *surface no point could reach* fails loudly at the type
// level, whereas a *point that reaches nothing* lets a unit build against a
// README entry and discover the emptiness at runtime.
//
// So these are wiring tests, deliberately end-to-end rather than unit: each one
// asserts that a declared member is actually consumed by the view or the
// controller, which is the only claim that was missing.
//
// Both seams are mocked rather than exercised through their shipped identity
// implementations, because the identity window measures nothing and no shipped
// feature emits a footer row — so the shipped path cannot demonstrate the wiring
// even when the wiring is correct.

interface Row {
  readonly id: string;
  readonly name: string;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Row[] = [
  { id: 'r1', name: 'Ada' },
  { id: 'r2', name: 'Grace' },
];

/** Mutable window the mocked seam returns, so each test can shape it. */
let windowOverride: Partial<DataTableBodyWindow<Row>> = {};

vi.mock('../data-table-body-window', () => ({
  useDataTableBodyWindow: <TData,>({
    displayRows,
  }: {
    displayRows: readonly unknown[];
  }) =>
    ({
      rows: displayRows,
      paddingTop: 0,
      paddingBottom: 0,
      isWindowed: false,
      ...windowOverride,
    }) as DataTableBodyWindow<TData>,
}));

/**
 * Stands in for U4 and U3: the two remaining points whose consumption was only
 * verifiable by reading the view, rather than by observing a rendered result.
 */
const presentationTestFeature = defineDataTableFeature<Row>({
  id: 'grouping',
  rowPresentation: (ctx) =>
    ctx.row.id === 'r1'
      ? {
          className: 'contributed-row',
          style: { outlineWidth: '3px' },
          expanded: true,
          sticky: true,
          stickyOffset: 12,
        }
      : undefined,
  columnPresentation: () => ({
    className: 'contributed-column',
    style: { width: '123px' },
    pinned: 'start',
    pinOffset: 24,
    headerAdornments: [
      // Genuinely interactive, deliberately. An inert <span> passes the nesting
      // check whether or not the routing is correct, which is exactly how the
      // first version of this test concealed Gap 1.
      {
        id: 'grip',
        placement: 'edge',
        node: (
          <button type="button" aria-label="Resize column">
            GRIP
          </button>
        ),
      },
      { id: 'lead', placement: 'before-label', node: <span>LEAD</span> },
    ],
  }),
});

vi.mock('../data-table-features', async (importOriginal) => {
  const real = await importOriginal<typeof import('../data-table-features')>();

  return {
    ...real,
    DATA_TABLE_FEATURES: [...real.DATA_TABLE_FEATURES, presentationTestFeature],
  };
});

// Imported after the mocks so both are in place.
const { useDataTable } = await import('../data-table-controller');
const { DataTableRoot } = await import('../data-table-root');
const { DataTableView } = await import('../data-table-view');

function Harness({
  stickyFooter,
  sortable,
}: {
  stickyFooter?: boolean;
  sortable?: boolean;
}) {
  const controller = useDataTable({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    // The REAL footer feature, not a stand-in. When these tests were first
    // written no shipped feature emitted a footer row, so one had to be mocked
    // in; U5 shipped it, so the wiring is now proven against production code.
    footer: { summaries: [{ columnId: 'name', aggregate: 'count' }] },
    // The view only renders the sort control for a column the engine reports as
    // sortable, so `sortable` alone is not enough.
    ...(sortable ? { sorting: true as const } : {}),
  });

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Row>
        {...(stickyFooter === undefined ? {} : { stickyFooter })}
        {...(sortable === undefined ? {} : { sortable })}
        maxHeight={200}
      />
    </DataTableRoot>
  );
}

/**
 * Hands the controller out through a layout effect rather than assigning to an
 * outer variable during render, which the React Compiler lint rules reject —
 * the same pattern `data-table-root-view.test.tsx` uses.
 */
function Capture({
  onCapture,
}: {
  onCapture: (controller: DataTableController<Row>) => void;
}) {
  const controller = useDataTable({
    columns,
    data: rows,
    getRowId: (row) => row.id,
  });

  useLayoutEffect(() => {
    onCapture(controller);
  }, [controller, onCapture]);

  return (
    <DataTableRoot table={controller}>
      <DataTableView<Row> maxHeight={200} />
    </DataTableRoot>
  );
}

beforeEach(() => {
  windowOverride = {};
});

describe('BL-9 — footer.sticky reaches the primitive', () => {
  it('renders a table-scoped footer row into <tfoot>, not <tbody>', () => {
    const { container } = render(<Harness />);

    const footer = container.querySelector('tfoot');
    expect(footer).not.toBeNull();
    expect(footer).toHaveTextContent('2');
    // A footer row must not leak into the body, where it would be counted as a
    // record row by anything walking <tbody>.
    expect(container.querySelector('tbody')).not.toHaveTextContent('2');
  });

  it('pins the footer section when stickyFooter is set', () => {
    const { container } = render(<Harness stickyFooter />);

    expect(container.querySelector('tfoot')).toHaveAttribute(
      'data-sticky',
      'true'
    );
  });

  it('leaves the footer unpinned by default', () => {
    const { container } = render(<Harness />);

    expect(container.querySelector('tfoot')).not.toHaveAttribute('data-sticky');
  });
});

describe('BL-10 — the body-window seam members are consumed', () => {
  it('measures every rendered display row, keyed by display index', () => {
    const measured: [string, number][] = [];
    windowOverride = {
      measureRow: (element, displayIndex) => {
        if (element) {
          measured.push([element.textContent ?? '', displayIndex]);
        }
      },
    };

    render(<Harness />);

    // Both record rows AND the feature-rendered footer row are measured — a
    // windowed list has to measure derived rows too, and the view does not own
    // the footer element, so its ref arrives by cloning.
    //
    // The footer's index is 2, not 0: indices address the seam's OWN list
    // (`[data, data, footer]`), not the body/footer lists the view splits it
    // into. Indexing the split lists separately would report two different rows
    // as index 0 and silently corrupt any geometry the seam derived.
    expect(measured).toEqual([
      ['Ada', 0],
      ['Grace', 1],
      ['2', 2],
    ]);
  });

  it('reserves scroll height with spacer rows when the seam is windowing', () => {
    windowOverride = { isWindowed: true, paddingTop: 120, paddingBottom: 240 };

    const { container } = render(<Harness />);
    const heights = [...container.querySelectorAll('tbody tr')]
      .map((row) => (row.firstElementChild as HTMLElement | null)?.style.height)
      .filter(Boolean);

    expect(heights).toEqual(['120px', '240px']);
  });

  it('renders no spacer rows while the seam is not windowing', () => {
    const { container } = render(<Harness />);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('dispatches scroll-to-row through the view bridge to the seam', () => {
    const scrollToRecord = vi.fn();
    windowOverride = { scrollToRecord };

    let controller: DataTableController<Row> | undefined;

    render(<Capture onCapture={(value) => (controller = value)} />);
    act(() => {
      controller?.toggle({ type: 'scroll-to-row', index: 1 });
    });

    // Pre-declaring the union member was never enough on its own: the controller
    // owns the action and cannot reach the view's scroll container.
    expect(scrollToRecord).toHaveBeenCalledWith(1);
  });

  it('dispatches measure-layout through the view bridge to the seam', () => {
    const measureLayout = vi.fn();
    windowOverride = { measureLayout };

    let controller: DataTableController<Row> | undefined;

    render(<Capture onCapture={(value) => (controller = value)} />);
    act(() => {
      controller?.toggle({ type: 'measure-layout' });
    });

    expect(measureLayout).toHaveBeenCalledOnce();
  });

  it('publishes nothing to the bridge once the view unmounts', () => {
    const scrollToRecord = vi.fn();
    windowOverride = { scrollToRecord };

    let controller: DataTableController<Row> | undefined;

    const view = render(
      <Capture onCapture={(value) => (controller = value)} />
    );
    view.unmount();

    // A stale handle pointing at an unmounted scroll container is worse than an
    // honest "not implemented".
    expect(() =>
      controller?.toggle({ type: 'scroll-to-row', index: 0 })
    ).toThrow(/not implemented yet/);
  });

  it('still fails loudly while the seam implements neither operation', () => {
    // The shipped identity window supplies no handles, so the pre-declared
    // actions must keep saying they are not implemented rather than no-opping.
    const { result } = renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );

    expect(() =>
      result.current.toggle({ type: 'scroll-to-row', index: 0 })
    ).toThrow(/not implemented yet/);
    expect(() => result.current.toggle({ type: 'measure-layout' })).toThrow(
      /not implemented yet/
    );
  });
});

describe('audit — the remaining points reach the DOM, not just the composer', () => {
  // These two were verifiable only by reading `data-table-view.tsx`. After BL-9
  // and BL-10 that is not good enough: "declared, documented, reached by nothing"
  // is exactly the defect class, so every point now has a rendered result behind
  // it rather than a call site.
  it('applies rowPresentation to the record row it targets', () => {
    const { container } = render(<Harness />);
    const first = container.querySelector('tbody tr') as HTMLElement;

    expect(first).toHaveClass('contributed-row');
    expect(first.style.outlineWidth).toBe('3px');
    // The discrete flags reach the primitive's own props, which is what
    // `expanded`/`sticky`/`stickyOffset` exist for.
    expect(first).toHaveAttribute('data-expanded', 'true');
    // And `aria-expanded` must NOT appear: it is invalid on a row inside
    // `role="table"`, and the spec's anatomy puts it on the disclosure button,
    // which is where U1's expander already carries it. `expanded` is a styling
    // hook, never an ARIA one — asserting the absence is what keeps it that way.
    expect(first).not.toHaveAttribute('aria-expanded');
    expect(first.style.getPropertyValue('--table-row-sticky-top')).toBe('12px');
  });

  it('leaves an untargeted row untouched', () => {
    const { container } = render(<Harness />);
    const second = container.querySelectorAll('tbody tr')[1] as HTMLElement;

    expect(second).not.toHaveClass('contributed-row');
    expect(second).not.toHaveAttribute('data-expanded');
  });

  it('renders header adornments in placement order inside the header cell', () => {
    const { container } = render(<Harness />);
    const head = container.querySelector('th') as HTMLElement;

    // before-label, then the label, then edge — the placement order, not the
    // order the feature happened to list them in.
    expect(head.textContent).toBe('LEADNameGRIP');
  });

  // Gap 1. `textContent` above is NESTING-BLIND: it reads identically whether the
  // adornments are siblings of the label or nested inside the sort button. So it
  // looked like coverage while concealing the defect. These assert the structure,
  // in the configuration the named consumer actually uses — a sortable column with
  // an interactive adornment, which is the normal records grid.
  it('keeps an interactive edge adornment OUT of the sort button', () => {
    const { container } = render(<Harness sortable />);
    const head = container.querySelector('th') as HTMLElement;
    const handle = head.querySelector('button[aria-label="Resize column"]');
    // The sort control carries no aria-label: its accessible name comes from its
    // children, which is precisely why absorbing the handle's label matters.
    const sortButton = [...head.querySelectorAll('button')].find(
      (button) => button !== handle
    );

    expect(sortButton).not.toBeUndefined();
    expect(handle).not.toBeNull();
    // Nested, a pointer release on the handle fires onSort, Enter/Space sorts
    // instead of resizing, and the sort button's accessible name absorbs the
    // handle's label — the last of which is a `must` grammar rule.
    expect(sortButton as HTMLElement).not.toContainElement(
      handle as HTMLElement
    );
    expect(handle?.parentElement).toBe(head);
  });

  it('keeps the sort button’s accessible name free of the adornment', () => {
    const { container } = render(<Harness sortable />);
    const head = container.querySelector('th') as HTMLElement;
    const handle = head.querySelector('button[aria-label="Resize column"]');
    const sortButton = [...head.querySelectorAll('button')].find(
      (button) => button !== handle
    ) as HTMLElement;

    expect(sortButton.textContent).not.toContain('GRIP');
  });

  it('still nests a non-interactive before-label adornment with the label', () => {
    // before/after-label are for decoration and may stay inside the sort control;
    // only controls must not nest.
    const { container } = render(<Harness sortable />);
    const head = container.querySelector('th') as HTMLElement;
    const handle = head.querySelector('button[aria-label="Resize column"]');
    const sortButton = [...head.querySelectorAll('button')].find(
      (button) => button !== handle
    ) as HTMLElement;

    expect(sortButton.textContent).toContain('LEAD');
  });

  // Gap 2. `data-pinned` is the selector every pin-related specificity step keys
  // off, including the row's hover and selected tint rules. Hand-rolling the pin
  // with `style` sets no attribute, and the failure is invisible to a DOM test
  // that only checks offsets — so this asserts the attribute, not the geometry.
  it('routes pinned/pinOffset to the header cell and every body cell', () => {
    const { container } = render(<Harness />);
    const head = container.querySelector('th') as HTMLElement;
    const cell = container.querySelector('tbody td') as HTMLElement;

    expect(head).toHaveAttribute('data-pinned', 'start');
    expect(cell).toHaveAttribute('data-pinned', 'start');
    expect(head.style.insetInlineStart).toBe('24px');
    expect(cell.style.insetInlineStart).toBe('24px');
  });

  it('applies columnPresentation to the header cell and every body cell', () => {
    const { container } = render(<Harness />);
    const head = container.querySelector('th') as HTMLElement;
    const cell = container.querySelector('tbody td') as HTMLElement;

    expect(head).toHaveClass('contributed-column');
    expect(head.style.width).toBe('123px');
    expect(cell).toHaveClass('contributed-column');
    expect(cell.style.width).toBe('123px');
  });
});
