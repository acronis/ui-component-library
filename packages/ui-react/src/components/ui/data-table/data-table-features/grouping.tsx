import type { ReactNode } from 'react';
import {
  getGroupedRowModel,
  getMemoOptions,
  memo,
  type Row,
  type RowModel,
  type Table,
} from '@tanstack/react-table';

import { TableCell, TableRow } from '../../table';
import type { DataTableState } from '../data-table-contract';
import { defineDataTableFeature } from './registry';
import { resolveUpdater } from './translate';

// OWNERSHIP: created by F2 with the shipped state wiring; **U4 owns this file**.
//
// `grouping` classifies **root rows only** while each root's descendant tree
// stays attached (design §3.5/§6.6). That half needs no code, verified against
// `@tanstack/table-core@8.21.3`: `getGroupedRowModel` groups
// `getPreGroupedRowModel().rows` — the roots, with descendants already nested —
// and once the grouping depth is met it re-walks `row.subRows`, rewriting
// `depth`/`parentId` rather than regrouping them. The shape the plan promised is
// the shape the library produces.
//
// ── Why this module owns `getExpandedRowModel` ───────────────────────────────
//
// Group rows do NOT arrive in `getRowModel().rows` with their members. The grouped
// row model puts **only group rows** in `rows` and nests each group's members in
// that group row's `subRows`; the members reach the rendered list at the *expand*
// stage. And the stock `getExpandedRowModel()` short-circuits before flattening:
//
//     if (!rowModel.rows.length || expanded !== true && !Object.keys(expanded ?? {}).length)
//       return rowModel;
//
// `state.expanded` is `{}` whenever nothing in `treeExpanded` is open, so under the
// stock model a grouped table renders group headers and **no members** — and
// neither `row.getIsExpanded()` nor `options.getIsRowExpanded` is ever consulted,
// which is why a collapse slice of our own cannot drive the stock model no matter
// how it is wired. Hence `groupAwareExpandedRowModel` below, which always flattens.
//
// It is a strict superset of what `tree` contributes: for every non-group row it
// asks `row.getIsExpanded()`, so tree expansion keeps working underneath a grouped
// model. That is what makes the handover safe, and the handover is real —
// `tree.ts` contributes the stock model only while `ctx.state.grouping` is empty,
// so exactly one module owns the option in every configuration. Both read the same
// live value in the same render, so there is no state where neither or both
// contribute. `__tests__/data-table-grouping.test.tsx` asserts the
// tree-and-grouping case, because that assertion is the only thing standing
// between us and a silent regression if the guard in `tree.ts` is ever removed.
//
// ── Collapse takes its own slice ────────────────────────────────────────────
//
// `groupCollapsed`, not `treeExpanded` (design §6.5). A group ID is synthetic —
// TanStack mints `` `${columnId}:${value}` `` — so keying it into a row-ID slice
// invites a collision with a real ID and puts entries a caller never wrote into
// their controlled `treeExpanded`. See the slice's doc in `data-table-contract.ts`.
//
// ── What this file deliberately does not do ─────────────────────────────────
//
//  - **No `rowPresentation`.** The template this file replaced said `sticky` would
//    come from there. It cannot: `composeRowPresentation` is called only from
//    `renderRecordRow`, which the view runs for `kind: 'data'` rows alone, so a
//    group row never reaches that point. `sticky` is set on the `<TableRow>` this
//    module renders instead — which is what the features README predicted ("more
//    likely sets it directly in its own `renderDisplayRow`").
//  - **No per-column aggregate cells.** The group row is one spanning cell. Design
//    §5.2 gives grouping no aggregate members — aggregation is the `footer`
//    feature's (U5) — and the plan's U4 scope lists none. A caller who wants them
//    renders them through `renderGroup`.
//  - **No `enableGrouping`.** It gates `column.getCanGroup()`, which the grouped
//    row model never consults; see `allowedColumns` in `engineOptions`.
//  - **No formatting.** Design §4.3: DataTable owns the model, DataGrid owns the
//    presentation. With no `renderGroup` this module emits the group's name and
//    member count as text and nothing else — the same split as `footer.render`.

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

/** Which of a group's rows a group-scoped selection command targets. */
export type DataTableGroupSelectionScope =
  'visible-leaves' | 'all-loaded-leaves';

/** The ungrouped bucket's policy: whether it shows, its name, where it sits. */
export interface DataTableUngroupedPolicy {
  readonly show?: boolean;
  readonly name?: string;
  readonly position?: 'first' | 'last';
}

/**
 * Group-scoped selection over the group's **eligible** rows, per `selectionScope`.
 *
 * Hand-computed for exactly one reason: TanStack ships page- and table-scoped
 * predicates only (`getIsAllPageRowsSelected`, `toggleAllPageRowsSelected`) and no
 * group-scoped equivalent. There is nothing to reuse, so the three-way count is
 * written out here.
 *
 * **It deliberately matches TanStack's semantics rather than departing from them.**
 * `getIsAllPageRowsSelected` filters to `row.getCanSelect()` before comparing
 * (`RowSelection.js:197`), so eligibility is *excluded* from the question rather
 * than counted as unselected — and this does the same. An earlier version of this
 * comment claimed the opposite, that TanStack "ignores ineligible rows" and so
 * over-reports; that was a misreading, checked against the source and confirmed at
 * runtime (1 eligible-and-selected + 2 ineligible reports `all`, not `some`).
 *
 * The consequence that *is* real, and is a fact about arithmetic rather than about
 * TanStack: **a group with one eligible member can never show the mixed state**,
 * because one-of-one selected genuinely is all of them. A test that wants mixed
 * needs at least two eligible members per group.
 */
export interface DataTableGroupSelection {
  /** Over the eligible rows in scope, not over all of them. */
  readonly state: 'none' | 'some' | 'all';
  /** How many rows in scope `row.getCanSelect()` admits. */
  readonly eligibleCount: number;
  /**
   * Selects or clears every eligible row in scope. Omitting `selected` selects
   * unless the group is already fully selected, except from the mixed state,
   * where the `selectAllOnIndeterminate` policy decides.
   */
  readonly toggle: (selected?: boolean) => void;
}

/** What `renderGroup` is told about the group row it is rendering. */
export interface DataTableGroupContext<TData> {
  /** The synthetic group ID (`${columnId}:${value}`). Never a record ID (§6.5). */
  readonly groupId: string;
  /** The column this level groups by. */
  readonly columnId: string;
  /** The grouping value, or `undefined` for the ungrouped bucket. */
  readonly value: unknown;
  /**
   * The group's display name, already resolved — the stringified value, or the
   * `ungrouped.name` policy for the ungrouped bucket. Resolved here so a renderer
   * cannot disagree with the policy.
   */
  readonly name: string;
  /** `true` when this is the bucket of records with no grouping value. */
  readonly isUngrouped: boolean;
  /** Nesting depth for multi-column grouping; 0 at the top level. */
  readonly depth: number;
  readonly collapsed: boolean;
  /** `false` pins the group open and should hide the disclosure. */
  readonly collapsible: boolean;
  /** Collapses or expands this group. A no-op when `collapsible` is `false`. */
  readonly toggle: () => void;
  /** Every loaded data row under this group, tree descendants included. */
  readonly rows: readonly TData[];
  /** How many data rows the group holds — `rows.length`, named for the label. */
  readonly rowCount: number;
  /** Column count, for a spanning cell. */
  readonly colSpan: number;
  readonly selection: DataTableGroupSelection;
}

/**
 * Grouping behavior: which columns may group, how a group row renders, whether it
 * collapses or sticks, the group-selection scope, and the ungrouped bucket.
 *
 * Every member is optional by design — the owning unit tightens optionality
 * inside this file (registry rule 5). Design §5.2 makes `allowedColumns` required
 * at the *DataGrid* layer.
 *
 * `TData` carries a default so `DataTableGroupingConfig` stays valid bare, which
 * is how `data-table-controller.ts` references it. A direct-DataTable caller's
 * `renderGroup` is therefore typed over `unknown` rows; DataGrid callers are
 * unaffected, because `DataGridGroupingConfig<TData>` is generic and the config
 * layer is type-erased to `unknown` regardless.
 */
export interface DataTableGroupingConfig<TData = unknown> {
  /**
   * Page each group's members independently, this many rows at a time
   * (PLTFRM-93295). Omitted or `0` means no per-group paging, which is the default
   * and what every existing caller gets.
   *
   * **This is the page size only; the page indices are state** — the
   * `groupPagination` slice, keyed by group ID. Configuration decides the window,
   * state decides which window, exactly as `pagination` splits `pageSize` from
   * `pageIndex`.
   *
   * Independent of grid-wide `pagination`, and the two compose in one direction
   * only: grid pagination slices the flat row list first, so a group's own pager
   * pages what survived that slice. Running both is legal and confusing, which is
   * why the DataGrid layer warns.
   */
  readonly pageSize?: number;
  readonly allowedColumns?: readonly string[];
  readonly collapsible?: boolean;
  readonly sticky?: boolean;
  readonly selectionScope?: DataTableGroupSelectionScope;
  readonly ungrouped?: DataTableUngroupedPolicy;
  /**
   * What activating a **mixed** group checkbox does: select every eligible row in
   * scope (`true`, the default) or clear them (`false`).
   *
   * **A threaded value, not an independent policy.** It is the same question
   * `selection.selectAllOnIndeterminate` answers for the header control, and
   * DataGrid passes its resolved `selection` value down to here. It is repeated on
   * this config only because the group control is rendered by this feature and has
   * no other route to the answer — which is why the default matches. Two members
   * governing one question with opposite defaults in one config is the trap this
   * avoids.
   */
  readonly selectAllOnIndeterminate?: boolean;
  /**
   * Renders the group row's content. Receives the whole group context rather than
   * design §5.2's bare group value, which is a superset: a renderer given only the
   * value would have to re-derive the collapse command, the member count, and the
   * ungrouped-name policy this layer has already resolved.
   *
   * With no renderer the row carries the name and member count as text. DataGrid
   * supplies its own (§4.3).
   */
  readonly renderGroup?: (context: DataTableGroupContext<TData>) => ReactNode;
}

/** Design §5.2's ungrouped default: visible, named "Ungrouped", placed last. */
export const DATA_TABLE_UNGROUPED_DEFAULT_NAME = 'Ungrouped';

/* -------------------------------------------------------------------------- */
/*                              Resolved policy                               */
/* -------------------------------------------------------------------------- */

interface ResolvedUngrouped {
  readonly show: boolean;
  readonly name: string;
  readonly position: 'first' | 'last';
}

interface ResolvedGrouping<TData> {
  readonly collapsible: boolean;
  readonly sticky: boolean;
  readonly selectionScope: DataTableGroupSelectionScope;
  readonly selectAllOnIndeterminate: boolean;
  readonly ungrouped: ResolvedUngrouped;
  readonly allowedColumns?: readonly string[];
  readonly renderGroup?: (context: DataTableGroupContext<TData>) => ReactNode;
}

/** Shared empty map, so an unpaged table allocates nothing per memo pass. */
const EMPTY_GROUP_PAGES: ReadonlyMap<string, number> = new Map();

const EMPTY_COLLAPSED: ReadonlySet<string> = new Set<string>();

function configOf<TData>(
  config: unknown
): DataTableGroupingConfig<TData> | undefined {
  return config === undefined || config === false || config === null
    ? undefined
    : (config as DataTableGroupingConfig<TData>);
}

/**
 * `selectionScope` defaults to `'all-loaded-leaves'`, which is design §5.2's
 * "leaf-descendants" default read literally: the descendants, not the ones that
 * happen to be on screen. It is also the only default that keeps the control live
 * — under `'visible-leaves'` a *collapsed* group has no rows in scope, so its
 * checkbox is legitimately empty and disabled rather than silently inert.
 */
function resolvePolicy<TData>(
  config: DataTableGroupingConfig<TData>
): ResolvedGrouping<TData> {
  return {
    collapsible: config.collapsible ?? true,
    sticky: config.sticky ?? false,
    selectionScope: config.selectionScope ?? 'all-loaded-leaves',
    selectAllOnIndeterminate: config.selectAllOnIndeterminate ?? true,
    ungrouped: {
      show: config.ungrouped?.show ?? true,
      name: config.ungrouped?.name ?? DATA_TABLE_UNGROUPED_DEFAULT_NAME,
      position: config.ungrouped?.position ?? 'last',
    },
    ...(config.allowedColumns === undefined
      ? {}
      : { allowedColumns: config.allowedColumns }),
    ...(config.renderGroup === undefined
      ? {}
      : { renderGroup: config.renderGroup }),
  };
}

/* -------------------------------------------------------------------------- */
/*                   Reading the collapse slice at call time                   */
/* -------------------------------------------------------------------------- */

/**
 * The controller publishes its normalized state on a private option, and reading
 * it there — rather than closing over `ctx.state` — is load-bearing.
 *
 * `table.getExpandedRowModel()` calls `table.options.getExpandedRowModel(table)`
 * **once** and caches the closure it returns for the table's lifetime, so a
 * closure built over this render's `ctx.state` would serve every later render with
 * the first render's collapse set — collapsing a group would change state and
 * render nothing. Reading through `table` reads the current value;
 * `useReactTable` refreshes `table.options` every render, which the controller's
 * own `getState()` already relies on.
 *
 * `tree.ts` solves the same "read live state from a closure built once" problem
 * with a `Map` keyed by `tableId`, because what it needs is published by `effects`
 * and cannot live on the options. A plain state slice can, so this needs no
 * module-level store and no unmount cleanup.
 */
interface ControllerCarriedOptions {
  readonly __dataTableState?: Pick<
    DataTableState,
    'groupCollapsed' | 'groupPagination'
  >;
  readonly __dataTableFeatures?: {
    readonly configs: { readonly grouping?: unknown };
  };
}

/**
 * The collapse set and the ungrouped policy, as of **this** call.
 *
 * Both have to be read here rather than passed in, and for the same reason: the
 * factory below runs once per table, so anything captured in it is frozen at the
 * first render. Passing the policy in as an argument looked harmless and was not —
 * a caller changing `ungrouped.position` after mount would have been ignored for
 * the life of the table, with the first render's answer still on screen.
 */
function liveGrouping<TData>(table: Table<TData>): {
  readonly collapsed: ReadonlySet<string>;
  readonly ungrouped: ResolvedUngrouped;
  /** 0 disables per-group paging (PLTFRM-93295). */
  readonly groupPageSize: number;
  readonly groupPages: ReadonlyMap<string, number>;
} {
  const options = table.options as unknown as ControllerCarriedOptions;
  const config =
    configOf<unknown>(options.__dataTableFeatures?.configs.grouping) ?? {};

  return {
    collapsed: options.__dataTableState?.groupCollapsed ?? EMPTY_COLLAPSED,
    ungrouped: resolvePolicy(config).ungrouped,
    // Coerced here rather than trusted: a negative or fractional page size would
    // make the slice arithmetic produce an empty window, which looks like the group
    // lost its rows.
    groupPageSize: Math.max(0, Math.floor(config.pageSize ?? 0)),
    groupPages: options.__dataTableState?.groupPagination ?? EMPTY_GROUP_PAGES,
  };
}

/* -------------------------------------------------------------------------- */
/*                        The group-aware expanded model                      */
/* -------------------------------------------------------------------------- */

/**
 * The group's grouping value, before `groupBy` stringified it.
 *
 * A group row's own `getValue` short-circuits for a grouping column and returns
 * the first member's raw value, so asking the group row is the same answer as
 * asking a member — and it stays correct for a column carrying a custom
 * `getGroupingValue`, which is applied to `row.original` (the first member's
 * record).
 */
function groupingValueOf<TData>(row: Row<TData>, columnId: string): unknown {
  return row.getGroupingValue(columnId);
}

/**
 * `true` for the bucket of records whose grouping value is absent or empty.
 *
 * Asked of the **value**, not of `row.groupingValue`: `groupBy` keys its map by
 * `` `${row.getGroupingValue(columnId)}` ``, so `groupingValue` is already the
 * *string* `'undefined'`/`'null'`, and comparing against those strings would file a
 * record whose value is literally `"null"` into the bucket.
 *
 * **Inherited limitation, measured rather than assumed:** that stringification
 * happens in the row model, above this check, so a real `null` and the string
 * `"null"` are already **one group** by the time it runs — they cannot be
 * separated from here. The group is then classified by its first member, so such a
 * group is treated as a normal group named `"null"` rather than as the bucket.
 * Characterized in `data-table-grouping.test.tsx` so the behaviour is recorded
 * rather than discovered. Nothing short of a custom grouped row model would fix
 * it, and no real dataset has been seen to need that.
 *
 * Note the check is against `undefined`/`null`/`''` and **not** falsiness: `0` and
 * `false` are values a caller grouped by on purpose.
 */
function isUngroupedRow<TData>(row: Row<TData>): boolean {
  const columnId = row.groupingColumnId;
  if (columnId === undefined) {
    return false;
  }
  const raw = groupingValueOf(row, columnId);

  return raw === undefined || raw === null || raw === '';
}

/**
 * Applies the ungrouped policy to one level of group rows: drop the bucket when
 * `show` is false, otherwise move it to the front or the back.
 *
 * Deliberately after sorting — the model chain is grouped → sorted → expanded —
 * because `first`/`last` is a placement rule and has to win over the sort that
 * would otherwise scatter the bucket into key order.
 */
function applyUngroupedPolicy<TData>(
  rows: readonly Row<TData>[],
  ungrouped: ResolvedUngrouped
): readonly Row<TData>[] {
  const bucket = rows.find(isUngroupedRow);
  if (bucket === undefined) {
    return rows;
  }

  const rest = rows.filter((row) => row !== bucket);
  if (!ungrouped.show) {
    return rest;
  }

  return ungrouped.position === 'first' ? [bucket, ...rest] : [...rest, bucket];
}

/**
 * The expand stage, always run: a group row opens unless `groupCollapsed` holds
 * it, every other row per `row.getIsExpanded()`.
 *
 * The two questions are asked separately on purpose. Folding them into one
 * `getIsRowExpanded` option would push group state back through `state.expanded`,
 * the row-ID-keyed slice §6.5 keeps group IDs out of.
 */
/**
 * A paged group's visible children, and the arithmetic around them (PLTFRM-93295).
 *
 * **One implementation, two callers**, and that is the point: `flattenGroups` decides
 * which rows render, and `displayRows` decides where the pager goes. Computing the
 * window twice is how the pager ends up on the wrong row after a filter narrows a
 * group — the split-brain this file's neighbours warn about repeatedly.
 *
 * `undefined` when the group is not pageable: paging off, no children, or children
 * that are themselves groups (an outer level slicing inner groups would hide whole
 * groups and read as data loss).
 */
export function groupPageWindow<TData>(
  groupRow: Row<TData>,
  children: readonly Row<TData>[],
  paging: { pageSize: number; pageOf: (groupId: string) => number }
):
  | {
      readonly rows: readonly Row<TData>[];
      readonly page: number;
      readonly pageCount: number;
    }
  | undefined {
  if (
    paging.pageSize <= 0 ||
    children.length === 0 ||
    children[0]!.getIsGrouped()
  ) {
    return undefined;
  }

  const pageCount = Math.max(1, Math.ceil(children.length / paging.pageSize));
  // Clamped read, never a write: a filter that shrinks a group must not silently
  // rewrite the page the user chose, so undoing the filter restores it.
  const page = Math.min(
    Math.max(0, Math.floor(paging.pageOf(groupRow.id))),
    pageCount - 1
  );
  const start = page * paging.pageSize;

  return {
    rows: children.slice(start, start + paging.pageSize),
    page,
    pageCount,
  };
}

function flattenGroups<TData>(
  rowModel: RowModel<TData>,
  collapsed: ReadonlySet<string>,
  ungrouped: ResolvedUngrouped,
  /**
   * Per-group paging (PLTFRM-93295). `pageSize` of 0 disables it, which is the
   * default and leaves this function behaving exactly as it did.
   *
   * The slice happens **here**, in the same walk that honours collapse, because it
   * is the same kind of decision: which of a group's members are visible. TanStack's
   * own `getPaginationRowModel` cannot do it — that slices the flat list *after*
   * grouping, so its page 1 is "the first N rows wherever they fall" rather than
   * "the first N of each group".
   */
  paging: { pageSize: number; pageOf: (groupId: string) => number }
): RowModel<TData> {
  const rows: Row<TData>[] = [];

  const push = (row: Row<TData>) => {
    rows.push(row);
    const isGroup = row.getIsGrouped();
    const isOpen = isGroup ? !collapsed.has(row.id) : row.getIsExpanded();
    if (!isOpen || row.subRows.length === 0) {
      return;
    }
    // A group row's children are the next grouping level's group rows, so the
    // ungrouped policy applies there too. A tree parent's children are records,
    // which the policy has nothing to say about.
    const children = isGroup
      ? applyUngroupedPolicy(row.subRows, ungrouped)
      : row.subRows;

    const window = isGroup ? groupPageWindow(row, children, paging) : undefined;
    (window?.rows ?? children).forEach(push);
  };

  applyUngroupedPolicy(rowModel.rows, ungrouped).forEach(push);

  return { rows, flatRows: rowModel.flatRows, rowsById: rowModel.rowsById };
}

/**
 * A drop-in `getExpandedRowModel` that honours group collapse.
 *
 * Memoized on *content* keys rather than on `state.expanded`'s identity, which the
 * controller reallocates every render (`setToRecord(...)`) — so the stock model
 * rebuilds its flattened list on every render of every tree table. Keying on the
 * sorted ID strings makes the memo actually hold. Nothing else feeds the result:
 * `row.getIsExpanded()` reads only `state.expanded`, and no `getIsRowExpanded` is
 * contributed.
 */
function groupAwareExpandedRowModel<TData>(): (
  table: Table<TData>
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => {
        const { expanded } = table.getState();
        const { collapsed, ungrouped, groupPageSize, groupPages } =
          liveGrouping(table);

        return [
          table.getPreExpandedRowModel(),
          expanded === true ? 'all' : Object.keys(expanded).sort().join(' '),
          [...collapsed].sort().join(' '),
          // Per-group paging is part of the row list (PLTFRM-93295), so both the
          // window size and every group's page index belong in this key. Omitting
          // them memoises the *previous* page: the state changes, the flatten never
          // re-runs, and the pager appears to do nothing.
          String(groupPageSize),
          [...groupPages]
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([groupId, page]) => `${groupId}=${page}`)
            .join(' '),
          // `show` and `position` change the row list; `name` cannot, so it is
          // deliberately absent — including it would rebuild the list whenever a
          // caller renamed the bucket.
          `${ungrouped.show}|${ungrouped.position}`,
        ];
      },
      (rowModel) => {
        const { collapsed, ungrouped, groupPageSize, groupPages } =
          liveGrouping(table);

        return flattenGroups(rowModel, collapsed, ungrouped, {
          pageSize: groupPageSize,
          pageOf: (groupId) => groupPages.get(groupId) ?? 0,
        });
      },
      getMemoOptions(table.options, 'debugTable', 'groupAwareExpandedRowModel')
    );
}

/* -------------------------------------------------------------------------- */
/*                          Group rows and selection                          */
/* -------------------------------------------------------------------------- */

/** Every data row under a group row — tree descendants and their parents. */
function groupDataRows<TData>(groupRow: Row<TData>): Row<TData>[] {
  const collected: Row<TData>[] = [];
  const walk = (row: Row<TData>) => {
    if (!row.getIsGrouped()) {
      collected.push(row);
    }
    row.subRows.forEach(walk);
  };
  groupRow.subRows.forEach(walk);

  return collected;
}

function rowsInScope<TData>(
  all: readonly Row<TData>[],
  table: Table<TData>,
  scope: DataTableGroupSelectionScope
): readonly Row<TData>[] {
  if (scope === 'all-loaded-leaves') {
    return all;
  }
  // `'visible-leaves'` means what is on screen, so a collapsed group has nothing
  // in scope and its control is empty and disabled rather than inert. That
  // asymmetry is the member's whole point, which is why it is opt-in.
  const rendered = new Set(table.getRowModel().rows.map((row) => row.id));

  return all.filter((row) => rendered.has(row.id));
}

function selectionFor<TData>(
  groupRow: Row<TData>,
  table: Table<TData>,
  policy: ResolvedGrouping<TData>
): DataTableGroupSelection {
  const inScope = rowsInScope(
    groupDataRows(groupRow),
    table,
    policy.selectionScope
  );
  const eligible = inScope.filter((row) => row.getCanSelect());
  const selectedCount = eligible.filter((row) => row.getIsSelected()).length;
  // Three-way over ELIGIBLE rows, which is what the control is about to change and
  // is also what TanStack's page-scoped predicate compares. Ineligible rows are
  // excluded from the question, not counted as unselected.
  const state =
    eligible.length === 0 || selectedCount === 0
      ? 'none'
      : selectedCount === eligible.length
        ? 'all'
        : 'some';

  return {
    state,
    eligibleCount: eligible.length,
    toggle: (next) => {
      const target =
        next ??
        (state === 'some' ? policy.selectAllOnIndeterminate : state !== 'all');
      for (const row of eligible) {
        row.toggleSelected(target);
      }
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                                 The module                                 */
/* -------------------------------------------------------------------------- */

export const groupingFeature = defineDataTableFeature({
  id: 'grouping',

  engineOptions(ctx) {
    const { manualGrouping } = ctx.gates;
    const config = configOf(ctx.config);
    const allowed = config?.allowedColumns;
    // The client *grouping* stage is gated: a manual stage consumes
    // caller-processed rows and does not install its client model (design §3.5),
    // and with no config the feature is not configured at all. In both cases there
    // must be no group rows, which is what shipped before this unit.
    const groupsClientRows =
      ctx.state.grouping.length > 0 && !manualGrouping && config !== undefined;

    return {
      onGroupingChange: (updater) =>
        ctx.requestChange('grouping', (previous) => {
          const next = resolveUpdater(updater, [...previous]);
          // `allowedColumns` has exactly one enforcement point, and this is it.
          // The grouped row model filters by column *existence* only
          // (`grouping.filter(id => table.getColumn(id))`) and never consults
          // `column.getCanGroup()`, so `enableGrouping` cannot express the
          // restriction. A disallowed value arriving through controlled
          // `state.grouping` therefore still groups; the DataGrid layer warns
          // about that at resolve time instead of silently rewriting a caller's
          // controlled slice.
          return allowed === undefined
            ? next
            : next.filter((columnId) => allowed.includes(columnId));
        }),
      ...(manualGrouping ? { manualGrouping: true } : {}),
      // ── The expand stage, owned by ONE module for the table's lifetime ──────
      //
      // `table.getExpandedRowModel()` calls `table.options.getExpandedRowModel(table)`
      // **once**, caches the closure on `table._getExpandedRowModel`, and nothing
      // anywhere clears it. So a *handover between two modules* is unimplementable
      // however carefully the guards are written — which is how this was first
      // built, with guards keyed on `state.grouping.length` and exactly
      // complementary on both sides. Asking each module what it contributed agreed
      // the count was one in both states, and the feature was still broken: a
      // controller that starts ungrouped and is then grouped keeps tree's stock
      // model, so group headers appear with **no members** and the ungrouped bucket
      // never moves. The runtime-crossing test found it; the per-module test could
      // not, because the mechanism it asserted was genuinely satisfied.
      //
      // What the cache actually forbids is **two different owners**, not a stage
      // that starts absent: `_getExpandedRowModel` is only set once the option is
      // present, so absent → present is resolved normally. Every function this
      // factory returns is behaviourally identical — the collapse set and the
      // ungrouped policy are read from `table` at call time, not captured — so
      // re-contributing it each render is a no-op.
      //
      // That leaves the condition free to respect design §3.5 ("a disabled stage
      // is an identity transform; no client model is installed"), which
      // `data-table-controller.test.tsx` asserts for this very option. It covers
      // tree as well as grouping because `tree.ts` no longer contributes it, and
      // the model here serves both: it asks `row.getIsExpanded()` for every
      // non-group row, which is all the stock model ever did.
      ...(ctx.gates.treeEnabled ||
      config !== undefined ||
      ctx.state.grouping.length > 0
        ? { getExpandedRowModel: groupAwareExpandedRowModel() }
        : {}),
      ...(groupsClientRows
        ? {
            getGroupedRowModel: getGroupedRowModel(),
            // TanStack defaults this to `'reorder'`, which moves every grouped
            // column to the front of the leaf-column order the moment grouping
            // activates — silently overriding `columnsFeatures.columnOrder`. The
            // group row here is a spanning cell that shows the value itself, so
            // hoisting the column buys nothing and costs the caller their order.
            groupedColumnMode: false as const,
          }
        : {}),
    };
  },

  /**
   * The per-group pager row (PLTFRM-93295), emitted after the last member of a
   * paged group's window.
   *
   * Anchored to the last *member* rather than to the group row, because the pager
   * belongs below the rows it pages — and `displayRows` runs per record row, so this
   * is the only place that knows which row that is.
   *
   * The `footer` kind with `scope: 'group'` is not new surface: the display-row type
   * has carried it since U5, and `footer.tsx` deliberately passes group-scoped rows
   * on rather than swallowing them, saying the owning feature was unspecified. This
   * is that feature.
   */
  displayRows(ctx) {
    const config = configOf<unknown>(ctx.config);
    if (config === undefined) {
      return [];
    }

    const parent = ctx.row.getParentRow();
    if (parent === undefined || !parent.getIsGrouped()) {
      return [];
    }

    const policy = resolvePolicy(config);
    const pageSize = Math.max(0, Math.floor(config.pageSize ?? 0));
    const children = applyUngroupedPolicy(parent.subRows, policy.ungrouped);
    const window = groupPageWindow(parent, children, {
      pageSize,
      pageOf: (groupId) => ctx.state.groupPagination.get(groupId) ?? 0,
    });

    // One pager per group, so only the last row of the window carries it. A group
    // whose rows all fit on one page gets none — a pager that can never move is
    // furniture.
    if (
      window === undefined ||
      window.pageCount <= 1 ||
      window.rows[window.rows.length - 1]?.id !== ctx.row.id
    ) {
      return [];
    }

    return [
      { kind: 'footer' as const, scope: 'group' as const, groupId: parent.id },
    ];
  },

  classifyDisplayRow(ctx) {
    // A reclassification, not an insertion: the grouped row model puts group rows
    // *into* `getRowModel().rows`, so the row is already in the list.
    if (configOf(ctx.config) === undefined || !ctx.row.getIsGrouped()) {
      return undefined;
    }

    return {
      kind: 'group',
      row: ctx.row,
      groupId: ctx.row.id,
      depth: ctx.row.depth,
      recordIndex: ctx.recordIndex,
    };
  },

  renderDisplayRow(displayRow, ctx) {
    // The per-group pager (PLTFRM-93295). Claimed here because `footer.tsx` emits
    // only table-scoped rows and passes these on by design.
    if (displayRow.kind === 'footer' && displayRow.scope === 'group') {
      const config = configOf<unknown>(ctx.config);
      const groupId = displayRow.groupId;
      if (config === undefined || groupId === undefined) {
        return undefined;
      }

      const pageSize = Math.max(0, Math.floor(config.pageSize ?? 0));
      const groupRow = ctx
        .table()
        .getRowModel()
        .rows.find((row: Row<unknown>) => row.id === groupId);
      if (groupRow === undefined || pageSize <= 0) {
        return undefined;
      }

      const children = applyUngroupedPolicy(
        groupRow.subRows,
        resolvePolicy(config).ungrouped
      );
      const window = groupPageWindow(groupRow, children, {
        pageSize,
        pageOf: (id) => ctx.state.groupPagination.get(id) ?? 0,
      });
      if (window === undefined) {
        return undefined;
      }

      const goTo = (page: number) => {
        ctx.requestChange(
          'groupPagination',
          (previous) => {
            const next = new Map(previous);
            // Page 0 stored as absence, matching the controller's own arm — so a
            // user paging back to the start leaves no residue in a persisted slice.
            if (page === 0) {
              next.delete(groupId);
            } else {
              next.set(groupId, page);
            }

            return next;
          },
          // A click, so `pointer` — the cause vocabulary is
          // pointer/keyboard/api/data-reconcile/restore/reset, and observers filter
          // on it.
          'pointer'
        );
      };

      return (
        <TableRow key={`group-pager:${groupId}`}>
          <TableCell colSpan={ctx.visibleColumnCount}>
            {/* Buttons rather than links, and disabled at the ends rather than
                hidden: a control that disappears moves the two beside it, and the
                pager sits between rows where that reads as the table jumping. */}
            <span className="flex items-center gap-2 text-sm">
              <button
                type="button"
                disabled={window.page === 0}
                onClick={() => goTo(window.page - 1)}
                aria-label={`Previous page of group ${groupRow.groupingValue ?? groupId}`}
              >
                ‹
              </button>
              <span>
                Page {window.page + 1} of {window.pageCount}
              </span>
              <button
                type="button"
                disabled={window.page >= window.pageCount - 1}
                onClick={() => goTo(window.page + 1)}
                aria-label={`Next page of group ${groupRow.groupingValue ?? groupId}`}
              >
                ›
              </button>
            </span>
          </TableCell>
        </TableRow>
      );
    }

    if (displayRow.kind !== 'group') {
      // Not mine — the dispatcher moves on to the next module.
      return undefined;
    }

    const config = configOf<unknown>(ctx.config);
    if (config === undefined) {
      // `undefined`, not `null`: with the feature off this module emits no group
      // row, so one arriving here came from somewhere else and must be passed on
      // rather than silently swallowed.
      return undefined;
    }

    const policy = resolvePolicy(config);
    const groupRow = displayRow.row;
    const columnId = groupRow.groupingColumnId ?? '';
    const isUngrouped = isUngroupedRow(groupRow);
    const rows = groupDataRows(groupRow);
    const collapsed = ctx.state.groupCollapsed.has(displayRow.groupId);
    const context: DataTableGroupContext<unknown> = {
      groupId: displayRow.groupId,
      columnId,
      value: isUngrouped ? undefined : groupingValueOf(groupRow, columnId),
      name: isUngrouped
        ? policy.ungrouped.name
        : String(groupRow.groupingValue),
      isUngrouped,
      depth: displayRow.depth,
      collapsed,
      collapsible: policy.collapsible,
      toggle: () => {
        if (!policy.collapsible) {
          return;
        }
        ctx.requestChange(
          'groupCollapsed',
          (previous) => {
            const next = new Set(previous);
            if (next.has(displayRow.groupId)) {
              next.delete(displayRow.groupId);
            } else {
              next.add(displayRow.groupId);
            }

            return next;
          },
          'pointer'
        );
      },
      rows: rows.map((row) => row.original),
      rowCount: rows.length,
      colSpan: ctx.visibleColumnCount,
      selection: selectionFor(
        groupRow,
        // Safe here and only here: `renderDisplayRow` runs during the view's
        // render, long after the engine exists. The same call in the body of
        // `engineOptions` throws a named error.
        ctx.table(),
        policy
      ),
    };

    return (
      // One ref-forwarding element, because the body-window seam measures a
      // feature-rendered row by cloning it — anything else renders unmeasured.
      //
      // `sticky` is set here rather than through `rowPresentation`, which the view
      // composes for `kind: 'data'` rows only. No `stickyOffset`: the group row
      // pins at the top of the scroll container and F3's z-ladder (sticky header
      // 40 > sticky row 20) paints a sticky header over it, so with
      // `appearance.stickyHeader` the group row slides *under* the header instead
      // of stacking below it. Clearing the header needs its measured height, which
      // no contribution point carries, and design §5.2 gives `sticky` no offset
      // member — so this is recorded rather than invented.
      <TableRow
        data-slot="group-row"
        data-group-id={displayRow.groupId}
        expanded={policy.collapsible ? !collapsed : undefined}
        sticky={policy.sticky || undefined}
      >
        <TableCell colSpan={ctx.visibleColumnCount}>
          {policy.renderGroup === undefined
            ? // Values, never formatting (§4.3). DataGrid replaces this.
              `${context.name} (${context.rowCount})`
            : policy.renderGroup(context)}
        </TableCell>
      </TableRow>
    );
  },
});
