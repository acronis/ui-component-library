import { actionsConfig } from './actions';
import { appearanceConfig } from './appearance';
import { callbacksConfig } from './callbacks';
import { columnsFeaturesConfig } from './columns-features';
import { dataStateConfig } from './data-state';
import { detailExpansionConfig } from './detail-expansion';
import { filtersConfig } from './filters';
import { footerConfig } from './footer';
import { groupingConfig } from './grouping';
import { paginationConfig } from './pagination';
import { persistenceConfig } from './persistence';
import { rowInteractionConfig } from './row-interaction';
import { selectionConfig } from './selection';
import { serverConfig } from './server';
import { stateConfig } from './state';
import { sortingConfig } from './sorting';
import { toolbarConfig } from './toolbar';
import { treeConfig } from './tree';
import { virtualizationConfig } from './virtualization';
import type {
  AssertTrue,
  DataGridConfigKey,
  DataGridConfigModule,
} from './registry';

// ─────────────────────────────────────────────────────────────────────────────
// APPEND-ONLY SHARED FILE — every unit adds its own entry here.
//
// Not integrator-staged, and the reason is a correctness one rather than a
// convenience one. `_AssertEveryConfigRegistered` below fails to compile when a
// group is declared on the registry maps but absent from the array, so
// **declaring a group and registering its module are one atomic step** — split
// across two commits, the intermediate state turns the workspace typecheck red for
// everyone. U3 followed the old staging instruction into exactly that.
//
// Rules, same as the other append-only shared files: pull immediately before
// touching it, strictly append, never reorder or reformat another unit's lines.
// **Position is yours to choose** — see the order docblock below for why.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The committed module order. This one order drives all four seams — resolution,
 * the column pipeline, controller options, and chrome — and
 * `../__tests__/data-grid-config.test.tsx` pins it. Two constraints fix it:
 *
 * **Resolution** — a module may read the values resolved before it:
 * `pagination` and `callbacks` read `server`; `toolbar` reads `filters`; and
 * `state` is last because it merges `server`'s controlled query slices and
 * `pagination`'s initial page into the two state options it owns.
 *
 * **Columns** — the pipeline is a fold, so **position is placement**, and that
 * makes this array semantic rather than cosmetic. `filters` rewrites the caller's
 * defs; `actions` splices its column at `placement`; `detailExpansion` prepends
 * `__detail__`; and `selection` prepends `__select__` in front of all of them.
 * The result is `[__select__, __detail__, …data, __actions__]` — the leading
 * checkbox with detail as another system column, which is what
 * `packages/ui-spec/components/data-grid/anatomy.yaml` specifies. Move
 * `detailExpansion` after `selection` and the expander renders *in front of* the
 * checkbox.
 *
 * **A module's position therefore belongs to the unit that adds it**, not to
 * whoever applies the line: only the unit knows what its column has to sit behind.
 * U2's tree expander has the same constraint. This is why Wave 1 units apply
 * their own entry here rather than staging it.
 */
export const DATA_GRID_CONFIG_MODULES = [
  dataStateConfig,
  appearanceConfig,
  rowInteractionConfig,
  sortingConfig,
  // After `sorting` because both write the header cell — the sortable affordance
  // and the resize/reorder adornments share it. Before `actions` and
  // `selection` because `lockSystemColumns` resolves to the ids of the columns
  // those two splice in: resolving earlier would compute `lockedColumnIds`
  // against a column set that does not yet contain the columns it locks.
  columnsFeaturesConfig,
  filtersConfig,
  // After `filters` so the in-cell disclosure wraps the FINAL cell renderer —
  // `filters` rewrites the caller's defs, and wrapping first would be overwritten.
  // Before `actions` (whose `placement: 'start'` shifts index 0) and before
  // `detailExpansion`/`selection` (which both prepend), because this group's
  // default target is `columns[0]` and it must still be a caller column. Note the
  // inversion: prepending modules land in *reverse* array order, so `selection`
  // being last is what puts `__select__` leftmost.
  treeConfig,
  actionsConfig,
  detailExpansionConfig,
  selectionConfig,
  serverConfig,
  callbacksConfig,
  paginationConfig,
  // Contributes no column and reads nothing, so position is free. Placed late,
  // next to the other body-content groups, and before `state` — which must stay
  // last because it merges what every earlier module resolved.
  footerConfig,
  // Position is free and chosen for that reason: this group contributes no
  // `columns` transform, so it takes no place in the column fold, and its
  // `resolve` reads only `appearance` (for the bounded-height check behind
  // `sticky`) and `selection` (for whether a group select-all renders at all) —
  // both of which resolve far earlier. Placed with the other body-content groups
  // and before `state`, which must stay last because it merges what every earlier
  // module resolved.
  //
  // What position would matter for: the group row is emitted by the DataTable
  // feature registry, whose own manifest order is separate and already fixed
  // (`grouping` sits between `filtering` and `sorting` there, which is design
  // §3.5's pipeline order).
  groupingConfig,
  // Position is free, for the same reasons as `grouping`: it contributes no
  // `columns` transform, so it takes no place in the column fold, and its `resolve`
  // reads nothing but its own prop. Placed beside the other body-behaviour groups.
  //
  // What position would NOT buy: the bounded-height precondition looks like an
  // ordering dependency on `appearance` and is not one — the seam checks it against
  // the DOM rather than against resolved config, so no resolution order can satisfy
  // or break it.
  virtualizationConfig,
  toolbarConfig,
  // Position is free — this group contributes no `columns` transform, so it takes
  // no place in the column fold, and its `resolve` reads only its own prop,
  // nothing from `resolved`. Placed last-but-one to mirror the DataTable side,
  // where `FEATURE_ORDER` puts `persistence` last "because it restores into the
  // slices every other feature owns" (`data-table-features/registry.ts`). Keeping
  // the two registries telling the same story is worth more than an arbitrary
  // earlier slot.
  //
  // It must stay BEFORE `state`, which has to remain last because it merges what
  // every earlier module resolved. Persistence contributes nothing `state` reads,
  // so sitting in front of it changes nothing for it.
  persistenceConfig,
  stateConfig,
] as const satisfies readonly DataGridConfigModule[];

type RegisteredKey = (typeof DATA_GRID_CONFIG_MODULES)[number]['key'];

/**
 * The forcing function, replacing the total-record
 * `satisfies Record<keyof DataGridGroupedConfig<unknown>, …>` that used to live
 * in `data-grid.tsx`. A group declared on the registry maps but missing from the
 * list above fails to compile — but the fix is one line *here*, not an edit to
 * the grid.
 */
export type _AssertEveryConfigRegistered = AssertTrue<
  [Exclude<DataGridConfigKey, RegisteredKey>] extends [never] ? true : false
>;

/**
 * The prop keys resolution reads, for memoizing it. A `grouped` module
 * implicitly reads its own key — that key *is* its prop; a `top-level` module
 * declares what it reads, because its key may not name a prop it consumes.
 */
export const DATA_GRID_CONFIG_PROP_KEYS: readonly string[] = [
  ...new Set(
    DATA_GRID_CONFIG_MODULES.flatMap((module) => [
      ...(module.kind === 'grouped' ? [module.key] : []),
      ...module.aliases,
      ...(module.reads ?? []),
    ])
  ),
];

export {
  buildGroupedConfigAliases,
  applyPresets,
  resolveDataGridConfig,
  composeColumns,
  composeControllerOptions,
  composeViewProps,
  renderChromeSlot,
} from './compose';

export {
  defineDataGridConfig,
  DATA_GRID_CHROME_SLOTS,
  type AssertTrue,
  type DataGridAliasKey,
  type DataGridChrome,
  type DataGridChromeContext,
  type DataGridChromeSlot,
  type DataGridChromeSlotContext,
  type DataGridColumnContext,
  type DataGridConfigKey,
  type DataGridConfigModule,
  type DataGridConfigModuleFor,
  type DataGridControllerContext,
  type DataGridControllerOptionsContribution,
  type DataGridDeprecatedAliasMap,
  type DataGridDeprecatedAliases,
  type DataGridGroupKey,
  type DataGridGroupedConfig,
  type DataGridGroupedConfigMap,
  type DataGridIdentityFreeMap,
  type DataGridIdentityFreeProps,
  type DataGridIdentityProps,
  type DataGridBaseProps,
  type DataGridOwnProps,
  type DataGridPreset,
  type DataGridPresetsInput,
  type DataGridProps,
  type DataGridResolveContext,
  type DataGridResolveResult,
  type DataGridResolvedConfigMap,
  type DataGridTopLevelConfig,
  type DataGridTopLevelConfigMap,
  type DataGridViewContext,
  type ResolvedDataGrid,
} from './registry';

// Per-group public types. A group's own file owns its config interface; this
// block is what makes it reachable from `data-grid.tsx` (and therefore from the
// package barrel) without the grid importing each module by name.
export {
  DATA_GRID_ACTIONS_COLUMN_ID,
  type ResolvedDataGridActions,
} from './actions';
export {
  type DataGridAppearanceConfig,
  type ResolvedDataGridAppearance,
} from './appearance';
export { type ResolvedDataGridCallbacks } from './callbacks';
export {
  DATA_GRID_DETAIL_COLUMN_ID,
  type DataGridDetailExpansionConfig,
  type ResolvedDataGridDetailExpansion,
} from './detail-expansion';
export {
  type DataGridDataStateConfig,
  type DataGridDataStatus,
  type ResolvedDataGridDataState,
} from './data-state';
export {
  type DataGridColumnFilterDef,
  type DataGridFacetSource,
  type DataGridFiltersConfig,
  type ResolvedDataGridFilters,
} from './filters';
export {
  DATA_GRID_UNGROUPED_DEFAULT_NAME,
  type DataGridGroupContext,
  type DataGridGroupingConfig,
  type ResolvedDataGridGrouping,
} from './grouping';
export {
  type DataGridPaginationConfig,
  type ResolvedDataGridPagination,
} from './pagination';
export {
  type DataGridPersistenceConfig,
  type ResolvedDataGridPersistence,
} from './persistence';
export {
  type DataGridRowInteractionConfig,
  type ResolvedDataGridRowInteraction,
} from './row-interaction';
export {
  DATA_GRID_SELECTION_COLUMN_ID,
  type DataGridSelectionConfig,
  type ResolvedDataGridSelection,
} from './selection';
export {
  type DataGridServerConfig,
  type DataGridServerSelection,
  type DataGridServerSelectionChangeEvent,
  type ResolvedDataGridServer,
} from './server';
export {
  type DataGridSortingConfig,
  type ResolvedDataGridSorting,
} from './sorting';
export {
  type IdentityFreeDataGridState,
  type ResolvedDataGridState,
} from './state';
export {
  type DataGridToolbarConfig,
  type ResolvedDataGridToolbar,
} from './toolbar';
export {
  DATA_GRID_TREE_DEFAULT_INDENT,
  type DataGridTreeConfig,
  type DataGridTreeLoadErrorContext,
  type ResolvedDataGridTree,
} from './tree';
export {
  type DataGridVirtualizationConfig,
  type ResolvedDataGridVirtualization,
} from './virtualization';
// #43/#50. These two groups shipped without their public-type re-exports at ANY of
// the three hops, so `DataGridProps['columnsFeatures']` and `['footer']`
// structurally required types a consumer could not name. Landed here late rather
// than inside each unit's atom; the correlation worth keeping is that both units
// also left their `props-*.types.test.ts` on `it.todo`, which makes the type test a
// cheap proxy signal for a missing barrel line.
export { type DataGridColumnsFeaturesConfig } from './columns-features';
export {
  type DataGridFooterConfig,
  type DataGridSummary,
  type DataGridSummaryPresentation,
} from './footer';
