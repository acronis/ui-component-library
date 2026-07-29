import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  createDataTableQuery,
  createDefaultDataTableState,
  type DataTableQuery,
} from '../../data-table';
import { DataGrid } from '../data-grid';
import type { DataGridProps } from '../data-grid';
import {
  DATA_GRID_CONFIG_MODULES,
  resolveDataGridConfig,
  type DataGridServerSelection,
} from '../data-grid-config';

// `server.selection` / `server.onSelectionChange` (U8).
//
// Two layers, asserted in two ways, because the DOM can only see one of them.
//
// An **explicit** selection is enumerable, so it becomes a controlled `selection`
// slice and is fully observable: which checkboxes are ticked, and that a toggle
// *requests* rather than commits.
//
// An **all-results** token is not enumerable — its member set is exactly what
// DataGrid has never seen — so it never becomes a controlled slice, and **a fresh
// token and a stale one produce identical markup**. Its staleness contract is
// therefore asserted on the pure resolver, which is where that verdict is made.
// That is not a workaround: `ui-spec/…/data-table/behavior.md`'s "All-results token
// cannot cross a query" says *"no all-results selection is reported for B"*, and
// "reported" is a statement about the resolved value, not about pixels.
//
// Its **rendering** is a different question and is asserted in the DOM, in the
// `selection.selectAll` block at the bottom: with `selectAll: 'all-results'` the
// checkboxes derive from `!excludedIds.has(row.id)` in the cell renderer, which is
// the one place a row id is in hand.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Grace Hopper' },
];

function queryFor(pageSize = 10): DataTableQuery {
  return createDataTableQuery(
    createDefaultDataTableState({ pagination: { pageIndex: 0, pageSize } })
  );
}

/** The resolver takes props directly, so no rendering and no engine involved. */
function resolveServer(
  server: NonNullable<DataGridProps<Person, unknown>['server']>,
  extra: Partial<DataGridProps<Person, unknown>> = {}
) {
  const { resolved, warnings } = resolveDataGridConfig<Person, unknown>(
    {
      columns,
      rows,
      getRowId: (row: Person) => row.id,
      server,
      ...extra,
    } as DataGridProps<Person, unknown>,
    DATA_GRID_CONFIG_MODULES
  );
  return { server: resolved.server, warnings };
}

describe('server.selection — the resolved verdict', () => {
  it('reports an explicit selection and controls the slice with it', () => {
    const selection: DataGridServerSelection = {
      mode: 'explicit',
      ids: new Set(['2']),
    };
    const { server, warnings } = resolveServer({
      query: queryFor(),
      pageCount: 3,
      selection,
      onQueryChange: () => {},
    });

    expect(server.selection).toBe(selection);
    // Enumerable, so it joins the controlled slices `state.ts` merges — which is
    // what makes a toggle a request rather than a commit.
    expect(server.controlledSlices?.selection).toEqual(new Set(['2']));
    expect(warnings).toEqual([]);
  });

  it('reports a fresh all-results token but never controls the slice with it', () => {
    const query = queryFor();
    const selection: DataGridServerSelection = {
      mode: 'all-results',
      queryRequestKey: query.requestKey,
      excludedIds: new Set(['1']),
      token: 'srv-token-1',
    };
    const { server, warnings } = resolveServer({
      query,
      pageCount: 3,
      selection,
      onQueryChange: () => {},
    });

    expect(server.selection).toBe(selection);
    // The second assertion is the one that matters and the one a plausible
    // implementation gets wrong: "everything except these" cannot be expressed as
    // a set of loaded ids, so projecting it into the slice would mean labelling
    // the loaded window as all server results — which the spec forbids in as many
    // words ("never labels loaded rows as all server results").
    expect(server.controlledSlices?.selection).toBeUndefined();
    expect(warnings).toEqual([]);
  });

  it('reports no all-results selection once the query request key changes', () => {
    // "All-results token cannot cross a query": issued for key A, and filters have
    // since produced key B.
    const issuedFor = queryFor(10);
    const current = queryFor(25);
    expect(current.requestKey).not.toBe(issuedFor.requestKey);

    const { server, warnings } = resolveServer({
      query: current,
      pageCount: 3,
      selection: {
        mode: 'all-results',
        queryRequestKey: issuedFor.requestKey,
        excludedIds: new Set(['1']),
        token: 'srv-token-1',
      },
      onQueryChange: () => {},
    });

    expect(server.selection).toBeUndefined();
    expect(server.controlledSlices?.selection).toBeUndefined();
    expect(
      warnings.some((warning) =>
        warning.includes('no all-results selection is reported')
      )
    ).toBe(true);
  });

  it('reports it again once the owner supplies a token scoped to the new key', () => {
    // The "Until the controlled owner supplies a token scoped to B" clause. Its
    // own test, because the rejection above is satisfied just as well by an
    // implementation that rejects every all-results token unconditionally.
    const current = queryFor(25);
    const selection: DataGridServerSelection = {
      mode: 'all-results',
      queryRequestKey: current.requestKey,
      excludedIds: new Set(['1']),
      token: 'srv-token-2',
    };
    const { server, warnings } = resolveServer({
      query: current,
      pageCount: 3,
      selection,
      onQueryChange: () => {},
    });

    expect(server.selection).toBe(selection);
    expect(warnings).toEqual([]);
  });

  it('installs no authoritative handler for an all-results token', () => {
    // A permanent asymmetry, not a pending one. Adjusting `excludedIds` for a
    // toggled row needs the loaded row ids, which are unreachable here, so
    // `selection.tsx` calls `config.onSelectionChange` directly from the toggle
    // site. A version that installed a handler here would emit an all-results
    // event whose exclusions it could not have computed.
    const query = queryFor();
    const { server } = resolveServer({
      query,
      pageCount: 3,
      selection: {
        mode: 'all-results',
        queryRequestKey: query.requestKey,
        excludedIds: new Set(['1']),
        token: 'srv-token-1',
      },
      onSelectionChange: () => {},
      onQueryChange: () => {},
    });

    expect(server.onSelectionChange).toBeUndefined();
  });

  it('installs one for an explicit selection with a handler, and not without', () => {
    const query = queryFor();
    const selection: DataGridServerSelection = {
      mode: 'explicit',
      ids: new Set(['2']),
    };
    expect(
      resolveServer({
        query,
        pageCount: 3,
        selection,
        onSelectionChange: () => {},
        onQueryChange: () => {},
      }).server.onSelectionChange
    ).toBeTypeOf('function');
    // No handler to call, so nothing to install — the paired member.
    expect(
      resolveServer({ query, pageCount: 3, selection, onQueryChange: () => {} })
        .server.onSelectionChange
    ).toBeUndefined();
  });

  it('reports a handler supplied without a selection to report on', () => {
    const { warnings } = resolveServer({
      query: queryFor(),
      pageCount: 3,
      onSelectionChange: () => {},
      onQueryChange: () => {},
    });
    expect(
      warnings.some((warning) =>
        warning.includes('`server.onSelectionChange` reports requested changes')
      )
    ).toBe(true);
  });

  it('reports a caller controlling the same selection slice', () => {
    // Design §5.2's "server selection with state.selection" invalid combination.
    // It falls out of `state.ts`'s existing overlap rule the moment `selection`
    // joins the controlled slices — no new check, which is why this asserts it
    // rather than assuming the reuse worked.
    const { warnings } = resolveServer(
      {
        query: queryFor(),
        pageCount: 3,
        selection: { mode: 'explicit', ids: new Set(['2']) },
        onQueryChange: () => {},
      },
      { state: { selection: new Set(['1']) } }
    );
    expect(
      warnings.some(
        (warning) =>
          warning.includes('`server` already controls') &&
          warning.includes('`selection`')
      )
    ).toBe(true);
  });
});

// What a real caller produces, rendered. Everything above is the resolver; these
// prove the resolved value reaches the engine and the callbacks fire.
describe('server.selection — through DataGrid', () => {
  function renderGrid(options: {
    selection: DataGridServerSelection;
    onSelectionChange?: (event: unknown) => void;
    observe?: (event: unknown) => void;
  }) {
    const { selection, onSelectionChange, observe } = options;
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        server={{
          query: queryFor(),
          pageCount: 3,
          selection,
          ...(onSelectionChange === undefined ? {} : { onSelectionChange }),
          onQueryChange: () => {},
        }}
        {...(observe === undefined
          ? {}
          : { callbacks: { onSelectionChange: observe } })}
      />
    );
    return screen.getAllByLabelText('Select row');
  }

  it('ticks exactly the rows the server says are selected', () => {
    const [first, second] = renderGrid({
      selection: { mode: 'explicit', ids: new Set(['2']) },
    });
    expect(first).not.toBeChecked();
    expect(second).toBeChecked();
  });

  it('requests a change without committing it', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const selection: DataGridServerSelection = {
      mode: 'explicit',
      ids: new Set(['2']),
    };
    const [first] = renderGrid({ selection, onSelectionChange });

    await user.click(first!);

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const event = onSelectionChange.mock.calls[0]?.[0];
    // `previous` is the *authoritative* value, asserted by identity: an
    // implementation that reconstructed it from the engine's own prior state
    // would produce an equal-looking set and fail this.
    expect(event.previous).toBe(selection);
    expect(event.selection).toEqual({
      mode: 'explicit',
      ids: new Set(['1', '2']),
    });
    // `cause` is forwarded from the controller's own change event, unmodified —
    // and it is now **`pointer`**, which is the improvement this assertion invited.
    //
    // It used to be `'api'`: the checkbox calls `row.toggleSelected()`, an engine
    // API, so the controller could not see that a pointer drove it, and a screen
    // could not tell a user click from a programmatic selection. #69 carries the
    // provenance across that round-trip (`data-table/data-table-selection-cause.ts`)
    // while leaving the engine to decide *which* rows change.
    //
    // Kept as an assertion on this seam rather than moved, because the value being
    // forwarded **unmodified** is this seam's contract: the change of value proves
    // the forwarding still works and that the fix reached the server path too.
    expect(event.cause).toBe('pointer');
    expect(event.requestKey).toBe(event.query.requestKey);

    // Nothing committed internally: the controlled value still wins, so the box
    // the user clicked is still unticked. This is what separates a controlled
    // slice from a `defaultState` seed, and a version that used the latter would
    // pass every assertion above and fail this one.
    expect(first).not.toBeChecked();
  });

  it('runs the server handler before the observing callback', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const [first] = renderGrid({
      selection: { mode: 'explicit', ids: new Set(['2']) },
      onSelectionChange: () => order.push('server'),
      observe: () => order.push('callback'),
    });

    await user.click(first!);
    expect(order).toEqual(['server', 'callback']);
  });

  it('keeps every other slice callback while wrapping the selection one', async () => {
    // The composition replaces one entry of the slice-callback map and must carry
    // the rest through. Found by a negative control that did *not* fire: dropping
    // the spread passed every other test in this file, because none of them bound
    // a second slice callback alongside a server selection handler. So this binds
    // `onPaginationChange` too and drives it.
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        server={{
          query: queryFor(),
          pageCount: 3,
          selection: { mode: 'explicit', ids: new Set(['2']) },
          onSelectionChange: () => {},
          onQueryChange: () => {},
        }}
        callbacks={{ onPaginationChange }}
      />
    );

    await user.click(screen.getByLabelText('Go to next page'));
    expect(onPaginationChange).toHaveBeenCalledTimes(1);
  });

  it('leaves the observing callback alone with no server selection', async () => {
    // The composition must not clobber the slice map it wraps. Without a server
    // handler there is nothing authoritative, and `callbacks.onSelectionChange`
    // has to keep working exactly as it did before U8 touched this seam.
    const user = userEvent.setup();
    const observe = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        callbacks={{ onSelectionChange: observe }}
      />
    );

    await user.click(screen.getAllByLabelText('Select row')[0]!);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe.mock.calls[0]?.[0]?.value).toEqual(new Set(['1']));
  });
});

// `selection.selectAll` (U8). Three scopes, and the interesting one is the scope
// whose member set DataGrid cannot enumerate.
describe('selection.selectAll', () => {
  const trio: Person[] = [
    { id: '1', name: 'Ada Lovelace' },
    { id: '2', name: 'Grace Hopper' },
    { id: '3', name: 'Alan Turing' },
  ];

  function allResultsToken(
    query: DataTableQuery,
    excludedIds: readonly string[]
  ): DataGridServerSelection {
    return {
      mode: 'all-results',
      queryRequestKey: query.requestKey,
      excludedIds: new Set(excludedIds),
      token: 'srv-token-1',
    };
  }

  function renderAllResults(options: {
    excludedIds?: readonly string[];
    selection?: DataGridServerSelection;
    onSelectionChange?: (event: unknown) => void;
  }) {
    const query = queryFor();
    const selection =
      options.selection ?? allResultsToken(query, options.excludedIds ?? []);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Bound on every render in this block so the engine's own selection slice is
    // observable. It has to be: in all-results mode the checkboxes are derived
    // from `excludedIds`, so a version that *also* committed to the engine would
    // be invisible in the DOM. Found by a negative control that did not fire.
    const engineSelection = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={trio}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{
          query,
          rowCount: 500,
          selection,
          ...(options.onSelectionChange === undefined
            ? {}
            : { onSelectionChange: options.onSelectionChange }),
          onQueryChange: () => {},
        }}
        callbacks={{ onSelectionChange: engineSelection }}
      />
    );
    return { error, query, engineSelection };
  }

  it('derives each checkbox from the exclusions, not from an engine slice', () => {
    renderAllResults({ excludedIds: ['2'] });
    const boxes = screen.getAllByLabelText('Select row');
    // "Everything the query matches except row 2" — so two ticks and one gap,
    // from a set the engine has never held. A version reading the engine's own
    // selection slice renders three empty boxes and fails all three assertions.
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    expect(boxes[2]).toBeChecked();
  });

  it('emits an exclusion delta in both directions and commits neither', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { engineSelection } = renderAllResults({
      excludedIds: ['2'],
      onSelectionChange,
    });
    const boxes = screen.getAllByLabelText('Select row');

    // Re-including an excluded row removes it from the set.
    await user.click(boxes[1]!);
    expect(onSelectionChange.mock.calls[0]?.[0].selection).toEqual({
      mode: 'all-results',
      queryRequestKey: expect.any(String),
      excludedIds: new Set(),
      token: 'srv-token-1',
    });
    // Nothing committed: the controlled token is authoritative, so the box the
    // user clicked has not moved. "without mutating it internally".
    expect(boxes[1]).not.toBeChecked();

    // Excluding an included row adds it, preserving the existing exclusion.
    await user.click(boxes[0]!);
    expect(onSelectionChange.mock.calls[1]?.[0].selection.excludedIds).toEqual(
      new Set(['1', '2'])
    );
    expect(boxes[0]).toBeChecked();

    // And the engine's own slice never moved. This is the assertion the DOM
    // cannot make: the boxes are derived from `excludedIds`, so a version that
    // called `row.toggleSelected()` alongside the request would render
    // identically and pass everything above. `callbacks.onSelectionChange` fires
    // on any engine selection change, so silence here is the proof.
    expect(engineSelection).not.toHaveBeenCalled();
  });

  it('reports the token unchanged and a pointer cause', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { query } = renderAllResults({
      excludedIds: ['2'],
      onSelectionChange,
    });

    await user.click(screen.getAllByLabelText('Select row')[0]!);
    const event = onSelectionChange.mock.calls[0]?.[0];
    // The token and its scope travel untouched — the request is about exclusions,
    // and inventing or re-scoping a token is exactly what DataGrid must not do.
    expect(event.selection.token).toBe('srv-token-1');
    expect(event.selection.queryRequestKey).toBe(query.requestKey);
    // `pointer`, unlike the engine path — this handler runs at the click, so the
    // provenance has not been lost. See task #69.
    expect(event.cause).toBe('pointer');
  });

  it('shows the header as fully checked only with no exclusions', () => {
    const first = render(<div />);
    first.unmount();
    renderAllResults({ excludedIds: [] });
    expect(screen.getByLabelText('Select all rows')).toBeChecked();
  });

  it('clears the exclusions when a mixed header control is activated', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderAllResults({ excludedIds: ['2'], onSelectionChange });

    const header = screen.getByLabelText('Select all rows');
    expect(header).not.toBeChecked();
    await user.click(header);
    expect(onSelectionChange.mock.calls[0]?.[0].selection.excludedIds).toEqual(
      new Set()
    );
  });

  it('requests no selection at all when deselecting everything', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderAllResults({ excludedIds: [], onSelectionChange });

    await user.click(screen.getByLabelText('Select all rows'));
    // Deselect-all is the absence of a selection, not a token excluding every
    // loaded id — the latter would claim exclusions for rows never sent.
    expect(onSelectionChange.mock.calls[0]?.[0].selection).toBeUndefined();
  });

  it('reports an all-results request the server cannot honor', () => {
    // `all-results` asked for, but the server supplied an `explicit` selection, so
    // there is no token and DataGrid must not pretend otherwise. Only the warning
    // is asserted here: with an explicit controlled selection the ordinary server
    // reporting path is legitimately live, so behaviour is not a clean signal.
    // The isolated fallback is the next test.
    const { error } = renderAllResults({
      selection: { mode: 'explicit', ids: new Set() },
    });
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('no usable `server.selection` token')
    );
  });

  it('falls back to an ordinary loaded-scope select-all with no token at all', async () => {
    // The isolated fallback: server mode with no `server.selection` whatsoever, so
    // nothing is controlled and the engine owns selection. It must degrade to a
    // working select-all rather than disabling the control or faking all-results —
    // and it selects all three loaded rows, so the fallback scope is `loaded`.
    const user = userEvent.setup();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <DataGrid
        columns={columns}
        rows={trio}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAll: 'all-results' }}
        server={{ query: queryFor(), rowCount: 500, onQueryChange: () => {} }}
      />
    );

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'requires an application-issued `server.selection`'
      )
    );
    await user.click(screen.getByLabelText('Select all rows'));
    expect(screen.getAllByLabelText('Select row')).toHaveLength(3);
    for (const box of screen.getAllByLabelText('Select row')) {
      expect(box).toBeChecked();
    }
  });

  it('scopes the header to the page or to every loaded row', async () => {
    // The sharpest discriminator for the scope switch, and it needs the observing
    // callback rather than the DOM: with `pageSize: 2` only two rows render, so
    // counting ticked boxes cannot see a third selected row on page 2.
    async function selectedCountFor(
      selectAll: 'page' | 'loaded' | undefined
    ): Promise<number> {
      const user = userEvent.setup();
      const observe = vi.fn();
      const view = render(
        <DataGrid
          columns={columns}
          rows={trio}
          getRowId={(row) => row.id}
          selection={{
            mode: 'multiple',
            ...(selectAll === undefined ? {} : { selectAll }),
          }}
          pagination={{ pageSize: 2 }}
          callbacks={{ onSelectionChange: observe }}
        />
      );
      await user.click(screen.getByLabelText('Select all rows'));
      const size = (observe.mock.calls[0]?.[0].value as ReadonlySet<string>)
        .size;
      view.unmount();
      return size;
    }

    expect(await selectedCountFor('page')).toBe(2);
    expect(await selectedCountFor('loaded')).toBe(3);
    // Unset, paginated → page (design §6.1). This is the assertion that fails if
    // the default is resolved eagerly: `selection` resolves before `pagination`,
    // so a resolve-time default cannot see that the grid paginates.
    expect(await selectedCountFor(undefined)).toBe(2);
  });

  it('reads the header tri-state over the loaded rows, not the page', async () => {
    // Discriminates the `loaded` scope's *predicates*, which the count assertions
    // above cannot: they measure the toggle. With `pageSize: 2` over three rows,
    // ticking both visible rows is 2-of-2 on the page but 2-of-3 loaded — so the
    // page predicate would report fully checked and the loaded one mixed.
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={trio}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple', selectAll: 'loaded' }}
        pagination={{ pageSize: 2 }}
      />
    );

    const boxes = screen.getAllByLabelText('Select row');
    expect(boxes).toHaveLength(2);
    await user.click(boxes[0]!);
    await user.click(boxes[1]!);

    const header = screen.getByLabelText('Select all rows');
    expect(header).toHaveAttribute('aria-checked', 'mixed');
  });

  it('defaults to the loaded scope when the grid does not paginate', async () => {
    // The other half of the same default. Without it, "unset → page" above is
    // satisfied by hardcoding `page`.
    const user = userEvent.setup();
    const observe = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={trio}
        getRowId={(row) => row.id}
        selection={{ mode: 'multiple' }}
        callbacks={{ onSelectionChange: observe }}
      />
    );
    await user.click(screen.getByLabelText('Select all rows'));
    expect((observe.mock.calls[0]?.[0].value as ReadonlySet<string>).size).toBe(
      3
    );
  });
});
