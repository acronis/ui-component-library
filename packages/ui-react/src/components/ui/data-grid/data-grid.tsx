import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTableRoot, DataTableView, useDataTable } from '../data-table';
import {
  applyPresets,
  buildGroupedConfigAliases,
  composeColumns,
  composeControllerOptions,
  composeViewProps,
  renderChromeSlot,
  resolveDataGridConfig,
  DATA_GRID_CONFIG_MODULES,
  DATA_GRID_CONFIG_PROP_KEYS,
  type DataGridChromeSlot,
  type DataGridProps,
  type ResolvedDataGrid,
} from './data-grid-config';
import { applyTruncateColumns } from './data-grid-truncate-columns';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Phase 1).
//
// DataGrid is the batteries-included, config-driven composite the proposal calls
// for: `<DataGrid columns={…} rows={…} />`. Where the `Table` primitive is
// maximally compositional and `DataTable` is the flexible engine + composition
// layer, DataGrid assembles the *whole* approved layout — bulk-action bar,
// toolbar (search + column visibility), the grid, an optional selection column,
// sortable headers, column filters, row actions, loading/empty states, and
// pagination — so every grid in the app reads the same way.
//
// It builds on the ONE shared DataTable controller (`useDataTable`): a single
// TanStack instance owns the normalized state, so every control reads and
// mutates the same engine. See context/table-feature-parity-design.md §1, §4.1.
//
// ── Where the behavior lives ────────────────────────────────────────────────
//
// Almost none of it is in this file. Every behavior group is a module under
// `./data-grid-config/`, and this component is only the wiring between them:
// resolve → columns → controller → view props → chrome slots. The grouped-config
// type, the deprecated-alias record, and the resolved shape are all *derived*
// from that registry (ADR-0002), so adding a group is one new module file plus
// one line in `data-grid-config/index.ts` — never an edit here.

// Not a behavior group (see `data-grid-truncate-columns.tsx`'s header), so not
// part of the block below — but still needs a name a consumer can import, same
// as every type in it.
export type {
  DataGridTruncateCellContext,
  DataGridTruncateColumnMeta,
} from './data-grid-truncate-columns';

// Public surface. The behavior groups own their own config types, and this
// block is what keeps `data-grid/index.ts` (a manifest file) unchanged when a
// group moves or a new one lands.
export type {
  DataGridAppearanceConfig,
  DataGridChrome,
  DataGridChromeContext,
  DataGridChromeSlot,
  DataGridColumnFilterDef,
  DataGridColumnsFeaturesConfig,
  DataGridDataStateConfig,
  DataGridDataStatus,
  DataGridDetailExpansionConfig,
  DataGridFacetSource,
  DataGridFiltersConfig,
  DataGridFooterConfig,
  DataGridGroupedConfig,
  DataGridGroupingConfig,
  DataGridLabels,
  DataGridPaginationConfig,
  DataGridPersistenceConfig,
  DataGridPreset,
  DataGridPresetsInput,
  DataGridProps,
  DataGridRowInteractionConfig,
  DataGridSelectionConfig,
  DataGridServerConfig,
  DataGridServerSelection,
  DataGridServerSelectionChangeEvent,
  DataGridSortingConfig,
  DataGridSummary,
  DataGridSummaryPresentation,
  DataGridToolbarConfig,
  DataGridTreeConfig,
  DataGridVirtualizationConfig,
  IdentityFreeDataGridState,
} from './data-grid-config';

/**
 * The grouped-config keys a preset may set, each mapped to the deprecated flat
 * aliases that normalize into it. A preset never overrides a group the caller
 * touched — by grouped prop *or* by alias — so explicit input always wins and a
 * preset can't manufacture a spurious grouped-vs-alias duplicate warning.
 *
 * Derived from the registry: a group is preset-addressable precisely because its
 * module declares `kind: 'grouped'`.
 */
const GROUPED_CONFIG_ALIASES = buildGroupedConfigAliases(
  DATA_GRID_CONFIG_MODULES
);

const EMPTY_PRESET_IDS: readonly string[] = [];

declare const process: {
  readonly env: { readonly NODE_ENV?: string };
};

function defaultRowId(_row: unknown, index: number): string {
  return String(index);
}

function resolveColumnId(
  column: ColumnDef<unknown, unknown>
): string | undefined {
  if (column.id !== undefined) {
    return column.id;
  }
  if ('accessorKey' in column && column.accessorKey !== undefined) {
    return String(column.accessorKey);
  }
  return undefined;
}

/** Development-only validation of invalid DataGrid config combinations. */
function useDataGridValidation(input: {
  externalChrome: boolean;
  hasToolbar: boolean;
  hasBulkActions: boolean;
  multipleSelection: boolean;
  warnings: readonly string[];
}): void {
  const { externalChrome, hasToolbar, hasBulkActions, multipleSelection } =
    input;
  // Join so the effect re-runs only when the set of messages actually changes.
  const warningKey = input.warnings.join('\n');

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    for (const warning of warningKey === '' ? [] : warningKey.split('\n')) {
      console.error(warning);
    }
    if (externalChrome && hasToolbar) {
      console.error(
        'DataGrid: `chrome.mode="external"` cannot be combined with `toolbar`/`searchKey`; the external renderer owns toolbar composition.'
      );
    }
    if (hasBulkActions && !multipleSelection) {
      console.error(
        'DataGrid: bulk actions require multiple selection (`selectable` with `selectionMode="multiple"`).'
      );
    }
  }, [
    externalChrome,
    hasToolbar,
    hasBulkActions,
    multipleSelection,
    warningKey,
  ]);
}

// `TValue = unknown` for the same reason `DataGridProps` carries the default
// (PLTFRM-93046): without it, `<DataGrid<Person> …/>` — the one form a consumer
// reaches for when inference needs a nudge on an empty `columns`/`rows` array —
// failed with TS2558 "Expected 2 type arguments, but got 1".
export function DataGrid<TData, TValue = unknown>(
  props: DataGridProps<TData, TValue>
) {
  const {
    columns,
    rows,
    getRowId = defaultRowId,
    chrome,
    callbacks,
    portalContainer,
  } = props;

  // Feature detection runs exactly once per grid, against the initial columns
  // and rows — it must never observe mutable state (design §5.2).
  const [detectedPresetIds] = useState<readonly string[]>(
    () => props.presets?.detect?.({ columns, rows }) ?? EMPTY_PRESET_IDS
  );

  // Feeds `applyTruncateColumns` below — a plain measured value, not a config
  // module contribution, because no module needs it and nothing here is
  // caller-configured through a prop. Measuring the grid's own root rather than
  // anything inside it: the columns it feeds have to exist before the table
  // that would otherwise be the more obvious thing to measure ever mounts, and
  // the root's width does not depend on how those columns render, which is
  // exactly the property a stable measurement needs.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [tableWidth, setTableWidth] = useState(0);

  useEffect(() => {
    const element = rootRef.current;
    if (element === null || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setTableWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Presets fill in the groups the caller left alone; the config modules then
  // normalize the grouped configs and their deprecated flat aliases into one
  // effective value set.
  //
  // The dependency list is the exact set of props the registry reads — every
  // group key, every alias, and every declared extra `reads` entry — because
  // depending on the whole `props` object would recompute on every render (React
  // allocates a fresh props object each time) and take the column set's
  // referential stability with it. That stability is load-bearing: a new
  // `columns` array invalidates TanStack's memoized row model, so churning it
  // rebuilds the row model on every render of every grid.
  const configDeps = DATA_GRID_CONFIG_PROP_KEYS.map(
    (key) => (props as unknown as Record<string, unknown>)[key]
  );
  const { resolved, warnings } = useMemo(
    () => {
      const preset = applyPresets(
        props,
        detectedPresetIds,
        GROUPED_CONFIG_ALIASES
      );
      const result = resolveDataGridConfig(
        preset.props,
        DATA_GRID_CONFIG_MODULES
      );
      return {
        resolved: result.resolved,
        warnings: [...preset.warnings, ...result.warnings],
      };
    },
    // The rule below wants a literal, because a dependency list that changes
    // *length* between renders breaks React. This one cannot: the key list is
    // derived from the module manifest and frozen at module load, so the length
    // is always `DATA_GRID_CONFIG_PROP_KEYS.length + 2`. Spelling the list out
    // literally is the hand-listed dependency F4 exists to remove — it would put
    // one contended line back in front of every unit that adds a group.
    // `props` is intentionally absent for the same reason: the registry declares
    // exactly which of its members resolution reads, and depending on the object
    // would defeat the memo entirely.
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
    [detectedPresetIds, props.presets, ...configDeps]
  );

  // Assemble the final column set. Memoized because a new columns array
  // invalidates TanStack's memoized row model; every input is stable when the
  // caller's props are.
  const resolvedColumns = useMemo(
    () =>
      composeColumns(columns, DATA_GRID_CONFIG_MODULES, {
        resolved,
        callbacks,
        resolveColumnId: resolveColumnId as (
          column: ColumnDef<TData, unknown>
        ) => string | undefined,
      }),
    [columns, resolved, callbacks]
  );

  // Applied after the registry's own transforms, not folded into one of them —
  // see `data-grid-truncate-columns.tsx`'s header for why this isn't a config
  // module at all. `resolvedColumns`, not the caller's `columns`: a column
  // `filters`/`actions`/`selection` rewrote or spliced must still see its own
  // `meta.truncate` honored, and this only reads `meta`, which none of those
  // transforms touch.
  const truncatedColumns = useMemo(
    () => applyTruncateColumns(resolvedColumns, tableWidth, portalContainer),
    [resolvedColumns, tableWidth, portalContainer]
  );

  const engineColumns = truncatedColumns as ColumnDef<TData, unknown>[];
  const { data, ...controllerOptions } = composeControllerOptions(
    DATA_GRID_CONFIG_MODULES,
    { resolved, callbacks, rows, columns: engineColumns }
  );

  const controller = useDataTable<TData>({
    columns: engineColumns,
    data: (data ?? rows) as TData[],
    getRowId,
    ...controllerOptions,
  });

  const externalChrome = chrome?.mode === 'external';
  useDataGridValidation({
    externalChrome,
    // `requested`, not `enabled`: the conflict is that the caller asked for a
    // built-in toolbar while also owning chrome externally. Since PLTFRM-93130
    // `enabled` only says whether the row has an occupant, so a `toolbar` whose
    // single control now lives in a column header would have slipped past this.
    hasToolbar: resolved.toolbar.requested,
    hasBulkActions: Boolean(
      resolved.toolbar.bulkActions && resolved.toolbar.bulkActions.length > 0
    ),
    multipleSelection:
      resolved.selection.enabled && resolved.selection.mode === 'multiple',
    warnings,
  });

  const viewProps = composeViewProps(DATA_GRID_CONFIG_MODULES, {
    resolved,
    callbacks,
    columnCount: resolvedColumns.length,
  });

  // External chrome suppresses every built-in control but keeps the grid body,
  // data-state rows, and footer.
  const slot = (name: DataGridChromeSlot) =>
    externalChrome
      ? null
      : renderChromeSlot(name, DATA_GRID_CONFIG_MODULES, {
          controller,
          resolved: resolved as ResolvedDataGrid<TData>,
          callbacks,
        }).map(({ key, node }) => <Fragment key={key}>{node}</Fragment>);

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {externalChrome
        ? chrome.render({
            controller,
            selectedRows: controller.table
              .getSelectedRowModel()
              .rows.map((row) => row.original),
            query: controller.getQuery(),
            state: controller.getState(),
          })
        : null}

      {slot('top')}
      {slot('toolbar')}
      {slot('under-toolbar')}

      <DataTableRoot table={controller}>
        <DataTableView<TData> {...viewProps} />
      </DataTableRoot>

      {slot('bottom')}
    </div>
  );
}
