import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
  DataTablePagination,
  useDataTable,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import { DataGridPagination } from '../data-grid-pagination';

// DataGrid owns its pagination row rather than reusing the frozen
// `DataTablePagination` adapter, because `showPageSize`, `showFirstLast` and
// `unknownTotal` are new features and `data-table/index.ts:97-100` marks that
// whole companion suite "do not add new features here" (design §1: the library
// publishes no batteries-included DataTable companion suite; those pieces move
// behind DataGrid and are removed next major). The frozen component's props are
// exactly `{ table, pageSizeOptions? }`, so there was nowhere to put the three.
//
// Plan §0.1 requires an equivalence test whenever a frozen companion is
// reimplemented behind DataGrid: two implementations can drift for as long as
// both exist, and the first test below turns that risk into a checked invariant.
// It also keeps the visual-regression baselines for every unchanged DataGrid
// story safe, because the defaults are what those stories render.
//
// **The numbers these tests turn on are measured, not inferred.** With
// `manualPagination` and neither `rowCount` nor `pageCount`, TanStack's
// `getRowCount()` falls back to the pre-pagination row model length — the loaded
// window — so for the 3 rows and default `pageSize: 10` below:
//
//   getPageCount() === 1      getCanNextPage() === false
//   getRowCount()  === 3      getCanPreviousPage() === false   (at page 0)
//
// So the engine's failure mode under unknown totals is a *confident wrong
// answer*, not a missing one: it announces "Page 1 of 1" for a 500-result query
// and disables Next on every page. That is what makes the assertions below
// discriminating, and it is why an honored capability has to be able to
// contradict the engine rather than merely agree with it.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = Array.from({ length: 3 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Person ${index + 1}`,
}));

type ChromeProps = {
  showPageSize?: boolean;
  showFirstLast?: boolean;
  unknownTotal?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

/** Client pagination: the engine knows its own totals, as it did before U8. */
function Client({ chrome = {} }: { chrome?: ChromeProps }) {
  const controller = useDataTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    pagination: true,
  });
  return <DataGridPagination table={controller.table} {...chrome} />;
}

/** The same controller, rendered through the frozen adapter. */
function Frozen() {
  const controller = useDataTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    pagination: true,
  });
  return <DataTablePagination table={controller.table} />;
}

/** Manual pagination, with the totals and starting page under test control. */
function Server({
  chrome = {},
  rowCount,
  pageIndex = 0,
}: {
  chrome?: ChromeProps;
  rowCount?: number;
  pageIndex?: number;
}) {
  const controller = useDataTable<Person>({
    columns,
    data: rows,
    getRowId: (row) => row.id,
    manualPagination: true,
    defaultState: { pagination: { pageIndex, pageSize: 10 } },
    ...(rowCount === undefined ? {} : { rowCount }),
  });
  return <DataGridPagination table={controller.table} {...chrome} />;
}

/** React and Base UI mint per-render ids; everything else must match exactly. */
function withoutGeneratedIds(html: string): string {
  return html
    .replace(/id="[^"]*_r_[^"]*"/g, 'id="[generated]"')
    .replace(/aria-controls="[^"]*"/g, 'aria-controls="[generated]"')
    .replace(/aria-labelledby="[^"]*"/g, 'aria-labelledby="[generated]"')
    .replace(/aria-describedby="[^"]*"/g, 'aria-describedby="[generated]"');
}

describe('DataGridPagination', () => {
  it('renders the same markup as the frozen DataTablePagination it replaced', () => {
    const grid = render(<Client />);
    const gridHtml = withoutGeneratedIds(grid.container.innerHTML);
    grid.unmount();

    const frozen = render(<Frozen />);
    const frozenHtml = withoutGeneratedIds(frozen.container.innerHTML);

    expect(gridHtml).toBe(frozenHtml);
  });

  it('renders every control at the defaults', () => {
    // The baseline the two members below are measured against: without it,
    // "the control is absent" cannot be told apart from "the control never
    // rendered in this harness at all".
    render(<Client />);
    expect(screen.getByLabelText('Rows per page')).toBeVisible();
    expect(screen.getByLabelText('Go to first page')).toBeVisible();
    expect(screen.getByLabelText('Go to last page')).toBeVisible();
    expect(screen.getByText(/^Page 1 of 1$/)).toBeVisible();
  });

  it('drops only the rows-per-page select when `showPageSize` is false', () => {
    render(<Client chrome={{ showPageSize: false }} />);
    expect(screen.queryByLabelText('Rows per page')).toBeNull();
    // The indicator and all four nav buttons are untouched.
    expect(screen.getByText(/^Page 1 of 1$/)).toBeVisible();
    expect(screen.getByLabelText('Go to first page')).toBeVisible();
    expect(screen.getByLabelText('Go to previous page')).toBeVisible();
    expect(screen.getByLabelText('Go to next page')).toBeVisible();
    expect(screen.getByLabelText('Go to last page')).toBeVisible();
  });

  it('drops only the first/last buttons when `showFirstLast` is false', () => {
    render(<Client chrome={{ showFirstLast: false }} />);
    expect(screen.queryByLabelText('Go to first page')).toBeNull();
    expect(screen.queryByLabelText('Go to last page')).toBeNull();
    // Previous/next, the select and the indicator are untouched.
    expect(screen.getByLabelText('Go to previous page')).toBeVisible();
    expect(screen.getByLabelText('Go to next page')).toBeVisible();
    expect(screen.getByLabelText('Rows per page')).toBeVisible();
    expect(screen.getByText(/^Page 1 of 1$/)).toBeVisible();
  });

  it('leaves both directions to the engine when no capability is supplied', () => {
    // The negative half of the capability rule below, in a configuration where
    // the engine's two answers *differ* — `rowCount: 100` at `pageSize: 10` is
    // ten pages, so at page 0 the engine says no-previous and yes-next. Without
    // this, an implementation that hard-disabled or hard-enabled a button would
    // still satisfy every capability assertion.
    render(<Server rowCount={100} />);
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).toBeEnabled();
    expect(screen.getByText(/^Page 1 of 10$/)).toBeVisible();
  });

  describe('unknownTotal', () => {
    it('announces no page count and hides first/last without being asked to', () => {
      render(
        <Server
          chrome={{
            unknownTotal: true,
            hasNextPage: true,
            hasPreviousPage: false,
          }}
        />
      );

      // "no fabricated page count is announced"
      // (ui-spec/…/data-table/behavior.md, "Unknown totals are honest"). The
      // second assertion names the specific fabrication: in this exact
      // configuration the engine's page count is 1, so the frozen component — and
      // any version that kept rendering the count — renders "Page 1 of 1" for a
      // query whose real total is unknown.
      expect(screen.getByText(/^Page 1$/)).toBeVisible();
      expect(screen.queryByText(/^Page 1 of 1$/)).toBeNull();

      // `showFirstLast` was NOT passed, so it defaults to `true`. Unknown totals
      // suppress the buttons anyway, because "go to last page" is
      // `setPageIndex(getPageCount() - 1)` — with a page count of 1 that is
      // `setPageIndex(0)`, the *first* page, while the control claims to go to
      // the last. This asserts the component's own guard rather than the config
      // layer's: an implementation that relied purely on `pagination.tsx`
      // resolving `showFirstLast: false` passes through DataGrid and fails here.
      expect(screen.queryByLabelText('Go to first page')).toBeNull();
      expect(screen.queryByLabelText('Go to last page')).toBeNull();
    });

    it('honors a forward capability the engine disagrees with', () => {
      // Engine: `getCanNextPage() === false`, because its page count is derived
      // from the 3 loaded rows. The owner says there is more, and wins.
      render(<Server chrome={{ unknownTotal: true, hasNextPage: true }} />);
      expect(screen.getByLabelText('Go to next page')).toBeEnabled();
    });

    it('honors a backward capability the engine disagrees with', () => {
      // The opposite direction, which needs the engine to say *yes* so the
      // capability can say no: at `pageIndex: 1`, `getCanPreviousPage()` is
      // `pageIndex > 0` → true. Both directions together rule out an
      // implementation that ANDs or ORs the capability with the engine's
      // predicate, since either combinator agrees with the engine in one of them.
      render(
        <Server
          pageIndex={1}
          chrome={{ unknownTotal: true, hasPreviousPage: false }}
        />
      );
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    });

    it('still advances the page when the capability allows it', async () => {
      const user = userEvent.setup();
      render(<Server chrome={{ unknownTotal: true, hasNextPage: true }} />);

      // Enabling the button is only half of it: the click has to reach the
      // engine and move the page index, which is what the caller's next
      // `onQueryChange` refetch keys off.
      await user.click(screen.getByLabelText('Go to next page'));
      expect(screen.getByText(/^Page 2$/)).toBeVisible();
    });
  });
});

// The configuration a real caller produces: `<DataGrid>` in server mode. These
// are what prove the chrome swap actually happened and that every member reaches
// the component through the config registry — the module could resolve all three
// correctly and still render the frozen adapter, and nothing above would notice.
describe('DataGrid pagination members, through the config registry', () => {
  const serverQuery = () =>
    createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: 10 },
      })
    );

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exercises unknownTotal in server mode with both capabilities supplied', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        pagination={{ unknownTotal: true }}
        server={{
          query: serverQuery(),
          hasNextPage: true,
          hasPreviousPage: false,
          onQueryChange: () => {},
        }}
      />
    );

    // Only the new component can produce this: the frozen one has no
    // `unknownTotal` prop and would render "Page 1 of 1" with first/last present.
    expect(screen.getByText(/^Page 1$/)).toBeVisible();
    expect(screen.queryByText(/^Page 1 of 1$/)).toBeNull();
    expect(screen.queryByLabelText('Go to first page')).toBeNull();
    expect(screen.queryByLabelText('Go to last page')).toBeNull();
    // The capabilities reached the chrome from `server`, not from `pagination`.
    expect(screen.getByLabelText('Go to next page')).toBeEnabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  it('reaches showPageSize and showFirstLast from the grouped config', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        pagination={{ showPageSize: false, showFirstLast: false }}
      />
    );
    expect(screen.queryByLabelText('Rows per page')).toBeNull();
    expect(screen.queryByLabelText('Go to first page')).toBeNull();
    expect(screen.queryByLabelText('Go to last page')).toBeNull();
    expect(screen.getByLabelText('Go to next page')).toBeVisible();
  });

  it('leaves the deprecated boolean form on the frozen defaults', () => {
    // The boolean `pagination` alias carries no members, so none of the three is
    // reachable from it — which is why the ✓ for `unknownTotal` is scoped to
    // server mode with capabilities and not to "pagination" generally.
    render(<DataGrid columns={columns} rows={rows} pagination />);
    expect(screen.getByLabelText('Rows per page')).toBeVisible();
    expect(screen.getByLabelText('Go to first page')).toBeVisible();
    expect(screen.getByText(/^Page 1 of 1$/)).toBeVisible();
  });

  describe('invalid combinations', () => {
    it('rejects unknownTotal outside server mode and keeps the honest count', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          pagination={{ unknownTotal: true }}
        />
      );

      expect(error).toHaveBeenCalledWith(
        expect.stringContaining(
          '`pagination.unknownTotal` is valid only in server mode'
        )
      );
      // And it is not honored: the client row model knows the real total, so
      // hiding it would replace a correct answer with none.
      expect(screen.getByText(/^Page 1 of 1$/)).toBeVisible();
      expect(screen.getByLabelText('Go to first page')).toBeVisible();
    });

    it('requires both directional capabilities', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          pagination={{ unknownTotal: true }}
          server={{
            query: serverQuery(),
            hasNextPage: true,
            onQueryChange: () => {},
          }}
        />
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining(
          'requires both `server.hasNextPage` and `server.hasPreviousPage`'
        )
      );
    });

    it('rejects unknownTotal alongside a known total', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          pagination={{ unknownTotal: true }}
          server={{
            query: serverQuery(),
            rowCount: 300,
            hasNextPage: true,
            hasPreviousPage: false,
            onQueryChange: () => {},
          }}
        />
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining(
          'cannot be combined with `server.rowCount`/`server.pageCount`'
        )
      );
    });

    it('reports an explicit showFirstLast it cannot honor', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          pagination={{ unknownTotal: true, showFirstLast: true }}
          server={{
            query: serverQuery(),
            hasNextPage: true,
            hasPreviousPage: false,
            onQueryChange: () => {},
          }}
        />
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('`showFirstLast: true` cannot be honored')
      );
    });

    it('stays silent about showFirstLast when the caller never mentioned it', () => {
      // The discriminator for the rule above. `showFirstLast` defaults to `true`,
      // so a version that read the *resolved* flag rather than the config member
      // would warn on every correctly configured unknown-total grid — and would
      // still pass the previous test.
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          pagination={{ unknownTotal: true }}
          server={{
            query: serverQuery(),
            hasNextPage: true,
            hasPreviousPage: false,
            onQueryChange: () => {},
          }}
        />
      );
      expect(error).not.toHaveBeenCalledWith(
        expect.stringContaining('`showFirstLast: true` cannot be honored')
      );
    });

    it('reports a server config with neither totals nor capabilities', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          server={{ query: serverQuery(), onQueryChange: () => {} }}
        />
      );
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining(
          'needs either `server.rowCount`/`server.pageCount` or both `server.hasNextPage` and `server.hasPreviousPage`'
        )
      );
    });

    it('stays silent when a server config supplies a total', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          server={{
            query: serverQuery(),
            pageCount: 3,
            onQueryChange: () => {},
          }}
        />
      );
      expect(error).not.toHaveBeenCalled();
    });
  });
});

// The DataTable-layer half of `unknownTotal`, which the DOM assertions above
// cannot see: under unknown totals the chrome does not render the page count, so
// an implementation that skipped the engine contribution entirely would pass every
// test in this file so far. These assert the engine's own answer.
describe('unknownTotal at the engine', () => {
  function pageCountOf(
    options: {
      unknownTotal?: boolean;
      manualPagination?: boolean;
      rowCount?: number;
    } = {}
  ): number {
    const { unknownTotal, manualPagination = true, rowCount } = options;
    // Rendered rather than assigned to an outer variable: writing to a closure
    // during render is a side effect in a render path, which `react-hooks/globals`
    // rejects — and rightly, since it would read whichever render happened last.
    function Probe() {
      const controller = useDataTable<Person>({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        ...(manualPagination ? { manualPagination: true } : {}),
        ...(rowCount === undefined ? {} : { rowCount }),
        pagination: unknownTotal ? { unknownTotal: true } : true,
      });
      return (
        <span data-testid="page-count">{controller.table.getPageCount()}</span>
      );
    }
    const view = render(<Probe />);
    const pageCount = Number(screen.getByTestId('page-count').textContent);
    view.unmount();
    return pageCount;
  }

  it('reports an unknown page count instead of one derived from the window', () => {
    // The pair is the point. Without `unknownTotal` the engine confidently
    // reports 1 — `ceil(3 loaded rows / pageSize 10)` — for a query whose real
    // total it has never seen. With it, the engine reports `-1`, TanStack's
    // "genuinely unknown", which also lifts the page clamp so navigation can go
    // past the loaded window.
    expect(pageCountOf({ manualPagination: true })).toBe(1);
    expect(pageCountOf({ manualPagination: true, unknownTotal: true })).toBe(
      -1
    );
  });

  it('leaves a known total alone', () => {
    // `unknownTotal` with a supplied total is an invalid combination that
    // DataGrid reports, and where a caller does it anyway the known total is the
    // safer degradation — it still produces a working paginator. So the
    // contribution is gated on both totals being absent rather than ordered
    // against them.
    expect(
      pageCountOf({ manualPagination: true, unknownTotal: true, rowCount: 100 })
    ).toBe(10);
  });

  it('reports unknownTotal without manual pagination, and changes nothing', () => {
    // The guard for the configuration DataGrid cannot produce — it resolves
    // `unknownTotal` to `false` outside server mode — but a direct `useDataTable`
    // caller can. `pageCount: -1` would break a client row model that knows its
    // own total, so the contribution is withheld and the mistake is reported.
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(pageCountOf({ manualPagination: false, unknownTotal: true })).toBe(
      1
    );
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'pagination.unknownTotal requires manualPagination'
      )
    );
    error.mockRestore();
  });

  it('stays silent when manual pagination is on', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    pageCountOf({ manualPagination: true, unknownTotal: true });
    expect(error).not.toHaveBeenCalledWith(
      expect.stringContaining(
        'pagination.unknownTotal requires manualPagination'
      )
    );
    error.mockRestore();
  });
});

// And the DataGrid-level half: that the config module contributes the *object*
// form of the `pagination` controller option rather than the boolean, which is
// what carries `unknownTotal` to the engine at all. Observed through an external
// chrome renderer, which suppresses the built-in controls but keeps the shared
// controller — the only route from outside to an engine answer the built-in
// chrome deliberately does not render.
describe('unknownTotal reaches the engine through DataGrid', () => {
  const serverQuery = () =>
    createDataTableQuery(
      createDefaultDataTableState({
        pagination: { pageIndex: 0, pageSize: 10 },
      })
    );

  function renderWithProbe(unknownTotal: boolean) {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const view = render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        {...(unknownTotal ? { pagination: { unknownTotal: true } } : {})}
        server={{
          query: serverQuery(),
          hasNextPage: true,
          hasPreviousPage: false,
          onQueryChange: () => {},
        }}
        chrome={{
          mode: 'external',
          render: ({ controller }) => (
            <span data-testid="page-count">
              {controller.table.getPageCount()}
            </span>
          ),
        }}
      />
    );
    // Unmount before returning: both calls below happen inside one test, and
    // RTL's auto-cleanup runs between tests, not between renders.
    const value = screen.getByTestId('page-count').textContent;
    view.unmount();
    error.mockRestore();
    return value;
  }

  it('contributes the object form only when unknownTotal is honored', () => {
    // Without the member, DataGrid contributes `pagination: true` and the engine
    // fabricates a count from the loaded window. With it, DataGrid contributes
    // `{ unknownTotal: true }` and the engine reports unknown. A module that kept
    // returning the boolean fails the second assertion and nothing else.
    expect(renderWithProbe(false)).toBe('1');
    expect(renderWithProbe(true)).toBe('-1');
  });
});
