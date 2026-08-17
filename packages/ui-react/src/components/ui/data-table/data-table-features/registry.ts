import type { CSSProperties, ReactNode } from 'react';
import type {
  Column,
  Header,
  Row,
  Table,
  TableOptions,
  Updater,
} from '@tanstack/react-table';

import type {
  DataTableChangeCause,
  DataTableChangeEvent,
  DataTableSlice,
  DataTableSliceValue,
  DataTableState,
} from '../data-table-contract';
import type { TableColumnPin } from '../../table';
import type { DataTableDisplayRow } from '../data-table-display-rows';
// Type-only, and circular by construction: the view owns its public prop
// interface and the registry needs to hand it to a module. Erased at compile.
import type { DataTableViewProps } from '../data-table-view';

// The DataTable feature registry (ADR-0002, DataTable half).
//
// This file is the *mechanism*; it knows nothing about any individual feature.
// Each feature lives in its own `data-table-features/<feature>.ts`, which owns
// its `…Config` interface and exports one `DataTableFeatureModule`.
// `data-table-features/index.ts` is the manifest: the single ordered list.
//
// This registry is library-internal and unrelated to the public `plugins` input
// on DataTable. Design §4.1's prohibition is about third-party extension of the
// canonical pipeline; this is how the library organizes its own features, the
// same way TanStack composes `RowExpanding` / `RowSelection` / `ColumnSizing`.
// The symmetric DataGrid half is `data-grid/data-grid-config/registry.ts`.
//
// Adding a feature is: create one module file, then append its import and array
// entry to `index.ts` yourself, in the same change. No unit opens a spine file.
//
// Two invariants make this safe rather than merely tidy:
//
//  1. **Order is committed.** `FEATURE_ORDER` is design §3.5's pipeline order;
//     `index.ts` follows it and a test pins it, so a feature cannot silently
//     reorder the pipeline.
//  2. **Contributions are additive and collision-checked, ACROSS modules.** Two
//     modules may not set the same key; the composer throws rather than letting
//     the later one in the manifest silently win. The check is deliberately
//     *cross*-module, not within one call — a single feature legitimately
//     contributes several keys at once (the sorting option group is exactly
//     that), and a module may legitimately override a *base* value the render
//     context supplies as a default (`tree.loadState` is exactly that).

/* -------------------------------------------------------------------------- */
/*                              Committed order                               */
/* -------------------------------------------------------------------------- */

/**
 * The canonical pipeline order (design §3.5):
 *
 * ```text
 * core/tree relationships -> filter -> group roots -> sort -> tree expand
 * -> paginate -> virtual presentation
 * ```
 *
 * The four features with no pipeline stage of their own are placed rather than
 * appended: `columns` first because the column model shapes every later stage;
 * `selection` before `pagination` so page-scoped select-all is well defined;
 * `detail-expansion` after `pagination` because a detail row is a projection of
 * a record already on the page and consumes no page slot (ADR-0001, OQ-1);
 * `footer` after the row list exists; `persistence` last because it restores
 * into the slices every other feature owns.
 *
 * `tree` appears once though §3.5 names it twice (relationships, then expand) —
 * a module contributes its options once and the engine orders the two stages.
 */
export const FEATURE_ORDER = [
  'columns',
  'tree',
  'filtering',
  'grouping',
  'sorting',
  'selection',
  'pagination',
  'detail-expansion',
  'footer',
  'virtualization',
  'persistence',
] as const;

export type DataTableFeatureId = (typeof FEATURE_ORDER)[number];

/* -------------------------------------------------------------------------- */
/*                                  Contexts                                  */
/* -------------------------------------------------------------------------- */

/** Neutral style/class value types (design §5.2 pseudo-types). */
export type StyleValue = CSSProperties;
export type ClassValue = string | undefined;

/**
 * Which features are on, and with what configuration. Computed by the
 * controller, never by a module: identity logic — `getRowId` handling, the
 * identity-free/identity discrimination, reconciliation — stays in the
 * controller (ADR-0002 scope boundary). A module reads the verdict.
 */
export interface DataTableFeatureGates<TData> {
  readonly sortingEnabled: boolean;
  readonly filteringEnabled: boolean;
  readonly paginationEnabled: boolean;
  readonly manualSorting: boolean;
  readonly manualFiltering: boolean;
  readonly manualPagination: boolean;
  readonly manualGrouping: boolean;
  readonly treeEnabled: boolean;
  readonly detailEnabled: boolean;
  readonly hasSubRows: boolean;
  /**
   * The caller's raw subrow accessor, when supplied. `getSubRows` on its own
   * means tree, with or without a `tree` config: without subrows a `tree` config
   * has nothing to reveal, and with them the caller has already described a tree.
   */
  readonly getSubRows?: (row: TData, index: number) => TData[] | undefined;
  /** Detail-domain expandability. Never TanStack's `getRowCanExpand`, whose
   *  subrow-based default is tree truth (ADR-0001). */
  readonly canExpandDetail: (row: Row<TData>) => boolean;
  /**
   * Which slice TanStack's single `expanded` feature is bound to. Computed
   * before `useReactTable` runs and read inside `onExpandedChange`, so it is the
   * *second* thing that must not be hoisted — see `table` below.
   */
  readonly expandedSlice: 'detailExpanded' | 'treeExpanded';
  /**
   * The frozen legacy binding: `getRowCanExpand`/`renderExpandedRow` present and
   * no tree configured, so `expanded` stays a boolean carrier over
   * `detailExpanded` for column defs that call `row.getIsExpanded()`. Dies with
   * the aliases next major (design §10.8).
   */
  readonly legacyDetailBinding: boolean;
  readonly legacyCanExpand?: (row: Row<TData>) => boolean;
  readonly rowCount?: number;
  readonly pageCount?: number;
  /**
   * Slices the caller **controls**, as the own-keys of the controller's `state`
   * prop.
   *
   * **This exists because a resolved value cannot express "unset".** `ctx.state` is
   * the normalized snapshot, and `createDefaultDataTableState` populates every
   * slice — so a module reading it cannot tell a caller-supplied `sorting: []`
   * from the default empty sort. That is the whole of the hazard: the *falsy* face
   * of a missing answer looks like a deliberate one.
   *
   * `persistence` is the consumer, and the guarantee it owes is
   * `ui-spec/…/data-table/behavior.md:462-468` — a controlled slice is not
   * overwritten by a restore. Note that declining to *commit* is not enough:
   * `data-table-controller.ts` skips the local write for a controlled slice but
   * emits `onSliceChange`/`onStateChange` regardless, and a controlled caller
   * applying that event **is** the overwrite. So the only compliant behaviour is
   * not to request the change at all, which requires knowing this here.
   */
  readonly controlledSlices: ReadonlySet<DataTableSlice>;
  /**
   * Slices the caller pinned with **`defaultState`**, as its own-keys.
   *
   * Separate from `controlledSlices` because the two narrow different spans, and
   * merging them breaks the consumer in a way no restore-side test would show.
   * `ui-spec/…/data-grid/behavior.md:71` (Target P0) puts persistence below both
   * on the precedence ladder — "persistence restores only uncontrolled slices
   * absent from `defaultState`" — but a `defaultState` slice is only the caller's
   * *initial* value. After mount it is ordinary uncontrolled state a user can
   * change, and those changes must still be saved. So `defaultState` suppresses
   * **restore only**, where `state` suppresses restore **and** save.
   */
  readonly defaultedSlices: ReadonlySet<DataTableSlice>;
}

/**
 * What every contribution point sees.
 *
 * **`table` is a thunk, and that is load-bearing.** `onExpandedChange` reads
 * `table.getCoreRowModel().flatRows` inside a callback declared in the same
 * object literal that produces `table`; it is safe only because the callback
 * runs after construction. Handing a module the instance would mean handing it
 * `undefined`, silently, and the only test that reaches that argument is the
 * `ExpandedState === true` pair in `data-table-controller.test.tsx`.
 */
interface DataTableFeatureContextInternals<
  TData,
  RowId extends string = string,
> {
  /** The engine instance — call it, never destructure it. See above. */
  readonly table: () => Table<TData>;
  readonly state: DataTableState<RowId>;
  readonly gates: DataTableFeatureGates<TData>;
  /** Stable DOM id root for this table, for the §7 ARIA id schemes. */
  readonly tableId: string;
  readonly requestChange: <Slice extends DataTableSlice>(
    slice: Slice,
    updater: Updater<DataTableSliceValue<Slice, RowId>>,
    cause?: DataTableChangeCause
  ) => DataTableChangeEvent<Slice, DataTableSliceValue<Slice, RowId>, RowId>;
}

/**
 * The controller-built context. Carries `data` — the records **after** the
 * DataGrid layer has had its say — for one consumer only: `contextFor`, which
 * closes over it to build a module's `graftData`.
 *
 * **`data` is deliberately absent from the module-facing type.** The capability a
 * feature needs is "copy the correct array, keyed on an invalidation token", not
 * "read the rows during option build" — and a bare member would grant the second
 * to every module in order to give one module the first. Option-build time is
 * exactly where the memo hazards live, so a feature that genuinely needs to read
 * rows there has to come and ask, which is a review rather than a discovery.
 */
export interface DataTableFeatureContextBase<
  TData,
  RowId extends string = string,
> extends DataTableFeatureContextInternals<TData, RowId> {
  readonly data: readonly TData[];
}

/**
 * What a module actually receives: the base plus **its own** resolved config.
 *
 * `config` is deliberately **required and absent from the base**, so the base is
 * not assignable here and a caller cannot hand a module the shared context by
 * mistake. That mistake shipped once: the `effects` loop was wired by hand in the
 * controller rather than through a composer, passed the base directly, and every
 * `effects` consumer saw `config: undefined` — for a point whose first customer
 * had not landed, so nothing failed. It is the worst shape in the family, because
 * the context is nine-tenths correct: `table`, `state`, `gates`, `tableId` and
 * `requestChange` all work, so a feature built on it runs, renders, and silently
 * does nothing.
 *
 * The type split is the forcing function. Producing one of these is
 * `contextFor`'s job alone, and every point is invoked through a composer in this
 * file — there is no hand-built path left for a tenth point to repeat.
 */
export interface DataTableFeatureContext<
  TData,
  RowId extends string = string,
> extends DataTableFeatureContextInternals<TData, RowId> {
  /** The feature's own config value, as the controller resolved it. */
  readonly config: unknown;
  /**
   * The per-arrival copy for a feature contributing `data` back through
   * `engineOptions`, bound to the **correct** array — the post-`dataState` one.
   *
   * `generation` is the feature's own counter, bumped once per arrival. Generation
   * 0 returns the array unchanged, so the path before anything has loaded is
   * genuinely inert.
   *
   * ```ts
   * engineOptions(ctx) {
   *   return { data: ctx.graftData(myMachine.generation) };
   * }
   * ```
   *
   * Bound rather than handed the array, because the array is not something a
   * feature has any business reading at option-build time — see
   * `DataTableFeatureContextBase`.
   */
  graftData(generation: number): readonly TData[];
}

/**
 * What the view-side points see: `tableDisplayRows` and `renderDisplayRow`
 * directly, and `displayRows` / `classifyDisplayRow` / `rowPresentation` /
 * `columnPresentation` through the narrower contexts below.
 *
 * `viewProps` is here because a feature has to be able to see what the caller
 * asked the view for. The shipped detail projection is the proof: it renders a
 * detail row only when `renderExpandedRow` was supplied, so a module that could
 * not read the view's props would emit an empty row for every expanded record
 * and change the row counts `data-table.test.tsx` pins.
 */
export interface DataTableViewContextBase<
  TData,
  RowId extends string = string,
> extends DataTableFeatureContextBase<TData, RowId> {
  readonly visibleColumnCount: number;
  readonly recordRows: readonly Row<TData>[];
  readonly viewProps: DataTableViewProps<TData>;
}

/** The view-side context a module receives, with its own config attached. */
export interface DataTableViewFeatureContext<
  TData,
  RowId extends string = string,
> extends DataTableFeatureContext<TData, RowId> {
  readonly visibleColumnCount: number;
  readonly recordRows: readonly Row<TData>[];
  readonly viewProps: DataTableViewProps<TData>;
}

/** What `displayRows`, `classifyDisplayRow` and `rowPresentation` see. */
export interface DataTableDisplayRowContextBase<
  TData,
  RowId extends string = string,
> extends DataTableViewContextBase<TData, RowId> {
  readonly row: Row<TData>;
  /**
   * Index into the *record* row list, not the display-row list. Roving focus and
   * striping both index records (ADR-0001 consequence 6), so this is what a
   * contribution must carry forward.
   */
  readonly recordIndex: number;
  readonly isFirstRecord: boolean;
  readonly isLastRecord: boolean;
}

/** What `displayRows` / `classifyDisplayRow` / `rowPresentation` receive. */
export interface DataTableDisplayRowContext<
  TData,
  RowId extends string = string,
> extends DataTableViewFeatureContext<TData, RowId> {
  readonly row: Row<TData>;
  readonly recordIndex: number;
  readonly isFirstRecord: boolean;
  readonly isLastRecord: boolean;
}

/** What `columnPresentation` sees. `header` is absent for a body cell. */
export interface DataTableColumnContextBase<
  TData,
  RowId extends string = string,
> extends DataTableViewContextBase<TData, RowId> {
  readonly column: Column<TData, unknown>;
  readonly header?: Header<TData, unknown>;
}

/** What `columnPresentation` receives, with its own config attached. */
export interface DataTableColumnContext<
  TData,
  RowId extends string = string,
> extends DataTableViewFeatureContext<TData, RowId> {
  readonly column: Column<TData, unknown>;
  readonly header?: Header<TData, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                            Presentation shapes                             */
/* -------------------------------------------------------------------------- */

/**
 * Chrome a feature renders *inside* a `<TableHead>` — the header-cell seam
 * (ADR-0002, BL-3a). `data-table-view.tsx` builds `<TableHead>` with fixed
 * children and neither the `Table` pin hook nor a DataGrid body slot reaches
 * inside a header cell, so without this U3 has nowhere to put a resize handle or
 * a reorder grip.
 *
 * No `table.tsx` change is needed: `TableHead` merges `className` via `cn()` and
 * spreads props, so an `edge`-placed handle positions itself with
 * `className: 'relative'` from the same contribution.
 */
export interface ColumnAdornment {
  /** Unique across contributing features; a collision throws. */
  readonly id: string;
  readonly placement: 'before-label' | 'after-label' | 'edge';
  readonly node: ReactNode;
}

export interface ColumnPresentation {
  /** Applied to the column's `<TableHead>` and every `<TableCell>`. */
  readonly style?: StyleValue;
  readonly className?: ClassValue;
  /**
   * Rendered inside `<TableHead>` in placement order. The header-cell seam.
   *
   * **Hold discharged — filled.** It was held for U3 with U3's landing as the
   * expiry; U3 landed in `84aab170` and took it (`columns.tsx`
   * `columnPresentation` contributes the resize handle and reorder grip as
   * `edge` adornments). The expiry fired *satisfied*, which is the outcome a
   * dated hold exists to make legible: the same annotation that would have
   * demanded deletion is the one that records the fill.
   */
  readonly headerAdornments?: readonly ColumnAdornment[];
  /**
   * Pin the column to the start or end edge. Reaches `TableHead`/`TableCell`'s
   * own `pinned` hook, which is what sets `data-pinned`.
   *
   * **Hand-rolling this with `style` does not work**, and the failure is invisible
   * to a DOM test. `data-pinned` is the selector every pin-related specificity
   * step keys off — the z-ladder in `STICKY_HEADER`/`STICKY_FOOTER`, and crucially
   * the row's `hover:[&>[data-pinned]]` and
   * `data-[state=selected]:[&>[data-pinned]]` rules. A pinned cell is opaque, so
   * without `data-pinned` it repaints over the row's hover and selected tint and
   * the row state visibly stops applying to it.
   */
  readonly pinned?: TableColumnPin;
  /**
   * Distance from the pinned edge — the accumulated width of the columns pinned
   * before this one. The owner computes it; `Table` holds no column model.
   */
  readonly pinOffset?: number | string;
  /**
   * Set only on the column at a pinned region's **inner boundary**: the last
   * start-pinned column, and the first end-pinned column. Reaches
   * `TableHead`/`TableCell`'s `pinnedEdge` hook, which renders it as
   * `data-pinned-edge` for the divider rule to key off (PLTFRM-93276).
   *
   * Computed here rather than in `Table` for the same reason as `pinOffset`:
   * `Table` holds no column model, so it cannot know which pinned column is last
   * — and the answer depends on **visibility**, since a hidden column must not
   * hold the boundary. A region of exactly one column is both first and last.
   */
  readonly pinnedEdge?: TableColumnPin;
}

/**
 * Per-record-row presentation. Keyed by row, where `ColumnPresentation` is keyed
 * by column — without it `TableRow`'s `expanded`, `sticky` and `stickyOffset`
 * props are reachable from a hand-written composition and unreachable from any
 * feature module, which is the defect shape this registry exists to prevent.
 *
 * ── `className`, `expanded`, `sticky`, `stickyOffset`: reachable, PROVEN, and
 * without a production filler. Not a hold, and there is no expiry. ────────────
 *
 * **Proven reachable**, which is the part a contributor-side sweep cannot see:
 * `__tests__/data-table-seams.test.tsx:315-338` fills all four through a
 * `<Harness />` fixture and asserts each one arrives in the DOM —
 * `contributed-row`, `outlineWidth: 3px`, `data-expanded="true"`,
 * `--table-row-sticky-top: 12px` — with a companion test that an untargeted row
 * receives none of them, and an explicit assertion that `aria-expanded` is
 * absent. `table.tsx:547` carries the style rule behind it
 * (`data-[expanded=true]:bg-[var(--ui-table-data-row-color-hover)]`, and the
 * same for pinned children). So these are not inert and not unproven.
 *
 * **No shipped feature module fills them, and they stay anyway.** The reason is
 * the alternative-route question asked about the right subject — the **row**,
 * not the candidate feature. A feature that renders its own row has another
 * route: it sets the props on that `<TableRow>` directly, which is what
 * `grouping.tsx` does. But a **view-rendered record row** has no other route at
 * all, because a feature cannot render a record row — the view does, and
 * `composeRowPresentation` runs only on its `kind: 'data'` path. Deleting these
 * would remove the only route to a capability, not an unused member.
 *
 * **What was wrong here was the annotation, not the members.** Until #50 each of
 * the four was marked "held for U4, expiry: U4's landing". U4 could never have
 * filled any of them — for the mechanism reason just given — so the hold named a
 * consumer the seam cannot deliver to. A hold with no possible holder is the
 * permanent excuse rule 7d forbids; the fix is to stop calling it a hold, which
 * is what this docblock does. Do not re-add an expiry, and do not name a unit.
 */
export interface DataTableRowPresentation {
  readonly className?: ClassValue;
  readonly style?: StyleValue;
  /**
   * Reflected as `data-expanded` on the row, for styling.
   *
   * **This does not emit `aria-expanded`**, and must not: that attribute is
   * invalid on a row inside `role="table"` (fixed in `893bad2`; see
   * `TableRow`'s own `expanded` docs). This docblock claimed it did until the
   * reverse-direction sweep — the fix corrected the primitive's docstring and
   * missed this mirror, one layer up in a different file, which no sweep scoped
   * to the changed file could have found.
   *
   * Whether the shipped detail projection *should* set this for a record row with
   * an open panel is a live spec question, not a cleanup — see #79. Today a group
   * header looks open and such a record row does not, and either answer changes
   * what a user sees.
   */
  readonly expanded?: boolean;
  /** Pins the row inside the scroll container. See the seam docblock above. */
  readonly sticky?: boolean;
  /** Distance from the pinned edge. See `sticky`. */
  readonly stickyOffset?: number | string;
}

/**
 * Fields a feature adds to the render contexts, as **per-subject resolvers**.
 *
 * ADR-0002 sketched this as a flat record of fields, which cannot work:
 * `renderContext` is invoked once per table, and the fields Wave 1 needs are
 * per-row or per-header. U2's lazy-children `loadState` is keyed by row ID and
 * U7's faceted values are keyed by column, so a table-scoped record has nothing
 * to key on. A resolver covers both cases — a per-table constant is a closure
 * that ignores its argument.
 *
 * Namespaced by context so two features touching different contexts never
 * collide, and merged *over* the base context so a feature may replace a default
 * the base supplies (`tree.loadState` ships as `'idle'` and becomes real when the
 * `tree` feature lands).
 */
export interface DataTableRenderContextContribution<TData> {
  /**
   * Filled by `tree.ts` (`tree.loadState`) and `detail-expansion.tsx`
   * (`detail.canExpand`, and `detail.toggle` in accordion mode). Exercised
   * end-to-end in `__tests__/data-table-render-context-seam.test.tsx` under
   * `useDataTable({ getSubRows, tree: {}, defaultState: { treeExpanded } })`.
   */
  readonly row?: (row: Row<TData>) => Readonly<Record<string, unknown>>;
  /**
   * Filled by `columns.tsx` (the `columns` namespace — `DataTableColumnControls`).
   * Exercised in `__tests__/data-table-columns-features.test.tsx` under
   * `columnsFeatures` with `reordering`/`pinning`/`lockedColumnIds`.
   */
  readonly header?: (
    header: Header<TData, unknown>
  ) => Readonly<Record<string, unknown>>;
  // There is deliberately no `cell` scope. It existed, was filled by no module and
  // claimed by no unit, and #50 deleted it along with its collection here and the
  // merge in `createCellContext`. The bar for re-adding it is a field keyed on the
  // **column**, or on the (row, column) pair — a **row**-keyed field already reaches
  // a cell consumer, because `DataTableCellContext.row` is the whole row context and
  // the `row` scope above fills it. Recorded in the grammar ledger with
  // `rowPresentation.expanded` as the paired opposite outcome: same rule, and that
  // one was KEPT precisely because no alternative route existed.
}

/** The composed resolvers, ready to be merged into a context. */
export interface DataTableRenderContextResolvers<TData> {
  readonly row: readonly RenderContextResolver<Row<TData>>[];
  readonly header: readonly RenderContextResolver<Header<TData, unknown>>[];
}

interface RenderContextResolver<Subject> {
  readonly featureId: DataTableFeatureId;
  readonly resolve: (subject: Subject) => Readonly<Record<string, unknown>>;
}

/* -------------------------------------------------------------------------- */
/*                              The module shape                              */
/* -------------------------------------------------------------------------- */

export interface DataTableFeatureModule<
  TData = unknown,
  RowId extends string = string,
> {
  readonly id: DataTableFeatureId;

  /** Conditional TanStack options this feature contributes, or nothing. */
  engineOptions?(
    ctx: DataTableFeatureContext<TData, RowId>
  ): Partial<TableOptions<TData>>;

  /**
   * Reclassifies a record row this feature owns — `undefined` to leave it a
   * `data` row. At most one module may claim a given row.
   *
   * This exists because `getGroupedRowModel()` puts group rows *into*
   * `getRowModel().rows` (`row.getIsGrouped()`), so a group header is a
   * reclassification of a row already in the list, not an insertion.
   * `ui-spec/components/data-table/behavior.md:424` ("only root rows are
   * classified") says the same thing.
   */
  classifyDisplayRow?(
    ctx: DataTableDisplayRowContext<TData, RowId>
  ): DataTableDisplayRow<TData> | undefined;

  /** Display rows this feature appends after a given record row. */
  displayRows?(
    ctx: DataTableDisplayRowContext<TData, RowId>
  ): readonly DataTableDisplayRow<TData>[];

  /**
   * Display rows scoped to the whole table rather than to one record row. A
   * table-level footer row hangs off no record, so it cannot come from
   * `displayRows`.
   */
  tableDisplayRows?(
    ctx: DataTableViewFeatureContext<TData, RowId>
  ): readonly DataTableDisplayRow<TData>[];

  /**
   * Renders a display-row kind this feature owns. Required for every kind the
   * feature's `displayRows`/`tableDisplayRows`/`classifyDisplayRow` can emit,
   * other than `kind: 'data'`, which the view renders itself.
   *
   * Return `undefined` for a kind this feature does not own — the dispatcher
   * moves on to the next module. Return `null` to own the kind and deliberately
   * render nothing. A kind no module owns throws rather than rendering a blank
   * row nobody could trace to a missing module.
   */
  renderDisplayRow?(
    displayRow: DataTableDisplayRow<TData>,
    ctx: DataTableViewFeatureContext<TData, RowId>
  ): ReactNode;

  /** Fields this feature adds to the row/header/cell render contexts. */
  renderContext?(
    ctx: DataTableFeatureContext<TData, RowId>
  ): DataTableRenderContextContribution<TData>;

  /** Per-record-row presentation. */
  rowPresentation?(
    ctx: DataTableDisplayRowContext<TData, RowId>
  ): DataTableRowPresentation | undefined;

  /** Per-column presentation, including the header-cell adornment slot. */
  columnPresentation?(
    ctx: DataTableColumnContext<TData, RowId>
  ): ColumnPresentation | undefined;

  /**
   * A React hook this feature needs to run once per render, in manifest order.
   * Hook order is stable because the manifest is a static ordered list, so the
   * usual objection to calling hooks from a list does not apply here.
   *
   * U10's restore engine is the reason this exists: the plan puts the restore
   * *mechanism* in DataTable, and without an effects seam that decision is
   * unimplementable from a feature module.
   */
  effects?(ctx: DataTableFeatureContext<TData, RowId>): void;
}

/**
 * Declares a feature module with `TData` inference inside the module file, then
 * erases it for the heterogeneous manifest array. Mirrors
 * `defineDataGridConfig` on the DataGrid side.
 */
export function defineDataTableFeature<TData, RowId extends string = string>(
  module: DataTableFeatureModule<TData, RowId>
): DataTableFeatureModule {
  return module as unknown as DataTableFeatureModule;
}

/* -------------------------------------------------------------------------- */
/*                                 Composers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors `data-grid-config/compose.ts`'s check so both halves of the registry
 * report a collision the same way. `owners` is per-compose-call, so the check is
 * cross-module by construction.
 */
function assertNoCollision(
  seam: string,
  owners: Map<string, DataTableFeatureId>,
  featureId: DataTableFeatureId,
  key: string
): void {
  const previous = owners.get(key);
  if (previous !== undefined) {
    throw new TypeError(
      `DataTable: feature modules "${previous}" and "${featureId}" both set ${seam} "${key}". A module may not overwrite another module's contribution.`
    );
  }
  owners.set(key, featureId);
}

/**
 * The view-side twin of `contextFor`: strips `data` and attaches the module's own
 * config and bound `graftData`. One helper rather than a spread at each call site,
 * for the reason the `effects` loop taught — a point wired by its own code path is
 * a point that drifts from the others.
 */
export function viewContextFor<TData, RowId extends string>(
  base: DataTableViewContextBase<TData, RowId>,
  module: DataTableFeatureModule,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): DataTableViewFeatureContext<TData, RowId> {
  const { data, ...internals } = base;

  return {
    ...internals,
    config: configs[module.id],
    graftData: (generation) => graftedData(data, generation),
  };
}

function contextFor<TData, RowId extends string>(
  base: DataTableFeatureContextBase<TData, RowId>,
  module: DataTableFeatureModule,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): DataTableFeatureContext<TData, RowId> {
  // `data` is destructured off deliberately: it reaches a module only through the
  // bound `graftData`, never as a readable member.
  const { data, ...internals } = base;

  return {
    ...internals,
    config: configs[module.id],
    graftData: (generation) => graftedData(data, generation),
  };
}

/**
 * Folds every module's TanStack options into the single `useReactTable({…})`
 * option set, throwing if two modules set the same option.
 *
 * The caller's `engineOptions` allowlist is spread separately by the controller
 * and cannot collide: its only members are the six `debug*` keys plus
 * `renderFallbackValue`, none of which any feature sets.
 */
export function composeEngineOptions<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  base: DataTableFeatureContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): Partial<TableOptions<TData>> {
  const owners = new Map<string, DataTableFeatureId>();
  const options: Record<string, unknown> = {};

  for (const module of modules) {
    if (module.engineOptions === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const contribution = typed.engineOptions!(
      contextFor(base, module, configs)
    ) as Record<string, unknown>;

    for (const [key, value] of Object.entries(contribution)) {
      if (value === undefined) {
        continue;
      }
      assertNoCollision('engine option', owners, module.id, key);
      options[key] = value;
    }
  }

  return options as Partial<TableOptions<TData>>;
}

/**
 * The per-arrival copy a feature contributing `data` must use.
 *
 * `getCoreRowModel` is `memo(() => [table.options.data], …)` — memoized on **`data`
 * identity alone**. So when a lazy loader's children arrive, returning them from
 * `getSubRows` is not enough: the row model does not re-walk until `data` is a
 * different array. A shallow copy is the entire mechanism. Measured both ways —
 * with the copy the child enters `flatRows`; without it the child never arrives
 * even though the children are in the store and a render happened.
 *
 * This is shipped rather than documented because the failure mode is asymmetric
 * and quiet. Copy too rarely and children never appear. Copy on **every** render —
 * which is what a hand-written version does by default — and the row model rebuilds
 * continuously instead of never, on a component whose entire purpose is large
 * datasets. That is correctness-neutral, so no test catches it; "remember to
 * memoize" is not a mechanism.
 *
 * `generation` is the feature's own counter, bumped once per arrival. **Generation
 * 0 returns `data` unchanged** — not a copy, not an empty array: before anything
 * has arrived the inert path must be genuinely inert.
 *
 * Cached on the `data` array itself, so it releases when the caller's array does
 * and no per-table cleanup is needed.
 */
export function graftedData<TData>(
  data: readonly TData[],
  generation: number
): readonly TData[] {
  if (generation === 0) {
    return data;
  }
  const cached = graftCache.get(data);
  if (cached !== undefined && cached.generation === generation) {
    return cached.value as readonly TData[];
  }
  const value = [...data];
  graftCache.set(data, { generation, value });

  return value;
}

const graftCache = new WeakMap<
  object,
  { generation: number; value: readonly unknown[] }
>();

/**
 * Runs every module's `effects` hook, in manifest order, each with **its own**
 * config.
 *
 * This lives here rather than in the controller for one reason: it used to be a
 * hand-written loop in `useDataTable` that passed the shared base context
 * directly, so `ctx.config` was `undefined` for every consumer. The other two
 * points went through `contextFor` and were correct; nothing forced the third to
 * agree. Now all three are composers in this file, and the base type has no
 * `config` to give — so a fourth point cannot repeat it without failing to
 * compile.
 *
 * Hook order is stable because the manifest is a static ordered list, which is
 * what makes calling hooks from a list safe here.
 */
export function runFeatureEffects<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  base: DataTableFeatureContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): void {
  for (const module of modules) {
    if (module.effects === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    typed.effects!(contextFor(base, module, configs));
  }
}

/**
 * Collects every module's render-context resolvers, per scope, in manifest order.
 * Nothing is invoked here — the resolvers run per row/header/cell, where
 * `mergeRenderContextFields` merges them and enforces the collision rule.
 */
export function composeRenderContext<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  base: DataTableFeatureContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): DataTableRenderContextResolvers<TData> {
  const row: RenderContextResolver<Row<TData>>[] = [];
  const header: RenderContextResolver<Header<TData, unknown>>[] = [];

  for (const module of modules) {
    if (module.renderContext === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const contribution = typed.renderContext!(
      contextFor(base, module, configs)
    );

    if (contribution.row !== undefined) {
      row.push({ featureId: module.id, resolve: contribution.row });
    }
    if (contribution.header !== undefined) {
      header.push({ featureId: module.id, resolve: contribution.header });
    }
  }

  return { row, header };
}

/**
 * Merges one scope's resolvers for one subject. Two features setting the same
 * field is a collision; a feature replacing a field the *base* context already
 * set is not — that is how a default becomes real.
 */
export function mergeRenderContextFields<Subject>(
  seam: string,
  resolvers: readonly RenderContextResolver<Subject>[],
  subject: Subject
): Readonly<Record<string, unknown>> {
  if (resolvers.length === 0) {
    return EMPTY_FIELDS;
  }

  const owners = new Map<string, DataTableFeatureId>();
  const merged: Record<string, unknown> = {};

  for (const resolver of resolvers) {
    for (const [key, value] of Object.entries(resolver.resolve(subject))) {
      assertNoCollision(seam, owners, resolver.featureId, key);
      merged[key] = value;
    }
  }

  return merged;
}

const EMPTY_FIELDS: Readonly<Record<string, unknown>> = Object.freeze({});

/** Merges every module's row presentation for one display row. */
export function composeRowPresentation<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  ctx: DataTableDisplayRowContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): DataTableRowPresentation {
  const owners = new Map<string, DataTableFeatureId>();
  const classNames: string[] = [];
  let style: CSSProperties | undefined;
  const merged: Record<string, unknown> = {};

  for (const module of modules) {
    if (module.rowPresentation === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const contribution = typed.rowPresentation!({
      ...viewContextFor(ctx, module, configs),
      row: ctx.row,
      recordIndex: ctx.recordIndex,
      isFirstRecord: ctx.isFirstRecord,
      isLastRecord: ctx.isLastRecord,
    });
    if (contribution === undefined) {
      continue;
    }

    // Classes and styles accumulate — several features legitimately decorate one
    // row. The discrete flags do not: two features disagreeing about whether a
    // row is expanded is a bug, not a merge.
    if (contribution.className !== undefined) {
      classNames.push(contribution.className);
    }
    if (contribution.style !== undefined) {
      style = { ...style, ...contribution.style };
    }
    for (const key of ['expanded', 'sticky', 'stickyOffset'] as const) {
      const value = contribution[key];
      if (value === undefined) {
        continue;
      }
      assertNoCollision('row presentation', owners, module.id, key);
      merged[key] = value;
    }
  }

  return {
    ...(classNames.length ? { className: classNames.join(' ') } : {}),
    ...(style === undefined ? {} : { style }),
    ...merged,
  };
}

/** Merges every module's presentation for one column. */
export function composeColumnPresentation<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  ctx: DataTableColumnContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): ColumnPresentation {
  const adornmentIds = new Map<string, DataTableFeatureId>();
  const pinOwners = new Map<string, DataTableFeatureId>();
  const classNames: string[] = [];
  const adornments: ColumnAdornment[] = [];
  const merged: Record<string, unknown> = {};
  let style: CSSProperties | undefined;

  for (const module of modules) {
    if (module.columnPresentation === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const contribution = typed.columnPresentation!({
      ...viewContextFor(ctx, module, configs),
      column: ctx.column,
      ...(ctx.header === undefined ? {} : { header: ctx.header }),
    });
    if (contribution === undefined) {
      continue;
    }

    if (contribution.className !== undefined) {
      classNames.push(contribution.className);
    }
    if (contribution.style !== undefined) {
      style = { ...style, ...contribution.style };
    }
    for (const adornment of contribution.headerAdornments ?? []) {
      assertNoCollision(
        'header adornment',
        adornmentIds,
        module.id,
        adornment.id
      );
      adornments.push(adornment);
    }
    // Same rule as `rowPresentation`'s discrete flags: two features disagreeing
    // about which edge a column is pinned to is a bug, not something to merge.
    // `pinnedEdge` is in this list for the same reason as the other two: the merge
    // copies a whitelist, so a presentation key missing from it is dropped in
    // silence. Adding `pinnedEdge` to `ColumnPresentation` and forgetting this line
    // produced a flag the engine computed correctly, the view forwarded, and no cell
    // ever received (PLTFRM-93276).
    for (const key of ['pinned', 'pinOffset', 'pinnedEdge'] as const) {
      const value = contribution[key];
      if (value === undefined) {
        continue;
      }
      assertNoCollision('column presentation', pinOwners, module.id, key);
      merged[key] = value;
    }
  }

  return {
    ...(classNames.length ? { className: classNames.join(' ') } : {}),
    ...(style === undefined ? {} : { style }),
    ...(adornments.length
      ? { headerAdornments: sortAdornments(adornments) }
      : {}),
    ...merged,
  };
}

const ADORNMENT_PLACEMENT_ORDER: readonly ColumnAdornment['placement'][] = [
  'before-label',
  'after-label',
  'edge',
];

/** Placement order, stable within a placement (manifest order decides ties). */
function sortAdornments(
  adornments: readonly ColumnAdornment[]
): readonly ColumnAdornment[] {
  return [...adornments].sort(
    (left, right) =>
      ADORNMENT_PLACEMENT_ORDER.indexOf(left.placement) -
      ADORNMENT_PLACEMENT_ORDER.indexOf(right.placement)
  );
}

/**
 * Dispatches a non-`data` display row to the feature that owns its kind.
 *
 * Throws when no module renders the kind. That is deliberate: F2 ships the
 * `group`, `tree-status` and `footer` kinds with no renderer, and a kind that
 * silently rendered nothing would be a blank row nobody could trace back to a
 * missing module.
 */
export function renderDisplayRow<TData, RowId extends string>(
  modules: readonly DataTableFeatureModule[],
  displayRow: DataTableDisplayRow<TData>,
  ctx: DataTableViewContextBase<TData, RowId>,
  configs: Readonly<Partial<Record<DataTableFeatureId, unknown>>>
): ReactNode {
  for (const module of modules) {
    if (module.renderDisplayRow === undefined) {
      continue;
    }
    const typed = module as DataTableFeatureModule<TData, RowId>;
    const rendered = typed.renderDisplayRow!(
      displayRow,
      viewContextFor(ctx, module, configs)
    );
    if (rendered !== undefined) {
      return rendered;
    }
  }

  throw new TypeError(
    `DataTable display row kind "${displayRow.kind}" has no renderer. The feature that emits a kind must also render it.`
  );
}
