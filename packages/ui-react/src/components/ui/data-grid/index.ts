export {
  DataGrid,
  type DataGridProps,
  type DataGridColumnFilterDef,
  type DataGridServerConfig,
  type DataGridChrome,
  type DataGridChromeContext,
  type DataGridSelectionConfig,
  type DataGridSortingConfig,
  type DataGridAppearanceConfig,
  type DataGridDataStateConfig,
  type DataGridRowInteractionConfig,
  type DataGridFiltersConfig,
  type DataGridPaginationConfig,
  type DataGridToolbarConfig,
  type DataGridGroupedConfig,
  type DataGridPreset,
  type DataGridPresetsInput,
  // #43/#50 — the outermost hop. These four shipped with their groups but were
  // re-exported at none of the three hops, so a consumer could pass
  // `columnsFeatures` or `footer` and had no way to name the type. Nothing in the
  // tree notices this line's absence; only an external consumer does.
  type DataGridColumnsFeaturesConfig,
  type DataGridFooterConfig,
  type DataGridSummary,
  type DataGridSummaryPresentation,

  // ── #43, second pass: the gap was 4× what the task recorded ────────────────
  // The enumeration the task prescribed had never been executed. Run against the
  // config manifest (56 identifiers, with `DataGridProps` as a sanity control
  // proving the check can see a present type), **eleven** consumer-facing types
  // were unreachable, not two.
  //
  // **`src/index.ts` is `export * from './components/ui/data-grid'` — a wildcard —
  // so THIS file is the last explicit gate.** Anything absent here is unreachable
  // by a consumer whatever the inner hops say, which is why the two groups below
  // are one defect wearing two symptoms.
  //
  // NINE were missing at this hop AND at `data-grid.tsx`:
  type DataGridChromeSlot,
  type DataGridDetailExpansionConfig,
  type DataGridFacetSource,
  type DataGridGroupingConfig,
  type DataGridPersistenceConfig,
  type DataGridServerSelection,
  type DataGridServerSelectionChangeEvent,
  type DataGridTreeConfig,
  type DataGridVirtualizationConfig,

  // TWO were exported at `data-grid.tsx` but stopped here — **the worse shape**,
  // because the inner hop's presence makes them read as done. Found only by
  // checking both directions rather than "missing at both".
  type DataGridDataStatus,
  type IdentityFreeDataGridState,
  //
  // ⚠ `DataGridGroupingConfig` above is the correction that explains the stale
  // count. #43 cited it as the *positive* example — "U4 did it right" — but what
  // shipped was `DataGridGroupedConfig`, the grouped-config container. Four
  // characters apart, opposite status, and the near-miss is very likely why the
  // recorded figure stayed at two. Both are now exported; they are different types.
  //
  // Type-only, so nothing rendered changes and no baseline moves.
} from './data-grid';
export {
  createActionsColumn,
  DataGridBulkActions,
  type DataGridActionConfirm,
  type DataGridRowAction,
  type DataGridActionsConfig,
  type DataGridBulkAction,
} from './data-grid-actions';
export {
  resolveSliceCallbacks,
  type DataGridCallbacks,
  type DataGridSelectionChangeEvent,
  type DataGridCurrentRowChangeEvent,
  type DataGridPaginationChangeEvent,
  type DataGridColumnSlice,
  type DataGridColumnStateChangeEvent,
  type DataGridRowActionEvent,
  type DataGridDataStateActionEvent,
  type DataGridSliceCallbacks,
} from './data-grid-callbacks';
export {
  evaluateFilterOperator,
  operatorFilterFn,
  FILTER_OPERATOR_LABELS,
  type DataGridFilterOperator,
  type DataGridFilterValue,
} from './data-grid-filter-operators';
