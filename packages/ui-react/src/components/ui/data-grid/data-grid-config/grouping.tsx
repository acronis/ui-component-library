import type { ReactNode } from 'react';

import type {
  DataTableGroupContext,
  DataTableGroupSelectionScope,
  DataTableUngroupedPolicy,
} from '../../data-table/data-table-features/grouping';
import { DataGridGroupHeader } from '../data-grid-grouping';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **U4**. The `grouping` behavior group (design §5.2).
//
// The engine half is `../../data-table/data-table-features/grouping.tsx`, and it
// carries the whole mechanism — the grouped row model, the group-aware expand
// stage that makes group members reachable at all, the collapse slice, and the
// group-scoped selection maths. This file normalizes the caller's config and
// supplies the presentation, per design §4.3.
//
// ── How grouping is turned ON, which is not through this config ─────────────
//
// `allowedColumns` says which columns a caller *may* group by; the columns
// actually grouped live in the `grouping` **state slice**, so a grid groups by
// `defaultState={{ grouping: ['status'] }}` (or a controlled `state.grouping`).
// That split is deliberate and matches `sorting`: the config carries behavior and
// the slice carries the current value, so there is one source of truth (§5.2).
//
// **There is no built-in group-by control in P1.** Design §5.2 gives grouping no
// toolbar member and the plan's U4 scope lists none, so the affordance belongs to
// a future column-menu entry (U3's surface) rather than being invented here.
// `allowedColumns` is what such a control will read.
//
// ── Members that reach nothing, and how the warnings are keyed ──────────────
//
// Every inert-member warning below keys off `props.grouping?.<member> !==
// undefined` — the caller's own input — never off the resolved value. The
// resolved `ungrouped` default is `{ show: true, name: 'Ungrouped', position:
// 'last' }`, all truthy, so a resolved-value check cannot tell "the caller asked
// for this" from "the default applied" and would accuse every grid of setting
// something it never touched.

/** Design §5.2's ungrouped default name, re-exported for callers building labels. */
export const DATA_GRID_UNGROUPED_DEFAULT_NAME = 'Ungrouped';

/** What a caller's `renderGroup` is told about the group row it is rendering. */
export type DataGridGroupContext<TData> = DataTableGroupContext<TData>;

export interface DataGridGroupingConfig<TData> {
  /**
   * Page each group's members independently, this many rows at a time
   * (PLTFRM-93295). Omitted means no per-group paging.
   *
   * Independent of `pagination`, which pages the grid as a whole. The two compose in
   * one direction: grid pagination slices the flat row list first, so a group's own
   * pager then pages whatever survived. Configuring both is legal and almost
   * certainly not what anyone wants, so it warns.
   */
  pageSize?: number;
  /**
   * Which columns may be grouped. **Required** (design §5.2): a grouping config
   * that permits nothing describes no feature.
   *
   * It is the *permitted* set, not the active one — the active columns are the
   * `grouping` state slice. Enforced when the slice is written through the
   * engine; a value pushed straight into a controlled `state.grouping` is the
   * caller's own assertion and is left alone rather than silently rewritten.
   */
  allowedColumns: readonly string[];
  /** Renders the group row's content, replacing the standard group header. */
  renderGroup?: (context: DataGridGroupContext<TData>) => ReactNode;
  /** Group rows collapse. Default true (design §5.2). */
  collapsible?: boolean;
  /**
   * Pin group rows to the top of the scroll container while their members scroll
   * past. Default false. Needs `appearance.height` or `appearance.maxHeight` —
   * without a bounded container nothing scrolls and nothing can stick.
   */
  sticky?: boolean;
  /**
   * Which of a group's rows its select-all targets: every loaded descendant data
   * row (`'all-loaded-leaves'`, the default) or only the ones currently rendered
   * (`'visible-leaves'`).
   *
   * The default is design §5.2's "leaf-descendants" read literally — the
   * descendants, not the ones on screen. It is also the only default that keeps
   * the control live: under `'visible-leaves'` a collapsed group has nothing in
   * scope, so its checkbox is empty and disabled.
   */
  selectionScope?: DataTableGroupSelectionScope;
  /**
   * The bucket of records with no grouping value. Defaults to visible, named
   * "Ungrouped", placed last (design §5.2).
   */
  ungrouped?: DataTableUngroupedPolicy;
}

export interface ResolvedDataGridGrouping<TData> {
  /** Per-group page size; `0` means per-group paging is off. */
  readonly pageSize: number;
  readonly enabled: boolean;
  readonly allowedColumns: readonly string[];
  readonly collapsible: boolean;
  readonly sticky: boolean;
  readonly selectionScope: DataTableGroupSelectionScope;
  readonly ungrouped: {
    readonly show: boolean;
    readonly name: string;
    readonly position: 'first' | 'last';
  };
  readonly renderGroup?: (context: DataGridGroupContext<TData>) => ReactNode;
}

// No `unused-imports/no-unused-vars` suppression here, unlike `selection.tsx` and
// `tree.tsx`: both of this group's augmentations actually use `TData`, so the
// disable those files need would be a suppression of nothing.
declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Row grouping: root records collapse under a synthetic group header while
     * each root's descendant tree stays attached. `false`/omitted disables it.
     *
     * The grouped columns themselves live in the `grouping` state slice; this
     * config carries the behavior around them.
     */
    grouping: false | DataGridGroupingConfig<TData>;
  }
  interface DataGridResolvedConfigMap<TData> {
    grouping: ResolvedDataGridGrouping<TData>;
  }
  // No `DataGridIdentityFreeMap` entry, deliberately. Design §3.1's normative
  // list of identity-bearing features does not include grouping, and nothing in
  // the group is keyed by row id: collapse is keyed by the synthetic group id, and
  // group selection goes through `selection`, which declares its own constraint.
  // So `grouping` is usable without `getRowId`, and a grid that groups *and*
  // selects needs identity because of `selection` rather than because of this.
  // (`data-grid-config/README.md` lists `grouping` among the identity-bearing
  // features; that line is inaccurate — reported, not worked around.)
}

export const groupingConfig = defineDataGridConfig({
  key: 'grouping',
  kind: 'grouped',
  // No deprecated flat aliases: grouping is new DataGrid surface, so there is no
  // shipped boolean prop for it to normalize.
  aliases: [],

  resolve({ props, resolved }) {
    const warnings: string[] = [];
    const config =
      props.grouping !== undefined && props.grouping !== false
        ? props.grouping
        : undefined;

    // Per-group paging composes with grid pagination in one direction only, and the
    // result is almost never what anyone means: grid pagination slices the flat row
    // list first, so each group's pager then pages whatever survived that slice —
    // "page 1 of 3" inside a group that is itself only part of page 1.
    if (
      config?.pageSize !== undefined &&
      config.pageSize > 0 &&
      props.pagination !== undefined &&
      props.pagination !== false
    ) {
      warnings.push(
        'DataGrid: `grouping.pageSize` pages each group and `pagination` pages the whole grid; the grid slices first, so a group pager then pages only what survived that slice. Use one or the other.'
      );
    }

    if (config !== undefined && config.allowedColumns.length === 0) {
      warnings.push(
        'DataGrid: `grouping.allowedColumns` is required and cannot be empty; a grouping group that permits no column groups nothing.'
      );
    }

    // `sticky` needs something to stick inside. Same shape as
    // `appearance.stickyHeader`'s own warning, and keyed the same way — on the
    // caller having set it.
    if (
      config?.sticky === true &&
      resolved.appearance?.height === undefined &&
      resolved.appearance?.maxHeight === undefined
    ) {
      warnings.push(
        'DataGrid: `grouping.sticky` needs `appearance.height` or `appearance.maxHeight`; without a bounded height the table never scrolls and a group row has nothing to stick to.'
      );
    }

    // `selectionScope` governs the group select-all, so it is inert wherever that
    // control does not render. Keyed on the caller having SET it, not on the
    // resolved value — the resolved default is a real value and would fire this
    // for every grid that never touched it.
    if (
      config?.selectionScope !== undefined &&
      !groupSelectionVisible(resolved)
    ) {
      warnings.push(
        'DataGrid: `grouping.selectionScope` governs the group select-all, which does not render without multiple selection and `selection.showSelectAll`.'
      );
    }

    return {
      value: {
        enabled: config !== undefined,
        allowedColumns: config?.allowedColumns ?? [],
        collapsible: config?.collapsible ?? true,
        sticky: config?.sticky ?? false,
        selectionScope: config?.selectionScope ?? 'all-loaded-leaves',
        // Floored and clamped at resolve time so every reader downstream — the
        // engine, the pager, the warning below — sees one number rather than each
        // coercing a caller's value its own way.
        pageSize: Math.max(0, Math.floor(config?.pageSize ?? 0)),
        ungrouped: {
          show: config?.ungrouped?.show ?? true,
          name: config?.ungrouped?.name ?? DATA_GRID_UNGROUPED_DEFAULT_NAME,
          position: config?.ungrouped?.position ?? 'last',
        },
        ...(config?.renderGroup === undefined
          ? {}
          : { renderGroup: config.renderGroup }),
      },
      warnings,
    };
  },

  controllerOptions({ resolved }) {
    const {
      enabled,
      allowedColumns,
      collapsible,
      sticky,
      selectionScope,
      ungrouped,
      renderGroup,
      pageSize,
    } = resolved.grouping;
    if (!enabled) {
      return { grouping: false };
    }

    const showSelection = groupSelectionVisible(resolved);

    return {
      grouping: {
        allowedColumns,
        collapsible,
        sticky,
        selectionScope,
        ungrouped,
        pageSize,
        // Threaded, not re-decided: the same policy the header select-all uses,
        // so the two controls cannot resolve a mixed state opposite ways.
        selectAllOnIndeterminate: resolved.selection.selectAllOnIndeterminate,
        // The caller's renderer wins outright; otherwise DataGrid's standard group
        // header. The engine half renders neither — it emits the name and count as
        // text when nothing is supplied, which is what a direct DataTable
        // composition gets (§4.3).
        renderGroup: (context: DataTableGroupContext<unknown>) =>
          renderGroup === undefined ? (
            <DataGridGroupHeader
              context={context}
              showSelection={showSelection}
              labels={resolved.labels}
            />
          ) : (
            renderGroup(context)
          ),
      },
    };
  },
});

/**
 * Whether a group row's select-all renders at all.
 *
 * Gated on the header select-all's own conditions rather than on a member of its
 * own: `showSelectAll: false` is a caller saying they do not want bulk-select
 * controls, and honouring that for the header while adding one per group row would
 * be the opposite of what they asked. Single mode has no bulk control to offer.
 */
function groupSelectionVisible(resolved: {
  readonly selection?: {
    readonly enabled: boolean;
    readonly mode: 'single' | 'multiple';
    readonly showSelectAll: boolean;
  };
}): boolean {
  const selection = resolved.selection;

  return (
    selection !== undefined &&
    selection.enabled &&
    selection.mode === 'multiple' &&
    selection.showSelectAll
  );
}
