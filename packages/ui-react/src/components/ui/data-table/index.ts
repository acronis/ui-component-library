// Flexible DataTable composition API (the TanStack engine + composition layer).
// One controller owns the normalized state and the single engine instance;
// DataTableRoot provides it and DataTableView projects it through Table. See
// context/table-feature-parity-design.md §4.
export {
  useDataTable,
  type DataTableController,
  type DataTableControllerOptions,
  type DataTableColumnsFeaturesConfig,
  type DataTableSortingConfig,
  type DataTableSelectionConfig,
  type DeprecatedDataTableControllerOptions,
  type DataTableToggleAction,
  type IdentityFreeDataTableState,
} from './data-table-controller';
export {
  DataTableRoot,
  useDataTableRoot,
  type DataTableRootProps,
} from './data-table-root';
export { DataTableView, type DataTableViewProps } from './data-table-view';

// DataTable-layer types that a **public DataGrid config type names in its own
// structure** (#43, the DataTable half of the three-hop barrel).
//
// These are the only ones owed a line, and the criterion is narrow on purpose: a
// type is here because a consumer has to be able to *name* it to write a value in
// a separate file — a storage adapter, a `format` callback, an `include` array
// built in a helper. `footer.tsx:1-14` documented owing this before U10 looked,
// calling a deep relative import "the emergency valve, not the preferred route".
//
// **Enumerated from the config manifest, not from the integration records** — the
// records are not a complete enumeration, which is how two DataGrid types went
// missing from all three hops. Of the eleven DataTable-layer types imported by
// deep relative path across `data-grid-config/`, five are deliberately NOT here:
// `DataTablePersistenceConfig`, `DataTableFooterConfig`, `DataTableColumnControls`
// and `DataTableTreeStatusContext` appear only inside module bodies, and
// `DataTableGroupContext` is discharged by `grouping.tsx`'s exported
// `DataGridGroupContext` alias. Exporting a type no consumer can need is the same
// declared-and-unreachable defect one level out.
//
// `src/index.ts` re-exports this barrel with `export *`, so these need no edit
// there. `../__tests__/table-family-public-types.test.ts` asserts both hops.
// **`DataTableColumnControls` is here for a different reason than the six below,
// and the difference has to be stated or the next person removes it.**
//
// It is **not** named inside any exported DataGrid type — by the structural
// criterion below it does not qualify, and `columns-features.tsx` uses it only in
// one local unexported function. It is exported because of **#85**: the `columns`
// render-context namespace is contributed and read by nothing typed, so an
// external *custom composer* — the use the source itself documents — could not
// name this type at all, and the only existing consumer rebuilds it as an
// intersection inside a test.
//
// The spine-side fix was withdrawn (it coupled the spine to a feature module), so
// this export is what remains of the mitigation: with the name reachable, a
// consumer can perform that intersection themselves. That turns "cannot name the
// type" into "the consumer does the intersection" — ergonomic residue rather than
// a capability loss.
//
// **So do not delete this by applying the structural rule below.** It is a
// deliberate exception with a reason and a ticket.
export { type DataTableColumnControls } from './data-table-features/columns';
export {
  type DataTableSummaryDefinition,
  type DataTableSummaryValue,
} from './data-table-features/footer';
export {
  type DataTableGroupSelectionScope,
  type DataTableUngroupedPolicy,
} from './data-table-features/grouping';
export {
  type DataTablePersistableSlice,
  type DataTablePersistenceStorage,
} from './data-table-features/persistence';

// Typed, framework-neutral render contexts. They expose values, metadata, and
// commands only — never preassembled product chrome (that belongs to DataGrid).
export {
  createHeaderContext,
  createRowContext,
  createCellContext,
  createStateContext,
  type DataTableHeaderContext,
  type DataTableRowContext,
  type DataTableCellContext,
  type DataTableStateContext,
  type DataTableSortDirection,
  type DataTableRenderStatus,
  type DataTableRowPointerEvent,
  type DataTableRowActivationEvent,
  type DataTableCellPointerEvent,
} from './data-table-render-context';

// Framework-neutral state, change-event, and query contract.
export {
  assertDataTableStateIntegrity,
  type SerializablePrimitive,
  type SerializableObject,
  type SerializableValue,
  type DataTableSortDescriptor,
  type DataTableFilterDescriptor,
  type DataTablePaginationState,
  type DataTableColumnPinningState,
  type DataTableState,
  type DataTableSlice,
  type DataTableSliceValue,
  type DataTableChangeCause,
  type DataTableChangeEvent,
  type DataTableQuery,
  type DataTableQueryChangeEvent,
  type DataTableStateInput,
  type DataTableStateAdapterOptions,
} from './data-table-contract';
export {
  createDataTableQuery,
  createDataTableRequestKey,
  serializeDataTableRequest,
} from './data-table-query';
export {
  createDefaultDataTableState,
  useControllableDataTableSlice,
} from './data-table-state';

// React-only engine escape hatches: the seven-key TanStack option allowlist and
// the analyzable custom-feature plugin surface (design §4.1). DataGrid exposes
// neither.
export {
  DATA_TABLE_SAFE_ENGINE_OPTION_KEYS,
  TANSTACK_TABLE_OPTION_CLASSIFICATION,
  normalizeDataTableEngineOptions,
  type DataTableSafeEngineOptionKey,
  type DataTableEngineOptions,
} from './data-table-engine-options';
export {
  inspectDataTablePluginTopology,
  prepareDataTableExtensions,
  DATA_TABLE_RESERVED_PLUGIN_ID_PREFIXES,
  DATA_TABLE_LIBRARY_OWNED_EXTENSION_KEYS,
  type DataTableEnginePlugin,
  type DataTableEnginePluginManifest,
  type DataTablePluginRegistrar,
  type DataTablePluginScopedRegistry,
  type DataTablePrivatePluginRegistry,
  type DataTablePluginTopology,
  type DataTableReactExtensions,
  type PreparedDataTableExtensions,
} from './data-table-engine-plugins';

// Convenience table-view entry point built on the same controller.
export { DataTable, type DataTableProps } from './data-table';

// FROZEN one-minor compatibility adapters. The library does NOT publish a
// batteries-included `DataTable*` companion suite as its long-term architecture
// (design §1); these standard product-chrome pieces move behind DataGrid and are
// removed next major. Do not add new features here.
export { DataTableColumnHeader } from './data-table-column-header';
export { DataTablePagination } from './data-table-pagination';
export { DataTableToolbar } from './data-table-toolbar';
export { DataTableViewOptions } from './data-table-view-options';
