import type { ReactNode } from 'react';
import type { ColumnDef, HeaderContext } from '@tanstack/react-table';

import {
  DataGridBulkActions,
  type DataGridBulkAction,
} from '../data-grid-actions';
import { DataGridColumnFilterTriggers } from '../data-grid-column-filters';
import { DataGridColumnSettings } from '../data-grid-column-settings';
import { DataGridToolbar } from '../data-grid-toolbar';
import { DATA_GRID_ACTIONS_COLUMN_ID } from './actions';
import {
  DATA_GRID_CHROME_CELL_CLASS,
  DATA_GRID_CHROME_COLUMN_SIZING,
} from './chrome-column';
import { defineDataGridConfig } from './registry';
import { resolveSelectedCount } from './selected-count';

// OWNERSHIP: **F4/F5**, and unassigned for Wave 1. It *reads*
// `resolved.filters`, so a change to the filters resolved shape (U7) breaks
// this file. U7 and U9 must not both edit it — escalate to the team lead
// before either does.

// The `toolbar` behavior group (design §5.2): which controls the toolbar row
// surfaces, and the selection bulk-action strip that replaces them.
//
// ── PLTFRM-93130 reshaped this module in three ways ──────────────────────────
//
// 1. **The bulk bar is no longer a row of its own.** It used to mount in the `top`
//    chrome slot, above the toolbar, and `DataGridBulkActions` returned `null` at
//    zero selection — so the first selected row *inserted* a row and pushed the
//    table down. It is now the toolbar row's selected state, handed to
//    `DataGridToolbar` as `bulk`. The `top` slot returns `null` from here and
//    nothing built-in mounts there any more.
// 2. **The column-settings menu moved into a column header.** The `⚙` belongs above
//    the trailing column (design-system table spec, `ui-react` Figma node
//    4567-6801), which is also what lets the whole row be swapped. This module
//    therefore contributes a `columns` transform — see it for which column hosts
//    the gear.
// 3. **`leading` and `trailing` are implemented**, because with the row swapping
//    wholesale a caller needs a supported place for the loaded count and the
//    screen's primary action. They were declared-but-unbuilt before.

/**
 * Toolbar config. Every member is optional and the design's defaults are
 * `globalSearch: false`, `columnFilters: false`, `viewOptions: true`, no bulk
 * actions. `globalSearch` needs a search column via `filters.global`/`searchKey`.
 * The deprecated flat form is a boolean plus the separate
 * `searchKey`/`bulkActions` props.
 */
export interface DataGridToolbarConfig<TData> {
  /**
   * Show the global search box. It needs a search column to match against —
   * `filters.global.columnIds`, or the deprecated `searchKey`.
   */
  globalSearch?: boolean;
  /**
   * Surface the per-column filter controls defined by `filters.columns`.
   * Defaults to `false` — filter *definitions* and the decision to *show* the
   * controls are separate (design §5.2).
   *
   * The **triggers** render in the toolbar row, so a selection's bulk actions
   * replace them; the applied-filter **chips** render under it and stay visible.
   */
  columnFilters?: boolean;
  /**
   * Show the column-settings ("⚙") menu. Defaults to `true` whenever a toolbar is
   * configured at all.
   *
   * It renders in the **header cell of the trailing column** — the row-actions
   * column when there is one, otherwise a 40px column this group appends — not in
   * the toolbar row. Enabling it therefore adds a column to a grid that has no
   * actions column.
   */
  viewOptions?: boolean;
  /**
   * Actions offered once rows are selected. Each receives the selected rows and may
   * carry its own confirmation. Requires `selection`.
   *
   * While a selection exists these **replace** every idle member of the row rather
   * than adding a second row above it. Consequence worth knowing: a grid that
   * passes bulk actions keeps the row reserved even with nothing selected, because
   * a row that appeared on the first click is exactly the jump PLTFRM-93130 fixed.
   */
  bulkActions?: readonly DataGridBulkAction<TData>[];
  /** Content at the start of the row, before the filter triggers and search. */
  leading?: ReactNode;
  /**
   * Content at the end of the row: a loaded/total count, a primary action. Hidden
   * while rows are selected, like every other idle member.
   */
  trailing?: ReactNode;
}

export interface ResolvedDataGridToolbar<TData> {
  /**
   * Whether the toolbar row renders at all — **whether it has an occupant**, idle
   * or selected. It is no longer "did the caller pass `toolbar`": with the gear
   * gone from the row, `toolbar={{}}` alone has nothing to put in it, and an empty
   * strip above every grid is not free.
   */
  readonly enabled: boolean;
  /**
   * Whether the caller asked for a toolbar at all — a `toolbar` prop, or a search
   * column. Distinct from `enabled`, which says whether the row has an occupant: a
   * grid can ask for a toolbar and get an empty row (`toolbar={{ viewOptions: true }}`
   * puts its only control in a column header). The external-chrome conflict is about
   * the *request*, so `data-grid.tsx` validates against this member.
   */
  readonly requested: boolean;
  /** Whether the search box renders (needs a search column). */
  readonly globalSearch: boolean;
  /** Whether the column-filter triggers render in the row. */
  readonly columnFilters: boolean;
  /** Whether the column-settings menu renders in the trailing column's header. */
  readonly viewOptions: boolean;
  readonly bulkActions?: readonly DataGridBulkAction<TData>[];
  readonly leading?: ReactNode;
  readonly trailing?: ReactNode;
}

declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Toolbar. A `DataGridToolbarConfig` (`{ globalSearch, columnFilters,
     * viewOptions, bulkActions, leading, trailing }`) or — deprecated — a boolean.
     * `{}` renders the column-settings menu only.
     */
    toolbar: boolean | DataGridToolbarConfig<TData>;
  }
  interface DataGridDeprecatedAliasMap<TData> {
    /** @deprecated Use `toolbar.bulkActions`. Bulk actions while rows are selected. */
    bulkActions: readonly DataGridBulkAction<TData>[];
  }
  interface DataGridResolvedConfigMap<TData> {
    toolbar: ResolvedDataGridToolbar<TData>;
  }
}

/**
 * Id of the column this group appends to host the `⚙` when there is no row-actions
 * column to hang it on. A display column: no accessor, so `DataGridColumnSettings`
 * never offers it as a settable column, and nothing else can address it.
 */
export const DATA_GRID_SETTINGS_COLUMN_ID = '__settings__';

export const toolbarConfig = defineDataGridConfig({
  key: 'toolbar',
  kind: 'grouped',
  aliases: ['bulkActions'],

  resolve({ props, resolved }) {
    const warnings: string[] = [];

    // union: boolean | DataGridToolbarConfig
    const config =
      typeof props.toolbar === 'object' && props.toolbar !== null
        ? props.toolbar
        : undefined;

    let bulkActions = props.bulkActions;
    if (config?.bulkActions !== undefined) {
      if (props.bulkActions !== undefined) {
        warnings.push(
          'DataGrid: `toolbar.bulkActions` cannot be combined with `bulkActions`; the grouped `toolbar` config wins.'
        );
      }
      bulkActions = config.bulkActions;
    }

    const searchColumn = resolved.filters?.searchColumn;
    const columnFilters = config?.columnFilters ?? false;
    const definitionCount = resolved.filters?.definitions.length ?? 0;

    // The default flip is deliberate (design §5.2) but silent from the caller's
    // side — filter definitions that surface nowhere look like a broken grid.
    if (!columnFilters && definitionCount > 0) {
      warnings.push(
        'DataGrid: `filters.columns` defines filter controls but `toolbar.columnFilters` is not enabled, so none render. Pass `toolbar={{ columnFilters: true }}` to surface them.'
      );
    }

    const globalSearch =
      searchColumn !== undefined &&
      (config ? config.globalSearch === true : true);

    // "A toolbar was asked for" — the old `enabled` condition. It still gates the
    // gear, because the gear now costs a *column* and a grid that never mentioned a
    // toolbar must not silently grow one.
    const requested =
      config !== undefined ||
      props.toolbar === true ||
      searchColumn !== undefined;

    return {
      value: {
        // What the row would hold. `viewOptions` is deliberately absent from this
        // list: it renders in a column header now, so it is no longer a reason for
        // the row to exist.
        enabled:
          globalSearch ||
          (columnFilters && definitionCount > 0) ||
          (bulkActions !== undefined && bulkActions.length > 0) ||
          config?.leading !== undefined ||
          config?.trailing !== undefined,
        requested,
        globalSearch,
        columnFilters,
        viewOptions: requested && (config?.viewOptions ?? true),
        bulkActions,
        leading: config?.leading,
        trailing: config?.trailing,
      },
      warnings,
    };
  },

  /**
   * Mounts the `⚙` in the header of the **trailing** column.
   *
   * This transform runs last in the manifest, which is what makes "trailing"
   * knowable: `actions` has already spliced `__actions__`, and `detailExpansion` /
   * `selection` only ever *prepend*, so the final element of the array is genuinely
   * the last column.
   *
   *  - Row-actions column already at the end → the gear becomes **its** header,
   *    exactly the design-system layout (`⚙` above the `⋯` menus). No extra width.
   *  - Otherwise (no actions column, or `actions.placement: 'start'`) → append a
   *    40px display column whose header is the gear and whose cells are empty.
   *
   * `enableResizing: false` here, unlike the other chrome columns, which
   * deliberately leave resizing to `columnsFeatures.lockSystemColumns` so that
   * opt-out stays reachable. `lockedColumnIds` is resolved by `columnsFeatures`
   * *before* this column exists, so it cannot cover it — and unlike `__select__` /
   * `__detail__` / `__actions__` this column holds one 32px control and has nothing
   * to reveal, so there is no legitimate reason to drag it.
   */
  columns(columns, { resolved }) {
    if (!resolved.toolbar.viewOptions) {
      return columns;
    }

    const features = resolved.columnsFeatures;
    // Centred, with the table's 16px-a-side cell padding cancelled — without which
    // the 32px trigger has a 64px min-content in a 40px column, overhangs its own
    // cell and widens the table into a horizontal scroll. See
    // `DATA_GRID_CHROME_CELL_CLASS`.
    const header = ({ table }: HeaderContext<unknown, unknown>) => (
      <div className={DATA_GRID_CHROME_CELL_CLASS}>
        <DataGridColumnSettings
          table={table}
          labels={resolved.labels}
          // When the group is absent every resolved flag is `false`, so reading
          // `visibility` straight through would silently remove the column list from
          // every grid that never opted in — the menu would render empty. Absent
          // means "what the control this replaced always did": visibility only.
          visibility={features.enabled ? features.visibility : true}
          pinning={features.pinning}
          {...(features.lockedColumnIds === undefined
            ? {}
            : { lockedColumnIds: features.lockedColumnIds })}
        />
      </div>
    );

    const last = columns[columns.length - 1];
    if (last !== undefined && last.id === DATA_GRID_ACTIONS_COLUMN_ID) {
      // The assertion is the spread's fault, not the value's: `ColumnDef` is a union
      // whose branches are discriminated by which identifier they carry, and
      // spreading collapses `id` to `string | undefined` — so a def that provably has
      // an id no longer satisfies the `IdIdentifier` branch. `createActionsColumn`
      // asserts for the same reason.
      return [
        ...columns.slice(0, -1),
        { ...last, header } as ColumnDef<unknown, unknown>,
      ];
    }

    return [
      ...columns,
      {
        id: DATA_GRID_SETTINGS_COLUMN_ID,
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        enableResizing: false,
        ...DATA_GRID_CHROME_COLUMN_SIZING,
        header,
        cell: () => null,
      } as ColumnDef<unknown, unknown>,
    ];
  },

  chrome(slot, { controller, resolved }) {
    const toolbar = resolved.toolbar;

    // Nothing mounts above the toolbar any more. The bulk bar lived here until
    // PLTFRM-93130, and that is precisely what made the table jump: this slot is a
    // sibling row, so anything conditional in it moves everything below.
    if (slot !== 'toolbar' || !toolbar.enabled) {
      return null;
    }

    const bulkActions = toolbar.bulkActions ?? [];
    // The engine's per-row count is 0 by construction under a server `all-results`
    // token, so ask the resolver first — the same number the pager announces.
    const resolvedCount = resolveSelectedCount(resolved, controller);
    const selectedCount = resolvedCount ?? controller.getState().selection.size;
    // No bulk actions means no selected state: a selectable grid that offers none
    // keeps its idle row, and the footer already reports "N of M row(s) selected".
    const bulk =
      bulkActions.length > 0 && selectedCount > 0 ? (
        <DataGridBulkActions
          controller={controller}
          labels={resolved.labels}
          actions={bulkActions}
          {...(resolvedCount === undefined
            ? {}
            : { selectedCount: resolvedCount })}
        />
      ) : undefined;

    const { searchPlaceholder, definitions } = resolved.filters;
    const filters =
      toolbar.columnFilters && definitions.length > 0 ? (
        <DataGridColumnFilterTriggers
          controller={controller}
          filters={definitions}
        />
      ) : undefined;

    return (
      <DataGridToolbar
        table={controller.table}
        globalSearch={toolbar.globalSearch}
        searchPlaceholder={searchPlaceholder}
        {...(bulk === undefined ? {} : { bulk })}
        {...(filters === undefined ? {} : { filters })}
        {...(toolbar.leading === undefined ? {} : { leading: toolbar.leading })}
        {...(toolbar.trailing === undefined
          ? {}
          : { trailing: toolbar.trailing })}
      />
    );
  },
});
