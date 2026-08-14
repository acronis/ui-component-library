import type { ComponentProps, ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { TooltipContent } from '@constructor-lab/ui-react';

import type {
  DataTableController,
  DataTableControllerOptions,
  DataTableQuery,
  DataTableState,
  DataTableViewProps,
} from '../../data-table';
import type { DataGridCallbacks } from '../data-grid-callbacks';

// OWNERSHIP: **F4/F5** (on standby). The mechanism. A seventh contribution
// point or a sixth map escalates through the team lead.

// The DataGrid config registry (ADR-0002, DataGrid half).
//
// This file is the *mechanism*; it knows nothing about any individual behavior
// group. Each group lives in its own `data-grid-config/<group>.ts`, which
// declares its prop surface by augmenting the three maps below and exports one
// `DataGridConfigModule`. `data-grid-config/index.ts` is the manifest: the
// single ordered list of modules.
//
// This registry is library-internal and is unrelated to the public `plugins`
// input on DataTable. Design §4.1's prohibition is about third-party extension
// of the canonical pipeline; this is how the library organizes its own features,
// the same way TanStack composes `RowSelection` / `ColumnSizing` / ….
//
// Adding a behavior group is: create one module file, then append your own import
// and array entry to `index.ts`. That second step is *not* staged for an
// integrator — `_AssertEveryConfigRegistered` makes declaring a group and
// registering it atomic, so splitting them breaks the workspace typecheck for
// everyone. No unit opens `data-grid.tsx`.

// ── The three augmentable maps ───────────────────────────────────────────────
//
// These are deliberately empty here. A group is only part of the public prop
// surface once its own module file declares it, which is what keeps
// `data-grid.tsx` and this file off every unit's critical path.
//
// ── Which of the five maps is guarded against a member nothing fills ─────────
//
// The reverse-direction sweep (#50) measured this rather than reading it, with a
// probe file kept outside the package's tsconfig `include` so no other unit's
// typecheck saw it. Each map got one member with no module behind it; the counts
// are `tsc` runs against an otherwise-clean tree.
//
//  - `DataGridResolvedConfigMap`  — **guarded.** One error, at
//    `index.ts`'s `_AssertEveryConfigRegistered`. That mechanism works.
//  - `DataGridDeprecatedAliasMap` — **guarded**, but not from here: the frozen
//    key-set assertion in
//    `data-table/__tests__/table-family-public-types.test.ts` fails, by design
//    ("this list is closed"). Worth knowing, because nothing in this file says so.
//  - `DataGridGroupedConfigMap`   — **unguarded.** Zero errors, and the probe
//    proved the member was live on the public `DataGridProps` (assigning a wrong
//    value type to it errored). So a grouped member with no module and no
//    resolved entry becomes a public `DataGrid` prop that nothing reads.
//  - `DataGridTopLevelConfigMap`  — **unguarded.** Zero errors.
//  - `DataGridIdentityFreeMap`    — **unguarded.** Zero errors.
//
// The narrow reading is the honest one: the realistic mistake is not a
// grouped-only declaration, because a module's `key` must be a
// `DataGridConfigKey` (= `keyof DataGridResolvedConfigMap`) and every template
// tells a unit to declare both maps together — at which point the guard does
// fire. What the probes establish is the **scope** of the claim, not a live
// defect: "declared on the registry maps but missing from the list fails to
// compile" holds for one map of five. Every member of all five maps was checked
// by hand at `ab2f695f` and each one has a module behind it — grouped members and
// `kind: 'grouped'` modules were 1:1, every top-level member was a module `key` or
// a declared `reads`, and every deprecated alias was both claimed by one module's
// `aliases` and read by that module's `resolve`. So there is nothing to delete.
//
// **Deliberately no tallies here.** The first version of this note said "13
// grouped members"; U4's grouping landed between the count and the commit and made
// it 14, so the number was stale before anyone read it. U6 and U10 each still add a
// group. A count is a claim that falsifies itself in a tree where units are landing
// — state the invariant and the commit you checked it at, and re-run the check
// rather than trusting the figure.
//
// The convention that covers the grouped map in practice is a file, not a type:
// one `../__tests__/props-<group>.types.test.ts` per group, present for every
// group including the not-yet-shipped ones, where it waits as a placeholder for
// the owning unit to fill. Nothing asserts that the file exists.
//
// The lint suppressions are load-bearing: an empty interface is exactly what an
// augmentation target is, and `TData` must be declared here so every augmenting
// declaration can use the same type-parameter list.

/* eslint-disable @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars */

/**
 * The behavior groups (design §5.2). A group declared here is a member of
 * `DataGridGroupedConfig`, is addressable by a preset, and normalizes from its
 * deprecated flat aliases.
 *
 * ```ts
 * // data-grid-config/tree.ts
 * declare module './registry' {
 *   interface DataGridGroupedConfigMap<TData> {
 *     tree: false | DataGridTreeConfig<TData>;
 *   }
 * }
 * ```
 */
export interface DataGridGroupedConfigMap<TData> {}

/**
 * Top-level normalization/ownership inputs that resolve like a group but are
 * never preset-addressable (design §5.2 keeps `server`, `state`, `defaultState`,
 * rows/columns and callbacks out of presets).
 */
export interface DataGridTopLevelConfigMap<TData> {}

/**
 * Deprecated flat aliases. Each is declared by the module of the group it
 * normalizes into, so a group's whole prop surface lives in one file.
 */
export interface DataGridDeprecatedAliasMap<TData> {}

/**
 * The effective (normalized) value each module resolves to, keyed by module.
 * The DataGrid render body reads only from here — never from raw props.
 */
export interface DataGridResolvedConfigMap<TData> {}

/**
 * The **identity rule** (design §3.1). A module whose feature needs stable row
 * identity declares here what its prop may be when `getRowId` is absent, and
 * `DataGridProps` becomes a discriminated union over that.
 *
 * ```ts
 * // data-grid-config/tree.ts
 * declare module './registry' {
 *   interface DataGridIdentityFreeMap<TData> {
 *     tree: false;
 *   }
 * }
 * ```
 *
 * The constraint is per group rather than hand-listed in one place for the same
 * reason the rest of the registry is: every identity-bearing feature Waves 1–2
 * add — `detailExpansion`, `tree`, row-state `persistence` — would otherwise edit
 * one shared line.
 *
 * **`grouping` used to be in that list and does not belong there** (corrected by
 * U4, which looked for the entry it was told to write and found no reason for it).
 * Design §3.1's normative enumeration omits grouping, and nothing in the group is
 * keyed by row id: collapse is keyed by the *synthetic* group id — `${columnId}:${value}`,
 * never a record id (§6.5) — and group-scoped selection reaches identity through
 * `selection`, which declares its own constraint. So a grid that groups needs no
 * `getRowId`, and one that groups *and* selects needs it because of `selection`.
 * `__tests__/props-grouping.types.test.ts` asserts the absence, and a negative
 * control confirmed that adding the entry breaks it — worth knowing, because the
 * failure this line would otherwise cause is silent: a group listed here forces
 * `getRowId` on every caller of it, and reads as intended.
 *
 * It is also *finer* than a blanket `?: false`. Design §3.1 lists
 * `rowInteraction` wholesale as identity-bearing, but only `current` is: the
 * click/hover/activate handlers receive the row **object**, not an id, and work
 * without identity. A group declaring its own constraint can say
 * `{ current?: false }` and keep the handlers available.
 */
export interface DataGridIdentityFreeMap<TData> {}

/* eslint-enable @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars */

// ── Derived public shapes ────────────────────────────────────────────────────

/**
 * The behavior groups (design §5.2). Each group enables one feature and carries
 * its behavioral defaults — never controlled/current values, which live in
 * `state`/`defaultState`/`server` so there is one source of truth.
 *
 * `DataGridProps` includes this and a preset carries these same groups, so the
 * prop surface and what a preset may set can never drift. Derived from the
 * registry rather than hand-listed.
 */
export type DataGridGroupedConfig<TData> = {
  [
    Key in keyof DataGridGroupedConfigMap<TData>
  ]?: DataGridGroupedConfigMap<TData>[Key];
};

/** Module-contributed top-level props (`server`, …). */
export type DataGridTopLevelConfig<TData> = {
  [
    Key in keyof DataGridTopLevelConfigMap<TData>
  ]?: DataGridTopLevelConfigMap<TData>[Key];
};

/** The deprecated flat aliases, derived from the modules that own them. */
export type DataGridDeprecatedAliases<TData> = {
  [
    Key in keyof DataGridDeprecatedAliasMap<TData>
  ]?: DataGridDeprecatedAliasMap<TData>[Key];
};

/** Effective (normalized) values the DataGrid render consumes, keyed by module. */
export type ResolvedDataGrid<TData> = {
  readonly [
    Key in keyof DataGridResolvedConfigMap<TData>
  ]: DataGridResolvedConfigMap<TData>[Key];
};

/** Every key the registry resolves — behavior groups plus top-level inputs. */
export type DataGridConfigKey<TData = unknown> =
  keyof DataGridResolvedConfigMap<TData>;

/** The behavior-group keys only (the preset-addressable subset). */
export type DataGridGroupKey<TData = unknown> =
  keyof DataGridGroupedConfigMap<TData>;

/**
 * A flat prop a group normalizes from. Usually a deprecated alias; it also admits
 * a top-level key, because one prop can be read by two modules — `state` carries
 * both the deprecated data-status string (read by `dataState`) and the controlled
 * slice object (read by `state`), and a prop may only be *declared* once or the
 * intersection that builds `DataGridProps` would collapse it to `never`.
 */
export type DataGridAliasKey<TData = unknown> =
  | (keyof DataGridDeprecatedAliasMap<TData> & string)
  | (keyof DataGridTopLevelConfigMap<TData> & string);

// ── Non-group props ──────────────────────────────────────────────────────────

/**
 * Context handed to an external chrome renderer: the one shared controller plus
 * the current selection, query, and state. The renderer composes its own toolbar
 * / pagination from these instead of DataGrid's built-in controls.
 */
export interface DataGridChromeContext<TData> {
  controller: DataTableController<TData>;
  selectedRows: TData[];
  query: DataTableQuery;
  state: DataTableState;
}

/**
 * Chrome ownership (design §5.1). Built-in (default) renders DataGrid's toolbar,
 * filters, bulk bar, and pagination. External keeps the engine state but
 * suppresses those built-in controls and calls `render`; the empty/error rows and
 * footer stay inside the table. `toolbar`/`searchKey` are invalid in external
 * mode — the renderer owns toolbar composition.
 */
export type DataGridChrome<TData> =
  | {
      /** DataGrid renders its own toolbar, filters, bulk bar and pagination. */
      mode?: 'built-in';
    }
  | {
      /**
       * Suppress the built-in controls and render your own. `toolbar` and
       * `searchKey` become invalid — the renderer owns toolbar composition.
       */
      mode: 'external';
      /** Composes the chrome from the shared controller, selection and query. */
      render: (context: DataGridChromeContext<TData>) => ReactNode;
    };

/**
 * A named bundle of grouped configs. It carries behavior only — never `state`,
 * `defaultState`, `server`, rows/columns, or callbacks (design §5.2).
 */
export interface DataGridPreset<TData> {
  /** The name `presets.apply` and `presets.detect` refer to. */
  id: string;
  /** The behavior groups this preset sets. */
  config: Readonly<DataGridGroupedConfig<TData>>;
}

/**
 * Preset normalization input. `apply` names the presets to apply left-to-right;
 * `detect` runs **once** against the initial columns/rows and returns preset ids
 * inferred from data capabilities — it can never observe mutable state.
 *
 * Precedence rises with explicitness: detected presets, then `apply`, then any
 * grouped config (or deprecated alias) the caller passed.
 */
export interface DataGridPresetsInput<TData, TValue = unknown> {
  /** The presets available to `apply` and `detect`. */
  definitions: readonly DataGridPreset<TData>[];
  /** Preset ids to apply, left to right. Later ids win. */
  apply: readonly string[];
  /**
   * Infers extra preset ids from the initial columns and rows. Runs **once** and
   * cannot observe mutable state, so it can never react to a later change.
   */
  detect?: (input: {
    columns: readonly ColumnDef<TData, TValue>[];
    rows: readonly TData[];
  }) => readonly string[];
}

/**
 * The DataGrid props that are not contributed by a config module.
 *
 * `columns`/`rows` are `readonly` (PLTFRM-93046). Every seam downstream already
 * takes them that way — `composeColumns` and `DataGridControllerContext.rows`
 * both declare `readonly`, and `DataGridPresetsInput.detect` above receives
 * `readonly` copies of the same two values — so the mutable public signature was
 * the outlier, not the constraint. It rejected the ordinary consumer shapes:
 * a `readonly ColumnDef<T>[]` module constant, or rows off a `ReadonlyArray`
 * selector, failed with TS4104 and had to be spread into a fresh array. Spread at
 * the call site — the obvious place — that allocates a new `columns` identity on
 * every render and so invalidates TanStack's memoized row model, which is the
 * exact churn `data-grid.tsx` memoizes to avoid.
 */
export interface DataGridOwnProps<TData, TValue = unknown> {
  /** TanStack column definitions (the same `ColumnDef[]` DataTable accepts). */
  columns: readonly ColumnDef<TData, TValue>[];
  /** Row data. */
  rows: readonly TData[];
  /** Named grouped-config bundles applied before the caller's own configs. */
  presets?: DataGridPresetsInput<TData, TValue>;
  /**
   * Named screen callbacks carrying the enriched events (cause, next state,
   * query, request key). A config-level handler owns the behavior and runs
   * first; these observe afterwards.
   */
  callbacks?: DataGridCallbacks<TData>;
  /**
   * Chrome ownership. Defaults to built-in. `external` suppresses the built-in
   * toolbar/filters/bulk-bar/pagination and renders your own from the shared
   * controller; it is incompatible with `toolbar`/`searchKey`.
   */
  chrome?: DataGridChrome<TData>;
  /**
   * Portal target for tooltips DataGrid renders on its own behalf — currently
   * only `meta.truncate`'s. Pass a Shadow DOM host's root; omit it there and
   * the tooltip portals to `document.body`, outside the root that carries the
   * page's styles.
   */
  portalContainer?: ComponentProps<typeof TooltipContent>['portalContainer'];
}

/**
 * Everything both identity branches share: the non-group props, the behavior
 * groups, the module-contributed top-level inputs, and the deprecated flat
 * aliases. The last three are derived from the config registry.
 */
export type DataGridBaseProps<TData, TValue = unknown> = DataGridOwnProps<
  TData,
  TValue
> &
  DataGridGroupedConfig<TData> &
  DataGridTopLevelConfig<TData> &
  DataGridDeprecatedAliases<TData>;

/**
 * The identity-free branch: no `getRowId`, and every identity-bearing group
 * pinned to the value its own module says is safe without stable row identity.
 * Derived from `DataGridIdentityFreeMap`.
 *
 * The constrained keys are **replaced** rather than intersected. Intersecting
 * would enforce the same rule but leave uninhabitable members in the public type
 * — `selection` would read
 * `false | DataGridSelectionConfig<T> | (DataGridSelectionConfig<T> & false)` —
 * and that noise reaches consumers through hover text and the emitted `.d.ts`.
 */
export type DataGridIdentityFreeProps<TData, TValue = unknown> = Omit<
  DataGridBaseProps<TData, TValue>,
  keyof DataGridIdentityFreeMap<TData>
> & { getRowId?: never } & {
  [
    Key in keyof DataGridIdentityFreeMap<TData>
  ]?: DataGridIdentityFreeMap<TData>[Key];
};

/** The identity branch: `getRowId` supplied, so every group is available. */
export interface DataGridIdentityProps<TData> {
  /**
   * Stable row identity. Required as soon as any identity-bearing feature is
   * enabled — selection, row actions, current row, a controlled identity slice,
   * server mode (design §3.1).
   */
  getRowId: (row: TData, index: number) => string;
}

/**
 * The DataGrid prop surface, as a discriminated union enforcing the identity rule
 * (design §3.1): `getRowId` is optional only while every identity-bearing feature
 * is disabled, and required the moment one is enabled.
 *
 * The deprecated flat aliases (`selectable`, `currentRow`, `onRowClick`, …) sit in
 * the shared base and stay source-compatible for one minor line, as §3.1
 * requires — they warn at runtime and are documented as non-reserving instead.
 * Only the grouped API is enforced at compile time.
 *
 * `TValue` defaults to `unknown` (PLTFRM-93046). It is the *cell* value type,
 * which for a heterogeneous column set is never one type a consumer would want to
 * name — so `DataGridProps<Person>` is the only spelling anyone writes, and
 * without the default it failed with TS2314 "requires 2 type argument(s)".
 * `DataGridPresetsInput` above already defaulted it; the prop types did not, and
 * the mismatch was invisible in-tree because every internal reference spells
 * `<Person, unknown>` out.
 */
export type DataGridProps<TData, TValue = unknown> =
  | DataGridIdentityFreeProps<TData, TValue>
  | (DataGridBaseProps<TData, TValue> & DataGridIdentityProps<TData>);

// ── Contribution points ──────────────────────────────────────────────────────

/**
 * The identity-bearing branch of the controller's options union. DataGrid always
 * supplies `getRowId` (defaulting to the row index), so it is always on this
 * side of the identity-free/identity discrimination (`data-table-controller.ts`).
 */
type IdentityControllerOptions<TData> = Extract<
  DataTableControllerOptions<TData>,
  { readonly getRowId: unknown }
>;

/** Compile-time assertion helper: instantiating it with `false` fails to compile. */
export type AssertTrue<T extends true> = T;

/**
 * Guard: if the controller's identity discrimination is ever restructured, the
 * `Extract` above would silently collapse to `never` and every module's
 * controller contribution would become unchecked. Fail to compile instead.
 */
export type _AssertIdentityBranchExists = AssertTrue<
  [IdentityControllerOptions<unknown>] extends [never] ? false : true
>;

/**
 * Controller options a module contributes to the one shared `useDataTable`
 * call. `columns` and `getRowId` stay with the grid itself; `data` is a
 * contribution because the data-state group replaces it for forced empty/error.
 */
export type DataGridControllerOptionsContribution<TData> = Partial<
  Omit<IdentityControllerOptions<TData>, 'columns' | 'getRowId'>
>;

/**
 * Every controller option a config module is allowed to contribute.
 *
 * This exists because of a hole `tsc` cannot close. A module's
 * `controllerOptions` return is written as conditional spreads — that is how you
 * avoid passing an explicit `undefined` — and **an unknown key inside a spread
 * escapes excess-property checking**. So a contribution under a misspelled or
 * nonexistent key type-checks cleanly and is then silently dropped, leaving the
 * whole group inert with no error anywhere. U7 shipped within minutes of doing
 * exactly that, under a `filters` key the controller does not have.
 *
 * `composeControllerOptions` validates against this list at runtime, which no
 * spread can evade. The two assertions below keep the list honest: every entry
 * must be a real option, and every real option must be listed — so when the
 * controller gains one, this fails to compile rather than the guard quietly
 * rejecting a legitimate contribution.
 */
export const DATA_GRID_CONTRIBUTABLE_CONTROLLER_OPTIONS = [
  'data',
  'state',
  'defaultState',
  'sorting',
  'filtering',
  'pagination',
  'selection',
  'detailExpansion',
  'tree',
  'grouping',
  'virtualization',
  'columnsFeatures',
  'persistence',
  'footer',
  'rowInteraction',
  'actions',
  'server',
  'manualSorting',
  'manualFiltering',
  'manualPagination',
  'manualGrouping',
  'rowCount',
  'pageCount',
  'engineOptions',
  'plugins',
  'onStateChange',
  'onQueryChange',
  'onSliceChange',
  'getSubRows',
  'getRowCanExpand',
  'renderExpandedRow',
] as const;

type ContributableOptionKey =
  (typeof DATA_GRID_CONTRIBUTABLE_CONTROLLER_OPTIONS)[number];
type RealOptionKey = keyof DataGridControllerOptionsContribution<unknown>;

/** Every listed key is a real controller option. */
export type _AssertNoPhantomControllerOption = AssertTrue<
  [Exclude<ContributableOptionKey, RealOptionKey>] extends [never]
    ? true
    : false
>;
/** Every real controller option is listed, so the guard rejects nothing valid. */
export type _AssertEveryControllerOptionListed = AssertTrue<
  [Exclude<RealOptionKey, ContributableOptionKey>] extends [never]
    ? true
    : false
>;

/** Where a module may mount chrome in the DataGrid body. */
export type DataGridChromeSlot =
  /**
   * Above the toolbar. **Free — nothing built-in mounts here.**
   *
   * The bulk-action bar did until PLTFRM-93130, and that was the defect: every slot
   * is a sibling row inside one `flex-col`, so a module that renders here
   * conditionally moves the toolbar, the filter chips and the whole table each time
   * its condition flips. The bulk bar flipped on the first selected row. Anything
   * mounted here should therefore either always render or be laid out so its
   * appearance costs no height.
   */
  | 'top'
  /**
   * The toolbar row: filter triggers, search, `leading`/`trailing`, and — while rows
   * are selected — the bulk-action strip that replaces them.
   */
  | 'toolbar'
  /** Between the toolbar and the table. The applied-filter chips live here. */
  | 'under-toolbar'
  /** Below the table. Pagination lives here. */
  | 'bottom';

/** Every slot, in render order. */
export const DATA_GRID_CHROME_SLOTS = [
  'top',
  'toolbar',
  'under-toolbar',
  'bottom',
] as const satisfies readonly DataGridChromeSlot[];

/** What `resolve` sees. */
export interface DataGridResolveContext<TData, TValue> {
  /** The caller's props, after presets have filled in untouched groups. */
  readonly props: DataGridProps<TData, TValue>;
  /**
   * Values resolved by modules earlier in the manifest order. Reading a later
   * module's key is a programming error the manifest order prevents; the
   * `Partial` is what makes that visible at the call site.
   */
  readonly resolved: Partial<ResolvedDataGrid<TData>>;
}

/** What every post-resolution contribution point sees. */
export interface DataGridConfigContext<TData> {
  readonly resolved: ResolvedDataGrid<TData>;
  readonly callbacks: DataGridCallbacks<TData> | undefined;
}

/** What the `columns` transform sees. */
export interface DataGridColumnContext<
  TData,
> extends DataGridConfigContext<TData> {
  /** Resolves a column def's effective id (`id`, else `accessorKey`). */
  resolveColumnId(column: ColumnDef<TData, unknown>): string | undefined;
}

/** What `controllerOptions` sees. */
export interface DataGridControllerContext<
  TData,
> extends DataGridConfigContext<TData> {
  /** The caller's rows, before any module replaces them. */
  readonly rows: readonly TData[];
  /** The assembled column set, after every `columns` transform. */
  readonly columns: readonly ColumnDef<TData, unknown>[];
}

/** What `viewProps` sees. */
export interface DataGridViewContext<
  TData,
> extends DataGridConfigContext<TData> {
  /** Column count, for `emptyColSpan`. */
  readonly columnCount: number;
}

/** What `chrome` sees. */
export interface DataGridChromeSlotContext<
  TData,
> extends DataGridConfigContext<TData> {
  readonly controller: DataTableController<TData>;
}

/** The result of a module's `resolve`. */
export interface DataGridResolveResult<Value> {
  readonly value: Value;
  /** Development warnings (grouped-vs-alias conflicts, invalid combinations). */
  readonly warnings?: readonly string[];
}

/**
 * One behavior group's module. `key` names the group; everything else is the
 * group's contribution to the six seams `data-grid.tsx` exposes.
 */
export interface DataGridConfigModuleFor<
  TData,
  TValue,
  Key extends DataGridConfigKey<TData>,
> {
  readonly key: Key;
  /**
   * `grouped` — a member of `DataGridGroupedConfig`: preset-addressable and
   * alias-normalized. `top-level` — a normalization/ownership input.
   */
  readonly kind: Key extends DataGridGroupKey<TData> ? 'grouped' : 'top-level';
  /** Deprecated flat aliases that normalize into this group. */
  readonly aliases: readonly DataGridAliasKey<TData>[];
  /**
   * Any prop this module's `resolve` reads beyond its `aliases` — and, for a
   * `top-level` module, beyond nothing: a grouped module implicitly reads its own
   * `key`, a top-level one must say so.
   *
   * Declaring these is what lets the grid memoize resolution on the props that
   * actually matter rather than on the whole props object, which React
   * reallocates every render. That in turn keeps the assembled column set
   * referentially stable, and a new columns array invalidates TanStack's
   * memoized row model — so an over-broad dependency rebuilds the row model on
   * every render. A *missing* one resolves against a stale prop.
   */
  readonly reads?: readonly string[];
  /** Normalizes props + aliases into this group's resolved value. */
  resolve(
    context: DataGridResolveContext<TData, TValue>
  ): DataGridResolveResult<ResolvedDataGrid<TData>[Key]>;
  /**
   * Column defs this group injects or rewrites. A transform rather than a bare
   * injector because `filters` rewrites existing defs while `actions` and
   * `selection` splice at a position; applied in manifest order.
   */
  columns?(
    columns: readonly ColumnDef<TData, TValue>[],
    context: DataGridColumnContext<TData>
  ): readonly ColumnDef<TData, TValue>[];
  /** Controller options this group contributes to `useDataTable({…})`. */
  controllerOptions?(
    context: DataGridControllerContext<TData>
  ): DataGridControllerOptionsContribution<TData>;
  /**
   * `DataTableView` props this group contributes.
   *
   * **Known gap, deliberately unguarded: an unknown key here is silently
   * dropped.** Contributions are written as conditional spreads to avoid passing
   * explicit `undefined`, and an unknown key inside a spread escapes TypeScript's
   * excess-property check — so a misspelled or nonexistent view prop compiles
   * cleanly and then does nothing. `controllerOptions` has a runtime guard against
   * exactly this (`assertUnknownControllerOption`); this point does not.
   *
   * That asymmetry is a decision, not an oversight. A dropped **view prop** is
   * presentational, so it surfaces in a story or a snapshot the first time anyone
   * looks. A dropped **controller option** is behavioural and invisible until
   * someone tests that exact configuration, which is why it earned a guard. And a
   * completeness assertion over `DataTableViewProps` — owned elsewhere and still
   * growing — would break in this file every time a view prop is added, which is
   * the cross-unit contention the registry exists to remove.
   *
   * So: **check your key against `DataTableViewProps` by hand, and assert the
   * rendered result in a test rather than trusting the type-check.** If a dropped
   * view prop ever does ship, that is the signal to guard this too.
   */
  viewProps?(
    context: DataGridViewContext<TData>
  ): Partial<DataTableViewProps<TData>>;
  /** Chrome this group mounts into a named slot in the DataGrid body. */
  chrome?(
    slot: DataGridChromeSlot,
    context: DataGridChromeSlotContext<TData>
  ): ReactNode;
}

/**
 * A module in the manifest. Declared over `unknown` rows: the manifest is a
 * module-scope constant and cannot be generic, so the composer instantiates it
 * once per grid. Every value a module passes through (`isRowSelectable`,
 * `onClick`, `bulkActions`, …) arrives already typed from `DataGridProps`, so
 * nothing inside a module body needs `TData`.
 */
export type DataGridConfigModule = {
  [Key in DataGridConfigKey]: DataGridConfigModuleFor<unknown, unknown, Key>;
}[DataGridConfigKey];

/**
 * Declares a module with its key's precise types, then widens it to the
 * manifest's element type. Call this in every `data-grid-config/<group>.ts`.
 */
export function defineDataGridConfig<Key extends DataGridConfigKey>(
  module: DataGridConfigModuleFor<unknown, unknown, Key>
): DataGridConfigModuleFor<unknown, unknown, Key> {
  return module;
}
