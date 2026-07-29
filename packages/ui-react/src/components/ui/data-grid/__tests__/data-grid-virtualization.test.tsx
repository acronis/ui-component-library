import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// U6b — the public `virtualization` prop. Acceptance target:
//   packages/ui-spec/components/data-grid/api.yaml  `virtualization`
//
// **What this file is for, and what it deliberately leaves to the seam's own suite.**
// The windowing mechanism is `data-table/data-table-body-window.ts` and
// `data-table-body-window.test.tsx` covers it — spacer arithmetic, the focus pin, the
// two preconditions. This file covers the one thing that suite cannot: whether a
// `<DataGrid virtualization={…}>` prop actually **reaches** it. The config layer is
// where a contribution goes silently inert (an unknown `controllerOptions` key used
// to be dropped without a word), so the route needs its own assertions.
//
// ── happy-dom has no layout, so the geometry is stubbed ──────────────────────
//
// `layOut()` is the same approach as the seam's suite: `@tanstack/react-virtual`
// windows against measured geometry, and here every element is 0×0. Without the stub
// a virtualization test renders everything and asserts the identity behaviour — a
// check that cannot fail.
//
// **The stub does not certify what this file claims.** It is a shared enabling
// condition for the on *and* off cases, so it cannot make an absent prop look present:
// every assertion below turns on the prop changing the rendered row count while the
// geometry stays fixed. It does mean a browser pass is still owed for real scroll
// behaviour (#78), which this file does not discharge.

interface Row {
  id: string;
  name: string;
}

const columns: ColumnDef<Row>[] = [{ accessorKey: 'name', header: 'Name' }];
const rows = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({ id: `r${i}`, name: `Row ${i}` }));

const VIEWPORT = 400;
const spies: (() => void)[] = [];

function layOut(rowHeight = 40) {
  const el = HTMLElement.prototype;
  const restore = [
    vi.spyOn(el, 'clientHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      // Viewport and container both stubbed, and equal: the seam compares them to
      // catch a viewport that escaped its bound, so leaving the container at 0 makes
      // every bounded table look escaped and trips an unrelated warning.
      return this.dataset.slot === 'scroll-area-viewport' ||
        this.dataset.slot === 'table-container'
        ? VIEWPORT
        : 0;
    }),
    vi.spyOn(el, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return this.tagName === 'TR' ? rowHeight : VIEWPORT;
    }),
    vi.spyOn(el, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const height = this.tagName === 'TR' ? rowHeight : VIEWPORT;

      return {
        width: 600,
        height,
        top: 0,
        left: 0,
        right: 600,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }),
  ];
  spies.push(() => restore.forEach((s) => s.mockRestore()));
}

afterEach(() => {
  spies.splice(0).forEach((restore) => restore());
  vi.restoreAllMocks();
});

/** Record rows only — the spacer rows carry no cells with row text. */
const renderedRowCount = () =>
  screen.getAllByRole('row').filter((row) => row.querySelector('td')).length;

describe('DataGrid virtualization — the prop reaches the seam', () => {
  it('windows the body when the prop is set', () => {
    layOut();
    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{}}
      />
    );

    // 500 rows in, far fewer rendered. `virtualization: {}` is a COMPLETE
    // configuration — every default lives in the seam — so this is also the
    // assertion that the empty object is not treated as "off".
    const count = renderedRowCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(60);
  });

  it('renders every row when the prop is absent', () => {
    // The other half, and the one that catches a module contributing `{}`
    // unconditionally: the seam enables on any object, so an always-on
    // `controllerOptions` would window a grid that never asked.
    layOut();
    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(60)}
        appearance={{ height: VIEWPORT }}
      />
    );

    expect(renderedRowCount()).toBe(60);
  });

  it('renders every row when the prop is explicitly false', () => {
    layOut();
    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(60)}
        appearance={{ height: VIEWPORT }}
        virtualization={false}
      />
    );

    expect(renderedRowCount()).toBe(60);
  });

  it('carries `overscan` through, observed as a row count', () => {
    // A viewport of 400 at 40px shows 10 rows, so the rendered count is
    // 10 + overscan-ish. Comparing two overscans rather than asserting an exact
    // number: the arithmetic is the seam's and is pinned in its own suite, while what
    // this file needs to know is that the caller's value is the one being used.
    layOut();
    const { unmount } = render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{ overscan: 1 }}
      />
    );
    const tight = renderedRowCount();
    unmount();

    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{ overscan: 20 }}
      />
    );

    expect(renderedRowCount()).toBeGreaterThan(tight);
  });

  it('carries `estimateRowHeight` through, observed as a row count', () => {
    // Taller estimate, fewer rows in the same viewport. The stub reports a real
    // per-row height of 40 regardless, so this measures the ESTIMATE's effect on the
    // window rather than the measurement pass.
    layOut();
    const { unmount } = render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{ estimateRowHeight: 20, overscan: 0 }}
      />
    );
    const short = renderedRowCount();
    unmount();

    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{ estimateRowHeight: 200, overscan: 0 }}
      />
    );

    expect(renderedRowCount()).toBeLessThan(short);
  });

  it('accepts a per-index row estimate', () => {
    // The function form of `estimateRowHeight`, which is a function of the row INDEX
    // rather than of the row — asserted by being called with indices.
    layOut();
    const estimate = vi.fn((index: number) => (index % 2 === 0 ? 20 : 60));
    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(500)}
        appearance={{ height: VIEWPORT }}
        virtualization={{ estimateRowHeight: estimate }}
      />
    );

    expect(estimate).toHaveBeenCalled();
    expect(
      estimate.mock.calls.every(([index]) => Number.isInteger(index))
    ).toBe(true);
  });
});

describe('DataGrid virtualization — the two members happy-dom cannot show', () => {
  // `measure: 'dynamic'` drives a measurement pass and `scrollToIndex` drives a
  // scroll; neither has an observable effect in an environment with no layout and a
  // permanently-zero `scrollTop`. Their EFFECTS are the seam's to prove.
  //
  // So these assert delivery at the seam's own input boundary —
  // `getFeatures().configs.virtualization` is literally the value
  // `useDataTableBodyWindow` receives as `config`. That is weaker than a behavioural
  // assertion and is marked as such rather than dressed up: it catches the failure
  // this file exists for (a member dropped in the config layer) and would not catch a
  // member the seam ignores.
  const configFor = (virtualization: object) => {
    let seen: unknown;
    layOut();
    render(
      <DataGrid
        columns={columns as ColumnDef<Row>[]}
        rows={rows(30)}
        appearance={{ height: VIEWPORT }}
        virtualization={virtualization}
        chrome={{
          mode: 'external',
          render: ({ controller }) => {
            seen = controller.getFeatures().configs.virtualization;

            return null;
          },
        }}
      />
    );

    return seen as Record<string, unknown> | undefined;
  };

  it('delivers `measure` and `scrollToIndex` to the seam', () => {
    expect(configFor({ measure: 'dynamic', scrollToIndex: 12 })).toEqual({
      measure: 'dynamic',
      scrollToIndex: 12,
    });
  });

  it('delivers nothing the caller did not set', () => {
    // The no-defaults decision, asserted rather than only documented: design §5.2's
    // 40px / `fixed` / overscan 8 live in the seam, and this layer must not
    // manufacture them — an always-present value cannot be told apart from a chosen
    // one downstream.
    expect(configFor({})).toEqual({});
    expect(configFor({ overscan: 3 })).toEqual({ overscan: 3 });
  });
});
