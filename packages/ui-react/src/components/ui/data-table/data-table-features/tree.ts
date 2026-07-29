import { useEffect, type CSSProperties, type ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';

import {
  encodeRowIdForDom,
  type DataTableDisplayRow,
} from '../data-table-display-rows';
import {
  useDataTableTreeMachine,
  type DataTableTreeLoadEvent,
  type DataTableTreeMachine,
} from '../data-table-tree';
import { defineDataTableFeature } from './registry';
import { recordToSet, resolveUpdater, setToRecord } from './translate';

// OWNERSHIP: created by F2 with the shipped expand wiring; **U2 owns this file**.
//
// `tree` owns TanStack's single expand/collapse feature (ADR-0001), because
// `getExpandedRowModel()` walks `row.subRows` only. Detail expansion is a
// render-layer projection over `detailExpanded` with no row-model involvement.
//
// Two F1 behaviors to preserve rather than "fix":
//
//  - **The `expanded` binding is conditional.** `gates.expandedSlice` is
//    `treeExpanded` except on the frozen legacy path, where it stays a boolean
//    carrier over `detailExpanded`. Binding it unconditionally turns
//    `data-table.test.tsx` red.
//  - **`getSubRows` alone means tree**, with or without a `tree` config.
//
// **Pagination (ADR-0001 OQ-2): tree descendants DO consume pagination slots.**
// That is TanStack's `paginateExpandedRows` default of `true`, so this module
// leaves the option unset — writing the default explicitly would move
// `table.options.paginateExpandedRows` from `undefined` to `true` for no
// behavioral gain. Established by experiment rather than assumed, and asserted.
//
// **Sibling-scoped sort needs no implementation here.** `getSortedRowModel()`
// already sorts within each level, so `behavior.md`'s "Nested rows sort within
// their tree level" is covered by a test rather than by code.
//
// ── Lazy children: why `data` is contributed, and why the store is keyed by id ─
//
// `getCoreRowModel` is `memo(() => [table.options.data], …)` — memoized on **`data`
// identity alone**. Fetched children returned from `getSubRows` are therefore
// invisible until `data` is a different array: the machine can hold them, a render
// can happen, and no child appears. Measured both ways. So this module contributes
// `data: ctx.graftData(machine.generation)` — one shallow copy per arrival, never
// per render, which `graftedData` enforces rather than asking anyone to remember.
//
// That forces the machine store to be keyed by **`ctx.tableId`, not the `Table`.**
// `data` has to be a *value* when `engineOptions` runs, and `ctx.table()` throws
// `ReferenceError: Cannot access 'table' before initialization` from a contribution
// point's body on **every** render, not only the first — verified with a probe:
// 10 invocations, 10 throws, 0 resolved. `tableId` is a plain string on the base
// context, available before `useReactTable` runs. The cost of a string key is that
// a `Map` does not self-release, so `effects` deletes the entry on unmount.

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

interface IdentityFeatureConfig {
  readonly reserve?: boolean;
}

/** What the `tree-status` renderer is told about the branch it belongs to. */
export interface DataTableTreeStatusContext<TData> {
  readonly row: Row<TData>;
  readonly status: 'loading' | 'error';
  readonly error?: unknown;
  /** Re-issues the child request for this row. */
  readonly retry: () => void;
  readonly colSpan: number;
  /** `${tableId}--tree--${base64url(rowId)}` (design §7). */
  readonly domId: string;
}

/**
 * Tree behavior: descendant relationships and their visibility.
 *
 * Every member is optional by design — the owning unit tightens optionality
 * inside this file. Design §5.2 makes `getChildren` required at the *DataGrid*
 * layer; at this layer the shipped `getSubRows` route already supplies
 * relationships, so requiring it here would reject `tree: {}`, which
 * `data-table-controller-types.test.ts` accepts today.
 */
export interface DataTableTreeConfig<TData> extends IdentityFeatureConfig {
  readonly getChildren?: (row: TData) => readonly TData[] | undefined;
  /**
   * Fetches children for a record that has none yet. Expanding a childless row is
   * what triggers it; each request is keyed and a superseded result is dropped, so
   * a slow first response cannot overwrite a newer one.
   */
  readonly loadChildren?: (
    row: TData,
    requestKey: string
  ) => Promise<readonly TData[]>;
  /**
   * Indentation per depth level, in px. Defaults to 20 (design §5.2).
   *
   * Reaches the row as `--table-tree-indent`; see the two properties below.
   */
  readonly indent?: number;
  /**
   * Renders the loading/failed branch row. The standard Spinner/Alert/retry
   * controls belong to DataGrid (`behavior.md`: "standard Spinner/Alert/retry UI
   * belongs to DataGrid"), so this layer renders no chrome — the caller, normally
   * `data-grid-config/tree.tsx`, fills the row.
   *
   * With no renderer, **no status row is emitted at all**, mirroring the shipped
   * detail projection, which renders a detail row only when the caller supplied
   * `renderExpandedRow`. An emitted row that rendered nothing would be a blank
   * row, and would give virtualization a display row to measure with no element
   * behind it.
   */
  readonly renderStatus?: (
    context: DataTableTreeStatusContext<TData>
  ) => ReactNode;
  /** Observes each lazy-children transition. DataGrid maps `onTreeLoad` here. */
  readonly onLoad?: (event: DataTableTreeLoadEvent<TData>) => void;
}

/** Design §5.2's default indentation, in px. */
export const DATA_TABLE_TREE_DEFAULT_INDENT = 20;

/**
 * The row-level custom properties carrying nesting depth and the configured
 * indent step, emitted together by `rowPresentation`.
 *
 * Two properties rather than one because `tree.indent` has no contribution point
 * of its own and needs none: depth alone cannot produce a length without the
 * consumer hard-coding the step, which would fork the design §5.2 default into
 * every call site. Emitted together so one selector can do the arithmetic:
 *
 *   padding-inline-start: calc(
 *     var(--table-tree-depth) * var(--table-tree-indent)
 *   );
 *
 * That is the direct-DataTable route (a column class from `columnPresentation`);
 * DataGrid's own in-cell transform reads the same two properties, so the step
 * lives in exactly one place.
 */
export const DATA_TABLE_TREE_DEPTH_PROPERTY = '--table-tree-depth';
/** @see DATA_TABLE_TREE_DEPTH_PROPERTY */
export const DATA_TABLE_TREE_INDENT_PROPERTY = '--table-tree-indent';

/* -------------------------------------------------------------------------- */
/*                         The per-controller machine                         */
/* -------------------------------------------------------------------------- */

// A feature module is a singleton shared by every table, so it cannot hold the
// machine itself. `effects` publishes one per controller and the other points read
// it back.
//
// **Keyed by `tableId`, deliberately, and not by the `Table`.** A `WeakMap` on the
// table would self-release and would be the obvious choice — but `engineOptions`
// must read this from its own body to build `data`, and `ctx.table()` is in the
// temporal dead zone there on every render. `tableId` is the only key available
// that early. A string `Map` does not self-release, so `effects` deletes on
// unmount; that cleanup is the price of the earlier key, not an oversight.
const machines = new Map<string, DataTableTreeMachine<unknown>>();

const INERT: DataTableTreeMachine<unknown> = {
  enabled: false,
  generation: 0,
  statusOf: () => ({ status: 'idle' }),
  childrenOf: () => undefined,
  load: () => {},
  retry: () => {},
};

/**
 * The machine for this table, or an inert stand-in before `effects` has first run.
 *
 * Reading this from a contribution point's **body** is legitimate — that is what
 * the `tableId` key buys — but only because the inert stand-in is correct at the
 * one moment it is returned. On the first render nothing has been fetched, so
 * `generation` is 0 and `graftedData` hands back the caller's array untouched.
 */
function machineFor<TData>(tableId: string): DataTableTreeMachine<TData> {
  return (machines.get(tableId) ??
    INERT) as unknown as DataTableTreeMachine<TData>;
}

function configOf<TData>(config: unknown): DataTableTreeConfig<TData> {
  return typeof config === 'object' && config !== null
    ? (config as DataTableTreeConfig<TData>)
    : {};
}

/* -------------------------------------------------------------------------- */
/*                                 The module                                 */
/* -------------------------------------------------------------------------- */

export const treeFeature = defineDataTableFeature({
  id: 'tree',

  effects(ctx) {
    const config = configOf(ctx.config);
    // Hook order is stable because the manifest is a static ordered list, which
    // is the property that makes `effects` safe at all.
    const machine = useDataTableTreeMachine({
      ...(config.loadChildren === undefined
        ? {}
        : { loadChildren: config.loadChildren }),
      ...(config.onLoad === undefined ? {} : { onLoad: config.onLoad }),
    });
    const { tableId } = ctx;
    const table = ctx.table();

    machines.set(tableId, machine as DataTableTreeMachine<unknown>);

    // The `Map` is keyed by a string, so nothing releases it when the controller
    // goes away. Deleting on unmount is what a `WeakMap` on the table would have
    // done for free, and is the trade the earlier key required.
    useEffect(() => () => void machines.delete(tableId), [tableId]);

    // **Expanding a childless row is what triggers a fetch**, and this is the
    // only place that wire can live: `displayRows` and `renderContext` run
    // during render, so starting a request from either would be a side effect in
    // a render path. Without this the whole `loadChildren` surface is reachable
    // and inert — which is the "point that reaches nothing" shape rule 7 exists
    // to catch, and it is how this was found.
    const expandedKey = [...ctx.state.treeExpanded].sort().join(' ');
    useEffect(() => {
      if (!machine.enabled) {
        return;
      }

      const byId = table.getCoreRowModel().rowsById;
      for (const rowId of expandedKey === '' ? [] : expandedKey.split(' ')) {
        const row = byId[rowId];
        // Already has children, so there is nothing to fetch. `load` itself
        // ignores a row that is loading, loaded, or in error.
        if (row === undefined || row.subRows.length > 0) {
          continue;
        }
        machine.load(rowId, row.original);
      }
    }, [expandedKey, machine, table]);
  },

  engineOptions(ctx) {
    // `treeEnabled` is deliberately not read here any more: the only thing it
    // gated was `getExpandedRowModel`, which `grouping.tsx` now owns outright —
    // see the note at the end of this literal.
    const { hasSubRows, getSubRows, expandedSlice } = ctx.gates;
    const config = configOf(ctx.config);
    const lazy = config.loadChildren !== undefined;

    return {
      // TanStack auto-resets `expanded` whenever the row model is invalidated —
      // `autoResetAll ?? autoResetExpanded ?? !manualExpanding`, and this kit sets
      // none of the three, so the default is ON. **It must be off here.**
      //
      // The reason stands without reference to any bug: this controller does not
      // own `expanded`, it DERIVES it from `treeExpanded`/`detailExpanded`. An
      // automatic reset overwrites a projection with the engine's idea of the
      // default, which is a slice the engine has no claim on (§6.5).
      //
      // It also froze the browser. `resetExpanded()` calls `onExpandedChange`
      // below, which wrote the slice unconditionally; `requestChange` allocated a
      // fresh state object every time, so React never bailed out; the re-render
      // invalidated the row model and the auto-reset fired again. Measured at
      // 11,293 state writes in 8s on `Components/DataGrid/Grouping`, with a stable
      // DOM and a flat heap — a render loop, not a leak. It needed no tree and no
      // expanded row: the slice was an empty set on both sides, so the write was
      // value-equal and identity-new.
      //
      // `requestChange`'s equality guard now stops the second half independently.
      // Both were verified to break the loop ALONE, because "we changed two things
      // and it stopped" would not say which.
      autoResetExpanded: false,
      // `ctx.table()` is called INSIDE the callback, never in this literal. The
      // engine instance does not exist yet when `engineOptions` runs — that is
      // exactly why the context hands over a thunk, and calling it here throws
      // `ReferenceError: Cannot access 'table' before initialization` on *every*
      // render, not only the first (verified). Two things must stay unhoisted:
      // this call, and `expandedSlice`, which the controller computes before
      // `useReactTable` runs.
      onExpandedChange: (updater) =>
        ctx.requestChange(expandedSlice, (previous) =>
          recordToSet(
            resolveUpdater(updater, setToRecord(previous)),
            ctx
              .table()
              .getCoreRowModel()
              .flatRows.map((row) => row.id)
          )
        ),
      // Relationship precedence: the config route wins, then the caller's raw
      // `getSubRows` (the deprecated route F2 forwarded), then whatever the lazy
      // loader has fetched for this record.
      ...(config.getChildren !== undefined || hasSubRows || lazy
        ? {
            getSubRows: (originalRow: unknown, index: number) => {
              const record = originalRow as never;
              const fromConfig = config.getChildren?.(record);
              if (fromConfig !== undefined) {
                return [...fromConfig] as never[];
              }
              const fromCaller = getSubRows?.(record, index);
              if (fromCaller !== undefined) {
                return fromCaller as never[];
              }

              return machineFor(ctx.tableId).childrenOf(record) as never[];
            },
          }
        : {}),
      // The delivery half of lazy children, and the reason the store is keyed by
      // `tableId`. `getSubRows` above already returns fetched children; what was
      // missing was a `data` identity for `getCoreRowModel`'s memo to notice.
      // `graftData` copies once per arrival — generation 0 returns the caller's
      // array unchanged, so a grid with no loader contributes nothing here.
      ...(lazy
        ? {
            // The cast is a seam mismatch, not a lie about the value: `graftData`
            // returns `readonly TData[]` while `TableOptions.data` is mutable
            // `TData[]`. The array is genuinely fresh (`[...data]`) for every
            // generation above 0, and at generation 0 it is the controller's own
            // `data`, which is already mutable. Reported to the seam's owner —
            // nothing but a direct-call test had exercised the return type before,
            // so it had never been checked against its real consumer.
            data: ctx.graftData(
              machineFor(ctx.tableId).generation
            ) as unknown[],
          }
        : {}),
      // ── `getExpandedRowModel` moved to `grouping.tsx` (U4, authorised edit) ──
      //
      // It used to be contributed here, gated on `treeEnabled || lazy`. It is not
      // contributed here at all any more, and the reason is not preference:
      //
      //  - The grouped row model nests each group's members in `subRows`, so they
      //    reach the rendered list only at the expand stage — one stage, needed by
      //    two features, and `composeEngineOptions` throws if both claim it.
      //  - The stock model cannot serve grouping. It returns early while
      //    `state.expanded` is `{}` and so never consults any per-row predicate,
      //    which is exactly the state a grouped-but-untreed table is in.
      //  - A *dynamic* handover between the two modules is impossible, not merely
      //    awkward: `table.getExpandedRowModel()` resolves the option **once** and
      //    caches it on `table._getExpandedRowModel`, which nothing clears. A
      //    table that starts ungrouped keeps whichever model it got first.
      //
      // So `grouping.tsx` owns the stage unconditionally, and its model is a strict
      // superset of this one — it asks `row.getIsExpanded()` for every non-group
      // row, which is all the stock model did. Nothing about tree expansion
      // changes; `data-table-grouping.test.tsx` asserts it across a grouping change
      // in both directions, and this file's own suite still asserts the option is
      // present for a tree.
      //
      // `lazy` is still read above, for `getSubRows` and the `data` graft.
    };
  },

  renderContext(ctx) {
    return {
      // A per-subject resolver, not a per-table constant: `loadState` is keyed by
      // row ID. The machine is read inside the resolver, which runs during the
      // view's render — after `effects`.
      row: (row) => ({
        tree: { loadState: machineFor(ctx.tableId).statusOf(row.id).status },
      }),
    };
  },

  displayRows(ctx) {
    const config = configOf(ctx.config);
    if (config.renderStatus === undefined) {
      return [];
    }

    const record = machineFor(ctx.tableId).statusOf(ctx.row.id);
    if (record.status !== 'loading' && record.status !== 'error') {
      return [];
    }

    const displayRow: DataTableDisplayRow<unknown> = {
      kind: 'tree-status',
      parent: ctx.row,
      recordIndex: ctx.recordIndex,
      status: record.status,
      domId: `${ctx.tableId}--tree--${encodeRowIdForDom(ctx.row.id)}`,
    };

    return [displayRow];
  },

  renderDisplayRow(displayRow, ctx) {
    if (displayRow.kind !== 'tree-status') {
      // Not mine — the dispatcher moves on to the next module.
      return undefined;
    }

    const config = configOf(ctx.config);
    if (config.renderStatus === undefined) {
      // Own the kind and deliberately render nothing. `displayRows` emits none
      // without a renderer, so this is only reachable if something else does.
      return null;
    }

    const machine = machineFor(ctx.tableId);
    const record = machine.statusOf(displayRow.parent.id);

    return config.renderStatus({
      row: displayRow.parent,
      status: displayRow.status,
      ...(record.error === undefined ? {} : { error: record.error }),
      retry: () =>
        machine.retry(displayRow.parent.id, displayRow.parent.original),
      colSpan: ctx.visibleColumnCount,
      domId: displayRow.domId,
    });
  },

  rowPresentation(ctx) {
    if (!ctx.gates.treeEnabled) {
      return undefined;
    }

    // The indentation hook. Custom properties are not in `CSSProperties`, hence
    // the cast — the same shape F3's `TableRow` sticky offset uses.
    const { indent } = configOf(ctx.config);

    return {
      style: {
        [DATA_TABLE_TREE_DEPTH_PROPERTY]: String(ctx.row.depth),
        [DATA_TABLE_TREE_INDENT_PROPERTY]: `${
          indent ?? DATA_TABLE_TREE_DEFAULT_INDENT
        }px`,
      } as CSSProperties,
    };
  },
});
