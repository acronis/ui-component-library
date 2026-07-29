import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { describe, expectTypeOf, it } from 'vitest';

import type { DataGridProps } from '../../data-grid';
// Namespace form of the same barrel, so each name can be asserted individually
// rather than as one all-or-nothing import — which is what lets the DataGrid block
// below say WHICH hop dropped a type instead of only that some hop did.
import type * as DataGridPublic from '../../data-grid';
// Library-internal: the derived halves of the DataGrid prop surface. Not exported
// from the package barrel — the assertions below are about how the surface is
// *composed*, which is not public API.
import type {
  DataGridDeprecatedAliases,
  DataGridOwnProps,
} from '../../data-grid/data-grid-config';
import type { TableHeadProps, TableRowProps } from '../../table';
import type * as DataTablePublic from '../index';
import type { DataTableProps } from '../index';
// The package root barrel, reached through source rather than the package
// specifier — see the reachability assertion at the bottom of this file for why
// `from '@constructor-lab/ui-react'` is not the executable form of that check.
import type * as PackageRoot from '../../../../index';

interface Person {
  id: string;
  name: string;
}

describe('table family public types', () => {
  it('characterizes the current DataTable prop surface', () => {
    expectTypeOf<keyof DataTableProps<Person, unknown>>().toEqualTypeOf<
      | 'columns'
      | 'data'
      | 'getRowCanExpand'
      | 'renderExpandedRow'
      | 'striped'
      | 'bordered'
      | 'highlightCurrentRow'
      | 'skeleton'
      | 'skeletonRows'
    >();
    expectTypeOf<DataTableProps<Person, unknown>>().toEqualTypeOf<{
      columns: ColumnDef<Person, unknown>[];
      data: Person[];
      getRowCanExpand?: (row: Row<Person>) => boolean;
      renderExpandedRow?: (row: Row<Person>) => ReactNode;
      striped?: boolean;
      bordered?: boolean;
      highlightCurrentRow?: boolean;
      skeleton?: boolean;
      skeletonRows?: number;
    }>();
  });

  // The exhaustive `keyof DataGridProps` assertion this replaces was a single
  // contended line: every unit that adds a behavior group would have had to edit
  // it, and DataGrid's prop surface is now derived from the config registry
  // rather than hand-listed. The surface is asserted per group in
  // `data-grid/__tests__/props-*.types.test.ts`, one file per owning unit.
  //
  // What stays here is the half that must NOT grow.
  it('freezes the deprecated DataGrid flat aliases', () => {
    // Every one of these is slated for removal next major. A new group adds a
    // grouped config, never an alias, so this list is closed — and a unit that
    // adds one has to say so here, on purpose.
    expectTypeOf<keyof DataGridDeprecatedAliases<Person>>().toEqualTypeOf<
      | 'error'
      | 'onRetry'
      | 'emptyMessage'
      | 'skeletonRows'
      | 'striped'
      | 'selectable'
      | 'selectionMode'
      | 'isRowSelectable'
      | 'sortable'
      | 'multiSort'
      | 'searchKey'
      | 'searchPlaceholder'
      | 'pageSize'
      | 'pageSizeOptions'
      | 'bulkActions'
      | 'currentRow'
      | 'onRowClick'
      | 'onRowActivate'
      | 'onRowHover'
    >();
    // `state` has left this list: it is no longer *only* a deprecated alias. The
    // name now also carries the top-level controlled-slice object, so the prop is
    // declared once — by `data-grid-config/state.ts` — as a structural union of
    // both, and `data-state.ts` reads the string half. It is still an alias by
    // *name*, which is why it stays in that module's `aliases` and still trips
    // the grouped-vs-alias warning; it is just no longer alias-*typed*.
    // Asserted where each half belongs: `props-state.types.test.ts` for the
    // object form, `props-data-state.types.test.ts` for the string form.
    expectTypeOf<DataGridProps<Person, unknown>['onRowClick']>().toEqualTypeOf<
      ((row: Person) => void) | undefined
    >();
  });

  it('keeps the non-group DataGrid props on the component itself', () => {
    // The props no config module contributes. A group is reached through the
    // registry; these are the grid's own inputs and are not derived.
    // `getRowId` is deliberately absent: it discriminates the two identity
    // branches of `DataGridProps` (design §3.1) rather than sitting on the shared
    // base, so it cannot be declared here.
    expectTypeOf<keyof DataGridOwnProps<Person, unknown>>().toEqualTypeOf<
      'columns' | 'rows' | 'presets' | 'callbacks' | 'chrome'
    >();
  });

  it('characterizes the current companion prop surfaces', () => {
    expectTypeOf<
      keyof ComponentProps<typeof DataTablePublic.DataTableToolbar>
    >().toEqualTypeOf<'table' | 'searchKey' | 'searchPlaceholder'>();
    expectTypeOf<
      keyof ComponentProps<typeof DataTablePublic.DataTableViewOptions>
    >().toEqualTypeOf<'table'>();
    expectTypeOf<
      keyof ComponentProps<typeof DataTablePublic.DataTablePagination>
    >().toEqualTypeOf<'table' | 'pageSizeOptions'>();
  });

  it('characterizes the Table presentation additions to native props', () => {
    expectTypeOf<
      Pick<
        TableHeadProps,
        'sortable' | 'sortDirection' | 'sortPriority' | 'onSort'
      >
    >().toEqualTypeOf<{
      sortable?: boolean;
      sortDirection?: 'asc' | 'desc' | false;
      sortPriority?: number;
      onSort?: (event: MouseEvent<HTMLButtonElement>) => void;
    }>();
    expectTypeOf<Pick<TableRowProps, 'selected'>>().toEqualTypeOf<{
      selected?: boolean;
    }>();
  });

  it('exposes every DataTable-layer type a public DataGrid config type names', () => {
    // #43's DataTable half. A type reachable from a *relative* path but not from a
    // barrel passes every internal test and is unnameable by a consumer — the same
    // invisibility as the missing outer hops, one level in.
    //
    // **Asserted through the source-barrel chain, not the package specifier.** A
    // `from '@constructor-lab/ui-react'` import does not resolve to source
    // in-package: there is no self-link and `exports` points at a gitignored
    // `dist/`. So the executable form of "reachable from the package" is the barrel
    // chain that `src/index.ts` re-exports — which is what these two blocks walk.
    //
    // The criterion for membership is narrow: a consumer must be able to NAME the
    // type to write a value in a separate file. `DataTablePersistenceConfig`,
    // `DataTableFooterConfig`, `DataTableColumnControls` and
    // `DataTableTreeStatusContext` are deep-imported by config modules and
    // deliberately absent, because they appear only inside module bodies; and
    // `DataTableGroupContext` is discharged by the exported `DataGridGroupContext`
    // alias. Adding one of those would be the declared-and-unreachable defect
    // inverted — a published name nothing needs.

    // Hop 1 — the DataTable barrel.
    expectTypeOf<DataTablePublic.DataTablePersistenceStorage>().not.toBeNever();
    expectTypeOf<DataTablePublic.DataTablePersistableSlice>().not.toBeNever();
    expectTypeOf<DataTablePublic.DataTableSummaryValue>().not.toBeNever();
    expectTypeOf<
      DataTablePublic.DataTableSummaryDefinition<Person>
    >().not.toBeNever();
    expectTypeOf<DataTablePublic.DataTableGroupSelectionScope>().not.toBeNever();
    expectTypeOf<DataTablePublic.DataTableUngroupedPolicy>().not.toBeNever();

    // Hop 2 — the package root barrel, which re-exports the above with `export *`.
    // Asserted separately because `export *` is the only thing carrying them, and a
    // future explicit re-export list in `src/index.ts` would silently drop them.
    expectTypeOf<PackageRoot.DataTablePersistenceStorage>().toEqualTypeOf<DataTablePublic.DataTablePersistenceStorage>();
    expectTypeOf<PackageRoot.DataTableSummaryValue>().toEqualTypeOf<DataTablePublic.DataTableSummaryValue>();
    expectTypeOf<PackageRoot.DataTableGroupSelectionScope>().toEqualTypeOf<DataTablePublic.DataTableGroupSelectionScope>();

    // And the consumer-shaped use each one exists for: a value written in a
    // separate file, which is the case a relative-path import cannot serve.
    const storage: DataTablePublic.DataTablePersistenceStorage = {
      read: () => null,
      write: () => undefined,
    };
    const include: readonly DataTablePublic.DataTablePersistableSlice[] = [
      'columnVisibility',
    ];
    const format = (summary: DataTablePublic.DataTableSummaryValue) =>
      String(summary.value);

    expectTypeOf(storage.read).toBeFunction();
    expectTypeOf(include).toExtend<readonly string[]>();
    expectTypeOf(format).toBeFunction();
  });

  it('exposes the eleven DataGrid config types at both re-export hops', () => {
    // #43's DataGrid half, guarding `f0d931fc`. Each of these eleven was nameable
    // only by deep relative path before that commit: `DataGridProps` required them
    // structurally while a consumer had no way to write the type of a value it was
    // passing in. The fix was verified reachable and then shipped UNGUARDED, which
    // is the shape this branch has watched regress repeatedly.
    //
    // **Hop numbering, because two conventions are in play.** This file counts the
    // component barrel and the package root as hops 1 and 2, as the block above
    // does. #43 counts the defining module as hop 1, so it calls these the same two
    // hops 2 and 3. Labelled by what they ARE below rather than by number, so the
    // assertion cannot be misread against either convention.
    //
    // **Why both hops are asserted separately, and it is not redundancy.** Two of
    // the eleven — `DataGridDataStatus` and `IdentityFreeDataGridState` — were
    // reachable from the component barrel while absent from the root, and that is
    // the WORSE shape: the inner hop's presence makes them read as done, so an
    // in-package test importing from `../data-grid` passes while a consumer still
    // cannot name them. A single import from the root barrel would fail on that
    // case but could not say which hop lost it; the namespace form can.
    //
    // `src/index.ts:28` carries all eleven by `export * from
    // './components/ui/data-grid'`. That single line is the entire root-hop
    // guarantee, so replacing it with an explicit re-export list would silently
    // drop every name here — the same reason the DataTable block above pins its
    // three separately.

    // The DataGrid barrel.
    expectTypeOf<
      DataGridPublic.DataGridDetailExpansionConfig<Person>
    >().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridFacetSource>().not.toBeNever();
    expectTypeOf<
      DataGridPublic.DataGridGroupingConfig<Person>
    >().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridServerSelection>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridPersistenceConfig>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridServerSelectionChangeEvent>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridTreeConfig<Person>>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridChromeSlot>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridVirtualizationConfig>().not.toBeNever();
    expectTypeOf<DataGridPublic.DataGridDataStatus>().not.toBeNever();
    expectTypeOf<DataGridPublic.IdentityFreeDataGridState>().not.toBeNever();

    // The package root barrel. Fails if a name reaches the barrel but not the root.
    expectTypeOf<
      PackageRoot.DataGridDetailExpansionConfig<Person>
    >().toEqualTypeOf<DataGridPublic.DataGridDetailExpansionConfig<Person>>();
    expectTypeOf<PackageRoot.DataGridFacetSource>().toEqualTypeOf<DataGridPublic.DataGridFacetSource>();
    expectTypeOf<PackageRoot.DataGridGroupingConfig<Person>>().toEqualTypeOf<
      DataGridPublic.DataGridGroupingConfig<Person>
    >();
    expectTypeOf<PackageRoot.DataGridServerSelection>().toEqualTypeOf<DataGridPublic.DataGridServerSelection>();
    expectTypeOf<PackageRoot.DataGridPersistenceConfig>().toEqualTypeOf<DataGridPublic.DataGridPersistenceConfig>();
    expectTypeOf<PackageRoot.DataGridServerSelectionChangeEvent>().toEqualTypeOf<DataGridPublic.DataGridServerSelectionChangeEvent>();
    expectTypeOf<PackageRoot.DataGridTreeConfig<Person>>().toEqualTypeOf<
      DataGridPublic.DataGridTreeConfig<Person>
    >();
    expectTypeOf<PackageRoot.DataGridChromeSlot>().toEqualTypeOf<DataGridPublic.DataGridChromeSlot>();
    expectTypeOf<PackageRoot.DataGridVirtualizationConfig>().toEqualTypeOf<DataGridPublic.DataGridVirtualizationConfig>();
    expectTypeOf<PackageRoot.DataGridDataStatus>().toEqualTypeOf<DataGridPublic.DataGridDataStatus>();
    expectTypeOf<PackageRoot.IdentityFreeDataGridState>().toEqualTypeOf<DataGridPublic.IdentityFreeDataGridState>();

    // And the consumer-shaped use each one exists for: naming the type of a value
    // written in a separate file, which is the case a deep relative import cannot
    // serve. `DataGridProps` requiring these structurally is what made their
    // absence a defect rather than a tidiness question.
    // Minimal REAL values, not `{}` — `allowedColumns` and `getChildren` are
    // required, so typecheck rejected the empty objects a first draft used. Worth
    // keeping as a note: the required members are what make these consumer-shaped
    // rather than decorative, since naming the type is only half of what a consumer
    // needs and satisfying it is the other half.
    const grouping: DataGridPublic.DataGridGroupingConfig<Person> = {
      allowedColumns: ['name'],
    };
    const tree: DataGridPublic.DataGridTreeConfig<Person> = {
      getChildren: () => [],
    };
    const status: DataGridPublic.DataGridDataStatus = 'loaded';

    expectTypeOf(grouping).toExtend<
      DataGridPublic.DataGridGroupingConfig<Person>
    >();
    expectTypeOf(tree).toExtend<DataGridPublic.DataGridTreeConfig<Person>>();
    expectTypeOf(status).not.toBeNever();
  });
});
