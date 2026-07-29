import type { ColumnDef, Row } from '@tanstack/react-table';
import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDataTable } from '../data-table-controller';
import { createDefaultDataTableState } from '../data-table-state';
import {
  UNSHIPPED_DISPLAY_ROW_KINDS,
  deriveDisplayRows,
  displayRowKey,
  encodeRowIdForDom,
  type DataTableDisplayRow,
} from '../data-table-display-rows';
import { DATA_TABLE_FEATURES } from '../data-table-features';
import { detailRowDomId } from '../data-table-features/detail-expansion';
import {
  FEATURE_ORDER,
  composeColumnPresentation,
  composeEngineOptions,
  graftedData,
  composeRowPresentation,
  defineDataTableFeature,
  mergeRenderContextFields,
  renderDisplayRow,
  type DataTableDisplayRowContext,
  type DataTableDisplayRowContextBase,
  type DataTableFeatureContextBase,
  type DataTableFeatureModule,
  type DataTableViewContextBase,
} from '../data-table-features/registry';
import { DataTableRoot } from '../data-table-root';
import { DataTableView } from '../data-table-view';

interface Person {
  readonly id: string;
  readonly name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];

const rows: Person[] = [
  { id: 'person-0', name: 'Ada' },
  { id: 'person-1', name: 'Grace' },
];

const NO_CONFIGS = {} as const;

/**
 * A minimal **base** context for exercising a composer in isolation. The
 * composers take the base and attach each module's own config and bound
 * `graftData` themselves — handing them a module-facing context does not compile,
 * which is the forcing function.
 */
function fakeContext(): DataTableFeatureContextBase<Person, string> {
  return {
    table: () => {
      throw new Error('the composers must not call table() eagerly');
    },
    // A REAL default state, not `{}`. The controller always hands modules a
    // complete state (`createDefaultDataTableState`), so a module reading a slice
    // in `engineOptions` is doing something legitimate — `grouping.tsx` reads
    // `state.grouping` to decide whether to install the grouped row model. An empty
    // cast made this fake the only place that shape could occur, and it failed with
    // a bare "Cannot read properties of undefined" that pointed at the module
    // rather than at the fake.
    state: createDefaultDataTableState(),
    gates: {} as never,
    tableId: 'T',
    requestChange: (() => undefined) as never,
    data: rows,
  };
}

describe('DataTable feature registry — committed order', () => {
  // Design §3.5's pipeline order is executable rather than a comment, so it needs
  // pinning: order decides display-row sequence within a record row, the order
  // `effects` hooks run, and adornment ties within one placement.
  it('matches design §3.5 and the manifest, in the same order', () => {
    expect(DATA_TABLE_FEATURES.map((feature) => feature.id)).toEqual([
      ...FEATURE_ORDER,
    ]);
  });

  it('declares each feature exactly once', () => {
    const ids = DATA_TABLE_FEATURES.map((feature) => feature.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps the pipeline stages in their §3.5 relative order', () => {
    const at = (id: string) => FEATURE_ORDER.indexOf(id as never);
    // core/tree relationships -> filter -> group roots -> sort -> paginate
    expect(at('tree')).toBeLessThan(at('filtering'));
    expect(at('filtering')).toBeLessThan(at('grouping'));
    expect(at('grouping')).toBeLessThan(at('sorting'));
    expect(at('sorting')).toBeLessThan(at('pagination'));
    // A detail row is a projection of a record already on the page, so it is
    // derived after pagination (ADR-0001, OQ-1).
    expect(at('pagination')).toBeLessThan(at('detail-expansion'));
    // Virtual presentation is last, and persistence restores into everything.
    expect(at('virtualization')).toBeLessThan(at('persistence'));
  });
});

describe('DataTable feature registry — collision rule', () => {
  it('throws when two modules set the same engine option, naming both', () => {
    const left = defineDataTableFeature<Person>({
      id: 'sorting',
      engineOptions: () => ({ enableMultiSort: true }),
    });
    const right = defineDataTableFeature<Person>({
      id: 'grouping',
      engineOptions: () => ({ enableMultiSort: false }),
    });

    expect(() =>
      composeEngineOptions([left, right], fakeContext(), NO_CONFIGS)
    ).toThrow(
      /"sorting" and "grouping" both set engine option "enableMultiSort"/
    );
  });

  // The check is deliberately ACROSS modules, not within one call: a single
  // feature legitimately contributes several keys at once, and the sorting option
  // group is exactly that case.
  it('allows one module to contribute several keys at once', () => {
    const sorting = defineDataTableFeature<Person>({
      id: 'sorting',
      engineOptions: () => ({
        enableMultiSort: true,
        enableSortingRemoval: true,
        sortDescFirst: false,
        maxMultiSortColCount: 3,
      }),
    });

    expect(composeEngineOptions([sorting], fakeContext(), NO_CONFIGS)).toEqual({
      enableMultiSort: true,
      enableSortingRemoval: true,
      sortDescFirst: false,
      maxMultiSortColCount: 3,
    });
  });

  // `data` is a contended key by design as of the lazy-children work: the `tree`
  // feature owns it, because it is what forces `getCoreRowModel`'s
  // identity-keyed memo to re-walk when fetched children arrive. The second
  // feature to want it will not have read that exchange, so the throw has to name
  // the key and both claimants rather than merely happening.
  it('names both modules and the key when two contend for `data`', () => {
    const rows = [{ id: 'a' }] as unknown as Person[];
    const tree = defineDataTableFeature<Person>({
      id: 'tree',
      engineOptions: () => ({ data: rows }),
    });
    const other = defineDataTableFeature<Person>({
      id: 'virtualization',
      engineOptions: () => ({ data: rows }),
    });

    expect(() =>
      composeEngineOptions([tree, other], fakeContext(), NO_CONFIGS)
    ).toThrow(
      /feature modules "tree" and "virtualization" both set engine option "data"/
    );
  });

  it('skips undefined contributions rather than reserving the key', () => {
    const left = defineDataTableFeature<Person>({
      id: 'sorting',
      engineOptions: () => ({ enableMultiSort: undefined }),
    });
    const right = defineDataTableFeature<Person>({
      id: 'grouping',
      engineOptions: () => ({ enableMultiSort: true }),
    });

    expect(
      composeEngineOptions([left, right], fakeContext(), NO_CONFIGS)
    ).toEqual({ enableMultiSort: true });
  });

  it('does not evaluate the table accessor while composing', () => {
    // `fakeContext().table()` throws. The composers build closures that will call
    // it later, so composing must never reach it — this is the eager-table hazard
    // in unit-test form.
    expect(() =>
      composeEngineOptions(DATA_TABLE_FEATURES, fakeContext(), NO_CONFIGS)
    ).not.toThrow();
  });

  it('throws when two modules contribute the same render-context field', () => {
    const resolvers = [
      { featureId: 'tree' as const, resolve: () => ({ tree: {} }) },
      { featureId: 'grouping' as const, resolve: () => ({ tree: {} }) },
    ];

    expect(() =>
      mergeRenderContextFields('row context field', resolvers, undefined)
    ).toThrow(/"tree" and "grouping" both set row context field "tree"/);
  });
});

describe('graftedData — the per-arrival copy for a `data` contribution', () => {
  // These two assertions ARE the guarantee. `getCoreRowModel` is memoized on
  // `data` identity alone, so copy too rarely and lazily-loaded children never
  // appear; copy every render and the row model rebuilds continuously instead of
  // never. The second is correctness-neutral, which is exactly why it needs a test
  // rather than a comment.
  const rows: Person[] = [{ id: 'a', name: 'Ada' }];

  it('returns the caller array UNCHANGED before anything has arrived', () => {
    // Not a copy and not an empty array: the inert path must be genuinely inert,
    // or every table pays for a feature nothing has used yet.
    expect(graftedData(rows, 0)).toBe(rows);
  });

  it('is referentially stable across renders within one generation', () => {
    const first = graftedData(rows, 1);

    expect(graftedData(rows, 1)).toBe(first);
    expect(graftedData(rows, 1)).toBe(first);
  });

  it('yields exactly one new identity per arrival', () => {
    const g1 = graftedData(rows, 1);
    const g2 = graftedData(rows, 2);

    expect(g1).not.toBe(rows);
    expect(g2).not.toBe(g1);
    // Same contents — the copy exists to change identity, not membership. The
    // children themselves arrive through `getSubRows`, which already returns them.
    expect(g2).toEqual(rows);
  });

  it('keys on the array, so two tables sharing a generation do not collide', () => {
    const other: Person[] = [{ id: 'b', name: 'Grace' }];

    expect(graftedData(rows, 1)).not.toBe(graftedData(other, 1));
    expect(graftedData(other, 1)).toEqual(other);
  });
});

describe('DataTable feature registry — display rows', () => {
  function viewContext(
    recordRows: readonly Row<Person>[]
  ): DataTableViewContextBase<Person, string> {
    return {
      ...fakeContext(),
      visibleColumnCount: 1,
      recordRows,
      viewProps: {},
    };
  }

  const fakeRow = (id: string, depth = 0) =>
    ({ id, depth, subRows: [] }) as unknown as Row<Person>;

  it('derives one data row per record, in record order', () => {
    const recordRows = [fakeRow('a'), fakeRow('b')];

    expect(
      deriveDisplayRows({
        recordRows,
        modules: [],
        configs: NO_CONFIGS,
        viewContext: viewContext(recordRows),
      })
    ).toEqual([
      { kind: 'data', row: recordRows[0], depth: 0, recordIndex: 0 },
      { kind: 'data', row: recordRows[1], depth: 0, recordIndex: 1 },
    ]);
  });

  it('appends a feature contribution after its record row', () => {
    const recordRows = [fakeRow('a'), fakeRow('b')];
    const appender = defineDataTableFeature<Person>({
      id: 'detail-expansion',
      displayRows: (ctx) =>
        ctx.row.id === 'a'
          ? [
              {
                kind: 'detail',
                parent: ctx.row,
                recordIndex: ctx.recordIndex,
                domId: 'd',
              },
            ]
          : [],
    });

    const derived = deriveDisplayRows({
      recordRows,
      modules: [appender],
      configs: NO_CONFIGS,
      viewContext: viewContext(recordRows),
    });

    expect(derived.map((row) => row.kind)).toEqual(['data', 'detail', 'data']);
    // The appended row carries its parent's RECORD index, which is what keeps
    // roving focus and striping on records (ADR-0001 consequence 6).
    expect(derived[1]).toMatchObject({ recordIndex: 0 });
  });

  it('lets one feature reclassify a record row', () => {
    const recordRows = [fakeRow('a')];
    const grouper = defineDataTableFeature<Person>({
      id: 'grouping',
      classifyDisplayRow: (ctx) => ({
        kind: 'group',
        row: ctx.row,
        groupId: 'g1',
        depth: 0,
        recordIndex: ctx.recordIndex,
      }),
    });

    expect(
      deriveDisplayRows({
        recordRows,
        modules: [grouper],
        configs: NO_CONFIGS,
        viewContext: viewContext(recordRows),
      }).map((row) => row.kind)
    ).toEqual(['group']);
  });

  it('throws when two features classify the same record row', () => {
    const recordRows = [fakeRow('a')];
    const classify = (id: DataTableFeatureModule['id']) =>
      defineDataTableFeature<Person>({
        id,
        classifyDisplayRow: (
          ctx: DataTableDisplayRowContext<Person, string>
        ) => ({
          kind: 'group',
          row: ctx.row,
          groupId: id,
          depth: 0,
          recordIndex: ctx.recordIndex,
        }),
      });

    expect(() =>
      deriveDisplayRows({
        recordRows,
        modules: [classify('grouping'), classify('tree')],
        configs: NO_CONFIGS,
        viewContext: viewContext(recordRows),
      })
    ).toThrow(/"grouping" and "tree" both classified row "a"/);
  });

  it('collects table-scoped rows after every record row', () => {
    const recordRows = [fakeRow('a'), fakeRow('b')];
    const footer = defineDataTableFeature<Person>({
      id: 'footer',
      tableDisplayRows: () => [{ kind: 'footer', scope: 'table' }],
    });

    expect(
      deriveDisplayRows({
        recordRows,
        modules: [footer],
        configs: NO_CONFIGS,
        viewContext: viewContext(recordRows),
      }).map((row) => row.kind)
    ).toEqual(['data', 'data', 'footer']);
  });

  it('gives every kind a distinct, stable key', () => {
    const parent = fakeRow('a');
    const keys = [
      displayRowKey({ kind: 'data', row: parent, depth: 0, recordIndex: 0 }),
      displayRowKey({
        kind: 'detail',
        parent,
        recordIndex: 0,
        domId: 'd',
      }),
      displayRowKey({
        kind: 'group',
        row: parent,
        groupId: 'g',
        depth: 0,
        recordIndex: 0,
      }),
      displayRowKey({
        kind: 'tree-status',
        parent,
        recordIndex: 0,
        status: 'loading',
        domId: 't',
      }),
      displayRowKey({ kind: 'footer', scope: 'table' }),
    ];

    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('DataTable feature registry — unshipped display-row kinds', () => {
  // Done item 5. F2 ships the dispatch for `group`, `tree-status` and `footer`
  // but no renderer for any of them. A kind that rendered nothing would be a
  // blank row nobody could trace back to a missing module, so it throws.
  it.each(UNSHIPPED_DISPLAY_ROW_KINDS)(
    'fails loudly rather than rendering nothing for kind "%s"',
    (kind) => {
      const parent = {
        id: 'a',
        depth: 0,
        subRows: [],
      } as unknown as Row<Person>;
      const displayRow = {
        footer: { kind: 'footer', scope: 'table' },
        group: {
          kind: 'group',
          row: parent,
          groupId: 'g',
          depth: 0,
          recordIndex: 0,
        },
        'tree-status': {
          kind: 'tree-status',
          parent,
          recordIndex: 0,
          status: 'loading',
          domId: 't',
        },
      }[kind] as DataTableDisplayRow<Person>;

      expect(() =>
        renderDisplayRow(
          DATA_TABLE_FEATURES,
          displayRow,
          {
            ...fakeContext(),
            visibleColumnCount: 1,
            recordRows: [],
            viewProps: {},
          },
          NO_CONFIGS
        )
      ).toThrow(new RegExp(`kind "${kind}" has no renderer`));
    }
  );

  it('dispatches the shipped detail kind to the feature that owns it', () => {
    const parent = {
      id: 'a',
      depth: 0,
      subRows: [],
      getVisibleCells: () => [{}],
      original: rows[0],
    } as unknown as Row<Person>;

    expect(() =>
      renderDisplayRow(
        DATA_TABLE_FEATURES,
        { kind: 'detail', parent, recordIndex: 0, domId: 'd' },
        {
          ...fakeContext(),
          visibleColumnCount: 1,
          recordRows: [],
          viewProps: { renderExpandedRow: () => 'x' },
        },
        NO_CONFIGS
      )
    ).not.toThrow();
  });
});

describe('DataTable feature registry — presentation', () => {
  const rowCtx = () =>
    ({
      ...fakeContext(),
      visibleColumnCount: 1,
      recordRows: [],
      viewProps: {},
      row: { id: 'a', depth: 0, subRows: [] } as unknown as Row<Person>,
      recordIndex: 0,
      isFirstRecord: true,
      isLastRecord: true,
    }) as DataTableDisplayRowContextBase<Person, string>;

  it('accumulates row classes and styles across features', () => {
    const left = defineDataTableFeature<Person>({
      id: 'grouping',
      rowPresentation: () => ({ className: 'a', style: { top: 1 } }),
    });
    const right = defineDataTableFeature<Person>({
      id: 'tree',
      rowPresentation: () => ({ className: 'b', style: { left: 2 } }),
    });

    expect(composeRowPresentation([left, right], rowCtx(), NO_CONFIGS)).toEqual(
      { className: 'a b', style: { top: 1, left: 2 } }
    );
  });

  // Classes accumulate because several features legitimately decorate one row.
  // The discrete flags do not: two features disagreeing about whether a row is
  // expanded is a bug, not a merge.
  it('throws when two features set the same discrete row flag', () => {
    const left = defineDataTableFeature<Person>({
      id: 'grouping',
      rowPresentation: () => ({ sticky: true }),
    });
    const right = defineDataTableFeature<Person>({
      id: 'tree',
      rowPresentation: () => ({ sticky: false }),
    });

    expect(() =>
      composeRowPresentation([left, right], rowCtx(), NO_CONFIGS)
    ).toThrow(/both set row presentation "sticky"/);
  });

  it('orders header adornments by placement, not by manifest position', () => {
    const edge = defineDataTableFeature<Person>({
      id: 'columns',
      columnPresentation: () => ({
        headerAdornments: [
          { id: 'resize', placement: 'edge', node: null },
          { id: 'before', placement: 'before-label', node: null },
        ],
      }),
    });
    const after = defineDataTableFeature<Person>({
      id: 'sorting',
      columnPresentation: () => ({
        headerAdornments: [
          { id: 'after', placement: 'after-label', node: null },
        ],
      }),
    });

    const composed = composeColumnPresentation(
      [edge, after],
      { ...rowCtx(), column: {} as never },
      NO_CONFIGS
    );

    expect(composed.headerAdornments?.map((a) => a.id)).toEqual([
      'before',
      'after',
      'resize',
    ]);
  });

  it('throws on a duplicate adornment id across features', () => {
    const make = (id: DataTableFeatureModule['id']) =>
      defineDataTableFeature<Person>({
        id,
        columnPresentation: () => ({
          headerAdornments: [{ id: 'grip', placement: 'edge', node: null }],
        }),
      });

    expect(() =>
      composeColumnPresentation(
        [make('columns'), make('grouping')],
        { ...rowCtx(), column: {} as never },
        NO_CONFIGS
      )
    ).toThrow(/both set header adornment "grip"/);
  });
});

describe('DataTable ARIA id schemes (design §7)', () => {
  it('encodes a row ID URL-safely, without padding', () => {
    expect(encodeRowIdForDom('person-1')).toBe('cGVyc29uLTE');
    // A caller-supplied row ID may contain characters an `id` cannot carry.
    expect(encodeRowIdForDom('a/b+c=')).not.toMatch(/[/+=]/);
  });

  it('roots the detail panel id at the table id', () => {
    expect(detailRowDomId('grid-1', 'person-1')).toBe(
      'grid-1--detail--cGVyc29uLTE'
    );
  });

  it('exposes a stable tableId on the controller for both halves to share', () => {
    const { result, rerender } = renderHook(() =>
      useDataTable({ columns, data: rows, getRowId: (row) => row.id })
    );
    const first = result.current.tableId;

    rerender();

    expect(first).toBeTruthy();
    expect(result.current.tableId).toBe(first);
  });

  it('stamps the detail panel id on the rendered detail row', () => {
    function Harness() {
      const controller = useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        detailExpansion: {},
        defaultState: { detailExpanded: new Set(['person-0']) },
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person>
            renderExpandedRow={(row) => <span>Detail {row.original.id}</span>}
          />
        </DataTableRoot>
      );
    }

    render(<Harness />);
    const panel = screen.getByText('Detail person-0').closest('tr');

    // `aria-controls` can only point at an element that exists, so the id has to
    // be on the row for U1's expander button to reference it.
    expect(panel?.id).toMatch(/--detail--cGVyc29uLTA$/);
  });

  /* ── #79 Q1 · a disclosing record row is painted as expanded ──────────────
     Before this, a table could hold two disclosure mechanisms and paint only one
     of them open: a grouping header carries `data-expanded` (set directly on the
     row grouping renders) and a record row with an open detail panel did not.

     The route is `rowPresentation`, which `composeRowPresentation` invokes ONLY
     from `renderRecordRow` — the one seam that reaches a row the VIEW renders.
     That is why #50's sweep kept `DataTableRowPresentation.expanded` instead of
     deleting it, and these assertions are what fill it by use. */
  it('paints a record row as expanded while its detail panel is open', () => {
    function Harness() {
      const controller = useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        detailExpansion: {},
        defaultState: { detailExpanded: new Set(['person-0']) },
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person>
            renderExpandedRow={(row) => <span>Detail {row.original.id}</span>}
          />
        </DataTableRoot>
      );
    }

    render(<Harness />);
    const panel = screen.getByText('Detail person-0').closest('tr');
    const record = panel?.previousElementSibling;

    // The RECORD row, not the panel: `previousElementSibling` rather than a text
    // lookup, because the assertion is about the row the disclosure belongs to.
    expect(record).toHaveAttribute('data-expanded', 'true');
    // Still not `aria-expanded` — invalid on a row inside `role="table"`, removed
    // in 893bad2 and carried by U1's expander button instead. `expanded` is a
    // styling channel only.
    expect(record).not.toHaveAttribute('aria-expanded');

    // A CLOSED record is the discriminator: without it this would pass against an
    // implementation that marked every row.
    const closed = screen.getByText('Grace').closest('tr');
    expect(closed).not.toHaveAttribute('data-expanded');
  });

  it('does not paint a row expanded when there is no panel to disclose', () => {
    // `detailExpansion: {}` with NO renderer is supported: the caller wants
    // expansion state only and no panel row is emitted. Such a row discloses
    // nothing, so painting it open would assert something the table does not show.
    // This is the case that makes the renderer half of `detailPanelIsOpen`
    // load-bearing rather than defensive — state alone is not the question.
    function Harness() {
      const controller = useDataTable({
        columns,
        data: rows,
        getRowId: (row) => row.id,
        detailExpansion: {},
        defaultState: { detailExpanded: new Set(['person-0']) },
      });

      return (
        <DataTableRoot table={controller}>
          <DataTableView<Person> />
        </DataTableRoot>
      );
    }

    render(<Harness />);
    const record = screen.getByText('Ada').closest('tr');

    expect(record).not.toHaveAttribute('data-expanded');
    // And no panel row was emitted either, which is the pre-existing behaviour
    // this must not have changed.
    expect(screen.queryByText(/^Detail /)).toBeNull();
  });
});
