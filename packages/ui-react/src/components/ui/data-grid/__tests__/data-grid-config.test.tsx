import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';

import {
  DATA_GRID_CHROME_SLOTS,
  DATA_GRID_CONFIG_MODULES,
  DATA_GRID_CONFIG_PROP_KEYS,
  buildGroupedConfigAliases,
  composeColumns,
  composeControllerOptions,
  composeViewProps,
  renderChromeSlot,
  type DataGridConfigModule,
} from '../data-grid-config';

// The registry's own invariants (ADR-0002). The behavior each module produces is
// covered by `data-grid.test.tsx`; this file guards the two properties that make
// the registry safe rather than merely tidy — a committed order, and additive,
// collision-checked contributions.

/** A synthetic module. The registry's key type is closed, so tests widen. */
function fakeModule(module: {
  key: string;
  controllerOptions?: () => Record<string, unknown>;
  viewProps?: () => Record<string, unknown>;
  columns?: (
    columns: readonly ColumnDef<unknown, unknown>[]
  ) => readonly ColumnDef<unknown, unknown>[];
  chrome?: (slot: string) => unknown;
}): DataGridConfigModule {
  return {
    kind: 'grouped',
    aliases: [],
    resolve: () => ({ value: undefined }),
    ...module,
  } as unknown as DataGridConfigModule;
}

const anyContext = {} as never;

describe('DataGrid config registry', () => {
  // Both pins below fail when a module is added, which is their job. What they used
  // to do badly is fail *mutely*: U5 registered `footer` and left this suite red
  // without knowing it owed the update. The messages now say what to do.
  const PIN_FIX =
    'The manifest (data-grid-config/index.ts) is the source of truth. If you just ' +
    'added a config module, append your key here in the same position. This pin is ' +
    'the third of three shared edits a new group owes — manifest entry, ' +
    'data-grid/index.ts barrel line, and these two pins.';

  it('pins the committed module order', () => {
    // One order drives resolution, the column pipeline, controller options, and
    // chrome. Resolution needs `server` before `pagination`/`callbacks` and
    // `filters` before `toolbar`; `state` is last because it merges `server`'s
    // controlled query slices and `pagination`'s initial page into the two state
    // options it owns. The column fold needs `filters` before `actions` before
    // `selection`, because position is placement. `columnsFeatures` sits after
    // `sorting` (both write the header cell) and before `actions`/`selection`,
    // whose spliced column ids are what its `lockSystemColumns` resolves to.
    expect(
      DATA_GRID_CONFIG_MODULES.map((module) => module.key),
      PIN_FIX
    ).toEqual([
      'dataState',
      'appearance',
      'rowInteraction',
      'sorting',
      'columnsFeatures',
      'filters',
      'tree',
      'actions',
      'detailExpansion',
      'selection',
      'server',
      'callbacks',
      'pagination',
      'footer',
      // Position is free — `grouping` contributes no column, and its `resolve`
      // reads only `appearance` and `selection`, both far earlier.
      'grouping',
      // Position free — no column contribution, and the bounded-height
      // precondition is a DOM check rather than a resolution dependency.
      'virtualization',
      'toolbar',
      // Position is free — no `columns` transform and a `resolve` that reads
      // nothing from `resolved`. Placed here to mirror the DataTable registry,
      // where `persistence` is last because it restores into the slices every
      // other feature owns. Before `state`, which must stay last.
      'persistence',
      'state',
    ]);
  });

  it('derives the preset-addressable groups and their aliases', () => {
    // Replaces the hand-listed `satisfies Record<keyof DataGridGroupedConfig, …>`
    // total record that used to make `data-grid.tsx` fail to compile on every
    // new group.
    expect(
      buildGroupedConfigAliases(DATA_GRID_CONFIG_MODULES),
      PIN_FIX
    ).toEqual({
      selection: ['selectable', 'selectionMode', 'isRowSelectable'],
      sorting: ['sortable', 'multiSort'],
      filters: ['searchKey', 'searchPlaceholder'],
      pagination: ['pageSize', 'pageSizeOptions'],
      toolbar: ['bulkActions'],
      actions: [],
      detailExpansion: [],
      // No deprecated flat aliases: `columnsFeatures` is new surface, so there is
      // no shipped boolean prop for it to normalize.
      columnsFeatures: [],
      // Same: `tree` is new surface. The shipped `getSubRows` route is a
      // DataTable-level prop, not a DataGrid flat alias, so there is nothing here
      // for it to normalize.
      tree: [],
      // Same: `footer` is new surface with no shipped boolean to normalize.
      footer: [],
      // Same: `grouping` is new DataGrid surface. The grouped columns arrive
      // through the `grouping` state slice, which is a slice rather than a flat
      // alias, so there is nothing here for it to normalize either.
      grouping: [],
      // Same: `virtualization` is new DataGrid surface with no shipped boolean to
      // normalize.
      virtualization: [],
      // Same: `persistence` is new surface. Legacy had no boolean prop for it —
      // its parity behaviour (restoring hidden columns and widths) was implicit in
      // the old preferences code rather than switched on by a prop, so there is
      // nothing for this group to normalize from.
      persistence: [],
      appearance: ['striped'],
      dataState: ['state', 'error', 'onRetry', 'emptyMessage', 'skeletonRows'],
      rowInteraction: [
        'currentRow',
        'onRowClick',
        'onRowActivate',
        'onRowHover',
      ],
    });
  });

  it('keeps top-level inputs out of preset reach', () => {
    const grouped = buildGroupedConfigAliases(DATA_GRID_CONFIG_MODULES);
    // `server`, `callbacks` and `state` resolve like a group but are ownership
    // inputs (design §5.2), so a preset must not be able to address them.
    expect(grouped).not.toHaveProperty('server');
    expect(grouped).not.toHaveProperty('callbacks');
    expect(grouped).not.toHaveProperty('state');
    expect(
      DATA_GRID_CONFIG_MODULES.filter(
        (module) => module.kind === 'top-level'
      ).map((module) => module.key)
    ).toEqual(['server', 'callbacks', 'state']);
  });

  it('collects every prop resolution reads, without duplicates', () => {
    const keys = DATA_GRID_CONFIG_PROP_KEYS;
    expect(new Set(keys).size).toBe(keys.length);
    // A grouped module's key is its prop, so it is implicit …
    expect(keys).toContain('selection');
    // … along with its deprecated aliases and its declared extra reads.
    expect(keys).toContain('selectable');
    expect(keys).toContain('onCellClick');
    // A top-level module declares what it reads.
    expect(keys).toContain('server');
  });

  it('keeps `callbacks` out of the resolution dependencies', () => {
    // The callbacks module resolves nothing and projects per render, so a caller
    // passing `callbacks` as an object literal does not re-resolve every group —
    // and therefore does not rebuild the column set and TanStack's memoized row
    // model on every render.
    expect(DATA_GRID_CONFIG_PROP_KEYS).not.toContain('callbacks');
  });

  it('folds column transforms in manifest order', () => {
    const modules = [
      fakeModule({
        key: 'first',
        columns: (columns) => [...columns, { id: 'a' }],
      }),
      fakeModule({
        key: 'second',
        columns: (columns) => [{ id: 'b' }, ...columns],
      }),
    ];

    expect(
      composeColumns([{ id: 'base' }], modules, anyContext).map(
        (column) => column.id
      )
    ).toEqual(['b', 'base', 'a']);
  });

  it('throws when two modules set the same controller option', () => {
    const modules = [
      fakeModule({
        key: 'first',
        controllerOptions: () => ({ pagination: true }),
      }),
      fakeModule({
        key: 'second',
        controllerOptions: () => ({ pagination: false }),
      }),
    ];

    expect(() => composeControllerOptions(modules, anyContext)).toThrow(
      /"first" and "second" both set controller option "pagination"/
    );
  });

  it('throws when two modules set the same view prop', () => {
    const modules = [
      fakeModule({ key: 'first', viewProps: () => ({ striped: true }) }),
      fakeModule({ key: 'second', viewProps: () => ({ striped: false }) }),
    ];

    expect(() => composeViewProps(modules, anyContext)).toThrow(
      /"first" and "second" both set view prop "striped"/
    );
  });

  it('treats an undefined contribution as no contribution', () => {
    // Otherwise every module that conditionally opts out would collide with the
    // one that actually sets the option.
    const modules = [
      fakeModule({
        key: 'first',
        controllerOptions: () => ({ rowCount: undefined }),
      }),
      fakeModule({ key: 'second', controllerOptions: () => ({ rowCount: 7 }) }),
    ];

    expect(composeControllerOptions(modules, anyContext)).toEqual({
      rowCount: 7,
    });
  });

  it('collects chrome per slot in manifest order and drops empties', () => {
    const modules = [
      fakeModule({
        key: 'first',
        chrome: (slot) => (slot === 'top' ? 'A' : null),
      }),
      fakeModule({ key: 'second', chrome: () => null }),
      fakeModule({
        key: 'third',
        chrome: (slot) => (slot === 'top' ? 'C' : null),
      }),
    ];

    expect(renderChromeSlot('top', modules, anyContext)).toEqual([
      { key: 'first', node: 'A' },
      { key: 'third', node: 'C' },
    ]);
    expect(renderChromeSlot('bottom', modules, anyContext)).toEqual([]);
  });

  it('exposes every chrome slot the grid renders', () => {
    expect(DATA_GRID_CHROME_SLOTS).toEqual([
      'top',
      'toolbar',
      'under-toolbar',
      'bottom',
    ]);
  });
});
