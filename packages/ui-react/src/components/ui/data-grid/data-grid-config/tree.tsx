import type { ReactNode } from 'react';
import { flexRender, type CellContext } from '@tanstack/react-table';

import type { DataTableTreeStatusContext } from '../../data-table/data-table-features/tree';
import { DataGridTreeCell, DataGridTreeStatusRow } from '../data-grid-tree';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **U2**. The `tree` behavior group (design §5.2).
//
// `tree` owns TanStack's single expand/collapse feature (ADR-0001), so unlike
// `detailExpansion` this group does drive the row model — through the DataTable
// `tree` config, never from here. The engine half is
// `../../data-table/data-table-features/tree.ts`.
//
// **A tree descendant DOES consume a pagination slot** (ADR-0001 OQ-2), decided
// deliberately opposite to the detail answer: a descendant is a real record
// entering the row model, where a detail row is a presentation of a record already
// on the page. With `pageSize: 2` and an expanded parent holding two children the
// row model is `[parent, firstChild]` and the sibling root is displaced.
// Established by experiment and asserted in the engine half's suite.
//
// ── The disclosure is IN-CELL, not a system column ───────────────────────────
//
// Indentation and disclosure have to move together, and a fixed leading column
// cannot indent. `anatomy.yaml`'s "detail/tree/actions are other system columns"
// line is an **enumeration, not an order** — it also lists `actions`, whose
// placement is a runtime config — and it describes `tree-expander` only as a
// `button` part, claiming no column of its own. So this group contributes a
// `columns` **transform** over the tree column rather than prepending one.
//
// ── Lazy children ────────────────────────────────────────────────────────────
//
// `loadChildren` and `renderLoadError` shipped one commit after the eager half,
// and the gap was not sequencing: `getCoreRowModel` memoizes on `data` identity
// alone, so fetched children could not become rows at all until a delivery route
// for that identity existed. Declaring either member before then would have put a
// config surface on `DataGridProps` reaching a machine that reached nothing.
//
// The route is `ctx.graftData(generation)` on the DataTable feature context — one
// shallow copy per arrival. See the engine half's header; nothing about it is
// visible from this layer beyond passing `loadChildren` down.

/** Design §5.2's default indentation per depth level, in px. */
export const DATA_GRID_TREE_DEFAULT_INDENT = 20;

/** What `renderLoadError` is told about the branch that failed. */
export interface DataGridTreeLoadErrorContext<TData> {
  readonly row: TData;
  readonly error: unknown;
  /** Re-issues the child request for this row. */
  readonly retry: () => void;
}

export interface DataGridTreeConfig<TData> {
  /** Statically-known children for a record. Required (design §5.2). */
  getChildren: (row: TData) => readonly TData[] | undefined;
  /**
   * Fetches children for a record that has none yet. Expanding a childless row is
   * what triggers it; each request is keyed and a superseded result is dropped, so
   * a slow first response cannot overwrite a newer one.
   */
  loadChildren?: (row: TData, requestKey: string) => Promise<readonly TData[]>;
  /**
   * Renders the failure state for a branch whose children could not load,
   * replacing the default Alert. The retry command is supplied — a failed branch
   * that cannot be retried is not a supported shape.
   */
  renderLoadError?: (context: DataGridTreeLoadErrorContext<TData>) => ReactNode;
  /** Indentation per depth level, in px. Defaults to 20. */
  indent?: number;
  /**
   * Which column carries the disclosure and the indentation. Defaults to the
   * **first declared** data column.
   *
   * "Declared", not "leftmost rendered": this resolves before
   * `columnsFeatures`' `columnOrder` and visibility are applied, so a reorder can
   * move the disclosure away from the left edge and **hiding the tree column
   * removes the disclosure entirely — the tree becomes unexpandable, not merely
   * un-indented.** Name the column explicitly when the two differ.
   *
   * A name that matches no column applies the transform to nothing, for the same
   * reason and with the same symptom. That is deliberate: silently falling back
   * to the first column would hide a typo behind a working-looking tree.
   */
  column?: string;
  /**
   * Retain expanded ids that are absent after a data replacement instead of
   * pruning them.
   */
  reserve?: boolean;
}

export interface ResolvedDataGridTree<TData> {
  readonly enabled: boolean;
  readonly getChildren?: (row: TData) => readonly TData[] | undefined;
  readonly loadChildren?: (
    row: TData,
    requestKey: string
  ) => Promise<readonly TData[]>;
  readonly renderLoadError?: (
    context: DataGridTreeLoadErrorContext<TData>
  ) => ReactNode;
  readonly indent: number;
  readonly column?: string;
  readonly reserve: boolean;
}

/* eslint-disable unused-imports/no-unused-vars -- declaration merging requires
   every augmentation to repeat the target's type-parameter list verbatim. */
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Tree rows: descendant records revealed by an in-cell disclosure.
     * `false`/omitted disables it. Independent of `detailExpansion` — separate
     * slice, separate callback, separate display-row kind (ADR-0001) — so both
     * may be enabled at once.
     */
    tree: false | DataGridTreeConfig<TData>;
  }
  interface DataGridIdentityFreeMap<TData> {
    // Expanded ids must survive a data change, which only a real row id can do
    // (design §3.1).
    tree: false;
  }
  interface DataGridResolvedConfigMap<TData> {
    tree: ResolvedDataGridTree<TData>;
  }
}
/* eslint-enable unused-imports/no-unused-vars */

export const treeConfig = defineDataGridConfig({
  key: 'tree',
  kind: 'grouped',
  aliases: [],

  resolve({ props }) {
    const warnings: string[] = [];
    const config =
      props.tree !== undefined && props.tree !== false ? props.tree : undefined;

    if (config !== undefined && config.getChildren === undefined) {
      warnings.push(
        'DataGrid: `tree.getChildren` is required; a tree group with no child accessor reveals nothing.'
      );
    }

    return {
      value: {
        enabled: config !== undefined,
        getChildren: config?.getChildren,
        loadChildren: config?.loadChildren,
        renderLoadError: config?.renderLoadError,
        indent: config?.indent ?? DATA_GRID_TREE_DEFAULT_INDENT,
        column: config?.column,
        reserve: config?.reserve ?? false,
      },
      warnings,
    };
  },

  columns(columns, { resolved, resolveColumnId }) {
    const { enabled, column, loadChildren } = resolved.tree;
    if (!enabled) {
      return columns;
    }

    // The default is the first DECLARED data column. This module resolves after
    // `filters` (so the wrapper wraps the final renderer) and before `actions`
    // and `selection` (which splice and prepend system columns), so index 0 is
    // still a caller column here. Moving this entry after either of those would
    // make `columns[0]` a checkbox.
    const targetIndex =
      column === undefined
        ? 0
        : columns.findIndex((def) => resolveColumnId(def) === column);
    if (targetIndex < 0 || columns[targetIndex] === undefined) {
      return columns;
    }

    const target = columns[targetIndex];
    const originalCell = target.cell;

    return columns.map((def, index) =>
      index === targetIndex
        ? {
            ...def,
            cell: (context: CellContext<unknown, unknown>) => (
              <DataGridTreeCell
                row={context.row}
                lazy={loadChildren !== undefined}
                labels={resolved.labels}
              >
                {
                  // `flexRender` rather than calling the template directly: a
                  // `cell` may be a component type, and invoking one as a plain
                  // function breaks its hooks. `renderValue()` is TanStack's own
                  // default, so a column with no `cell` keeps its fallback value.
                  (originalCell === undefined
                    ? context.renderValue()
                    : flexRender(originalCell, context)) as ReactNode
                }
              </DataGridTreeCell>
            ),
          }
        : def
    );
  },

  controllerOptions({ resolved, callbacks }) {
    const {
      enabled,
      getChildren,
      loadChildren,
      renderLoadError,
      indent,
      reserve,
    } = resolved.tree;
    if (!enabled) {
      return {};
    }

    // `indent` goes down to the engine rather than being applied here: the
    // DataTable half emits it as `--table-tree-indent` on the row, and the cell
    // reads that property. One source of truth for the design §5.2 default.
    //
    // `renderStatus` is supplied **only when a loader is configured** — and this is
    // DEFENSIVE, not behavioural: a negative control confirmed that supplying it
    // unconditionally passes all 15 assertions. It cannot be otherwise, because
    // without a loader every row's status is `idle` and the engine's `displayRows`
    // returns nothing regardless. So no test guards this line and none can; it is
    // here so a non-lazy grid does not carry a status-row shape it can never use.
    // Recorded rather than covered, because a test that cannot fail is worse than
    // an acknowledged gap.
    return {
      tree: {
        ...(getChildren ? { getChildren } : {}),
        ...(loadChildren
          ? {
              loadChildren,
              renderStatus: (context: DataTableTreeStatusContext<unknown>) => (
                <DataGridTreeStatusRow
                  context={context}
                  labels={resolved.labels}
                  {...(renderLoadError ? { renderLoadError } : {})}
                />
              ),
            }
          : {}),
        // `onTreeLoad` maps here and gets no `resolveSliceCallbacks` projection:
        // the machine lives outside both expansion slices by contract, so there is
        // no `treeLoad` slice for a projection to target.
        ...(callbacks?.onTreeLoad ? { onLoad: callbacks.onTreeLoad } : {}),
        indent,
        reserve,
      },
    };
  },
});
