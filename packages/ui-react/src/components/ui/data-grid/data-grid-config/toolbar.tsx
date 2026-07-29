import {
  DataGridBulkActions,
  type DataGridBulkAction,
} from '../data-grid-actions';
import { DataGridToolbar } from '../data-grid-toolbar';
import { defineDataGridConfig } from './registry';

// OWNERSHIP: **F4/F5**, and unassigned for Wave 1. It *reads*
// `resolved.filters`, so a change to the filters resolved shape (U7) breaks
// this file. U7 and U9 must not both edit it — escalate to the team lead
// before either does.

// The `toolbar` behavior group (design §5.2): which controls the toolbar row
// surfaces, and the selection bulk-action bar above it.
//
// P1 note: `leading` and `trailing` content are unimplemented; they extend
// `DataGridToolbarConfig` and this module's `chrome`.

/**
 * Toolbar config. Every member is optional and the design's defaults are
 * `globalSearch: false`, `columnFilters: false`, `viewOptions: true`, no bulk
 * actions. `globalSearch` needs a search column via `filters.global`/`searchKey`.
 * The deprecated flat form is a boolean plus the separate
 * `searchKey`/`bulkActions` props.
 */
export interface DataGridToolbarConfig<TData> {
  globalSearch?: boolean;
  /**
   * Surface the per-column filter controls defined by `filters.columns`.
   * Defaults to `false` — filter *definitions* and the decision to *show* the
   * controls are separate (design §5.2).
   */
  columnFilters?: boolean;
  /** Show the column-visibility ("View") menu. Defaults to `true`. */
  viewOptions?: boolean;
  bulkActions?: readonly DataGridBulkAction<TData>[];
}

export interface ResolvedDataGridToolbar<TData> {
  /** Whether the toolbar row renders at all. */
  readonly enabled: boolean;
  /** Whether the search box renders (needs a search column). */
  readonly globalSearch: boolean;
  /** Whether the column-filter controls render. */
  readonly columnFilters: boolean;
  /** Whether the column-visibility menu renders. */
  readonly viewOptions: boolean;
  readonly bulkActions?: readonly DataGridBulkAction<TData>[];
}

declare module './registry' {
  interface DataGridGroupedConfigMap<TData> {
    /**
     * Toolbar. A `DataGridToolbarConfig` (`{ globalSearch, columnFilters,
     * viewOptions, bulkActions }`) or — deprecated — a boolean. `{}` renders the
     * view-options menu only.
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

    // The default flip is deliberate (design §5.2) but silent from the caller's
    // side — filter definitions that surface nowhere look like a broken grid.
    if (!columnFilters && (resolved.filters?.definitions.length ?? 0) > 0) {
      warnings.push(
        'DataGrid: `filters.columns` defines filter controls but `toolbar.columnFilters` is not enabled, so none render. Pass `toolbar={{ columnFilters: true }}` to surface them.'
      );
    }

    return {
      value: {
        enabled:
          config !== undefined ||
          props.toolbar === true ||
          searchColumn !== undefined,
        globalSearch:
          searchColumn !== undefined &&
          (config ? config.globalSearch === true : true),
        columnFilters,
        viewOptions: config?.viewOptions ?? true,
        bulkActions,
      },
      warnings,
    };
  },

  chrome(slot, { controller, resolved }) {
    const toolbar = resolved.toolbar;

    // The bulk bar is driven by the selection, not by the toolbar row: a grid
    // with bulk actions and no toolbar still shows it.
    if (slot === 'top') {
      return toolbar.bulkActions && toolbar.bulkActions.length > 0 ? (
        <DataGridBulkActions
          controller={controller}
          actions={toolbar.bulkActions}
        />
      ) : null;
    }

    if (slot !== 'toolbar' || !toolbar.enabled) {
      return null;
    }
    const { searchPlaceholder } = resolved.filters;
    // The column-settings menu offers whatever `columnsFeatures` turned on.
    // Reading another group is legal here because `columnsFeatures` precedes
    // `toolbar` in the manifest; without this the menu's pinning section would be
    // declared and unreachable, which is the state rule 7 exists to prevent.
    const columns = resolved.columnsFeatures;
    return (
      <DataGridToolbar
        table={controller.table}
        globalSearch={toolbar.globalSearch}
        searchPlaceholder={searchPlaceholder}
        viewOptions={toolbar.viewOptions}
        columnSettings={{
          // When the group is absent every resolved flag is `false`, so reading
          // `visibility` straight through would silently remove the column list
          // from every grid that never opted in — the menu would render empty.
          // Absent means "what the control this replaced always did": visibility
          // only. Caught by a full-suite run, not by review.
          visibility: columns.enabled ? columns.visibility : true,
          pinning: columns.pinning,
          lockedColumnIds: columns.lockedColumnIds,
        }}
      />
    );
  },
});
