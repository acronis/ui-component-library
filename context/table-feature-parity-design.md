# Table feature parity: target design

- **Status:** Implementation-ready design record
- **Date:** 2026-07-23
- **Scope:** `packages/ui-react` Table, DataTable, and DataGrid; their
  `packages/ui-spec` component specs, patterns, and scenarios
- **Legacy source:** `packages/vue/src/components/table` in the retired
  `@uikit/ui-kit` checkout
- **Related:** `context/opinionated-composites-proposal.md`

## 1. Decision

The table family has three deliberately different layers:

1. **Table is a semantic, presentational primitive.** It owns native table
   elements, visual states, overflow, and small accessible affordances. It does
   not own row data or feature state.
2. **DataTable is the flexible React/TanStack engine and composition layer.**
   One controller owns the normalized state and engine instance. DataTable
   exposes row models, state/plugin hooks, actions, metadata, and render
   contexts, then projects them through Table. It does not ship or automatically
   compose product chrome from other UIKit primitives.
3. **DataGrid is the opinionated, config-driven composite.** It maps grouped
   feature configs onto DataTable and exclusively owns the approved
   batteries-included toolbar/filter, selection controls, data-state
   presentation, actions, menus, overlays, and pagination UI. Those controls
   must reuse UIKit primitives rather than bespoke local controls.

Consumers use DataGrid for a standard records screen, DataTable for an uncommon
but supported composition, and Table for fully custom semantic table markup.
Standard DataGrid screens do not render a second external toolbar, filters,
pagination, or empty state.

The ownership rule is based on composition, not feature-state complexity:

- Table may render table-shaped presentation and semantic attributes only.
- DataTable may model advanced behavior, including sorting, filtering,
  selection, grouping, tree state, virtualization, server queries, and
  persistence, but exposes that behavior through TanStack-oriented
  state/plugins/actions and render contexts.
- If the library supplies a visible feature by composing another UIKit
  primitive (`Checkbox`, `InputSearch`, `Filter`, `Pagination`, `Popover`,
  `Tooltip`, `Menu`, `Dialog`, `Empty`, `Alert`, and so on), that supplied UI
  belongs to DataGrid.

A DataTable consumer may use its render contexts to build a deliberately custom
experience with UIKit primitives. That is application composition, not a second
batteries-included DataTable API. The library does not publish
`DataTableToolbar`, `DataTablePagination`, `DataTableBulkActions`,
`DataTableColumnMenu`, or equivalent standard product-chrome components as the
long-term architecture.

This fixes two current defects:

- DataTable's internal engine instance cannot be shared with its external
  toolbar, pagination, and view-options companions.
- DataTable installs client pagination unconditionally and silently renders only
  the first ten rows when pagination was not requested.

## 2. Labels and disposition rules

- **Shipped parity:** confirmed in the legacy Vue implementation or its shipped
  tests/stories. Required for React parity.
- **Proposed-only:** specified or proposed in the legacy work but not confirmed
  as a coherently shipped behavior. Accepted as new React behavior unless the
  ledger says otherwise.
- **React current:** already present in the current React implementation.
- **Accepted:** part of the target contract. A later milestone is sequencing,
  not uncertainty.
- **Deferred:** has a precise boundary and rationale.
- **Rejected:** intentionally excluded with a named replacement.

No confirmed shipped feature is rejected without an equivalent supported
replacement. Mixed legacy/new work is split into separate ledger rows.

## 3. Framework-neutral contract

The component specs remain framework-neutral. They describe row IDs, columns,
state slices, change events, queries, configs, and rendering parts without
mentioning React hooks or TanStack types. Framework adapters map those concepts
to native types.

### 3.1 Identity rule

The neutral rule is conditional and singular:

- `row-id` is optional only when every identity-bearing feature is disabled.
- It is required when selection, detail expansion, tree expansion/lazy load,
  current row, row actions, persistence of row state, server data replacement,
  or imperative row targeting is enabled.
- DataGrid's grouped-config API follows the same conditional rule, not an
  unconditional one: `row-id` is required exactly when a grouped config
  enables an identity-bearing feature (the two bullets above), same as
  DataTable. _Correction:_ an earlier revision of this bullet said the
  grouped-config API "always requires `row-id`". That reading has no
  faithful implementation for a JSX component with one props interface — the
  only way to enforce "always" is to reject every grouped prop on the
  identity-free branch, which would force `getRowId` on a grid that merely
  sets, say, `sorting`, destroying the identity-free case the discriminated
  union below exists to preserve. Ruled: the discriminated union — whose
  identity-free branch admits `state`, `defaultState`, and every
  non-identity-bearing feature — is normative; loose prose that conflicts
  with it, as this bullet did, is not.

The React adapter enforces this with a discriminated options union:

```ts
type IdentitySlice =
  'selection' | 'detailExpanded' | 'treeExpanded' | 'currentRowId';

type IdentityFreeDataTableState = Omit<DataTableState, IdentitySlice> & {
  [Slice in IdentitySlice]?: never;
};

type IdentityFreeOptions<TData> = {
  getRowId?: never;
  selection?: false;
  detailExpansion?: false;
  tree?: false;
  // Only `current` is identity-bearing (it tracks a row by ID); the handlers
  // hand over the row object and need no identity, so they stay available
  // here.
  rowInteraction?: Omit<RowInteractionConfig<TData>, 'current'> & {
    current?: false;
  };
  actions?: false;
  server?: false;
  getSubRows?: never;
  state?: IdentityFreeDataTableState;
  defaultState?: IdentityFreeDataTableState;
};

type IdentityOptions<TData> = {
  getRowId: (row: TData, index: number, parent?: Row<TData>) => string;
};

type DataTableOptions<TData> =
  | (DataTableBaseOptions<TData> & IdentityFreeOptions<TData>)
  | (DataTableBaseOptions<TData> & IdentityOptions<TData>);
```

`IdentityFreeDataTableState` omits selection, detail-expanded, tree-expanded,
and current-row slices. The identity-bearing branch is selected when any of
`selection`, `detailExpansion`, `tree`/`getSubRows`, **`rowInteraction.current`
specifically** — not `rowInteraction` as a whole; `onClick`/`onHover`/
`onActivate` hand over the row object and need no identity — `actions`,
`server`, an identity-bearing state slice, or an imperative row-targeting
action is present. Column-only persistence does not require row identity;
opting row state into persistence does.

_Correction, found during F5's implementation of this rule._ An earlier
revision of this section listed `rowInteraction` wholesale as identity-bearing.
That was over-broad: it would have forced every DataGrid with nothing but a
row-click handler to supply `getRowId` permanently, for a feature that never
needed row identity. Only `current` tracks a row by ID; the other members do
not, and this refines the identity rule above rather than weakening it.

The deprecated DataTable/DataGrid overload remains source-compatible for one
minor line and may omit `getRowId`. It uses the current index fallback only for
identity-free use. Enabling a legacy identity feature without `getRowId` emits a
development warning and is documented as non-reserving; the new grouped API
does not compile in that shape. The spec therefore declares `row-id` as
**conditionally required**, not simply optional or required.

### 3.2 State model

`DataTableState` has distinct slices:

- sorting, column filters, global filter;
- column visibility, order, sizing, and pinning;
- row selection;
- **detail-expanded row IDs**;
- **tree-expanded row IDs**;
- grouping;
- pagination;
- current row ID.

Detail and tree expansion never share an ID namespace, state key, callback, or
reset action:

```ts
interface NeutralDataTableState<RowId extends string = string> {
  detailExpanded: ReadonlySet<RowId>;
  treeExpanded: ReadonlySet<RowId>;
  // other framework-neutral slices omitted here
}
```

Lazy-tree request state is separate runtime metadata keyed by row ID:
`idle | loading(requestKey) | loaded | error(error, requestKey)`. It is not
stored in either expansion slice.

Controlled/uncontrolled rules:

1. A slice present in `state` is controlled. A requested change emits callbacks
   but is not committed internally.
2. A slice absent from `state` is uncontrolled and initializes once from
   `defaultState`.
3. The same slice in both is invalid in development; controlled state wins in
   production.
4. Data replacement reconciles identity slices by `row-id`. Selection follows
   its explicit reserve policy; detail/tree/current state prunes missing IDs
   unless their feature explicitly opts into reservation for unloaded server
   rows.
5. Disabling a feature removes its model and controls but does not erase a
   controlled slice. Explicit reset actions clear state.

### 3.3 Change event and callback scheme

All state callbacks use one enriched event, rather than mixing raw values,
updaters, and generic change notifications:

```ts
interface DataTableChangeEvent<
  Slice extends DataTableSlice,
  Value,
  RowId extends string = string,
> {
  slice: Slice;
  value: Value;
  cause:
    'pointer' | 'keyboard' | 'api' | 'data-reconcile' | 'restore' | 'reset';
  state: DataTableState<RowId>;
  query: DataTableQuery;
  requestKey: string;
}
```

The slice callback and `onStateChange` receive the same event object.
`onStateChange` is called once per committed or requested atomic transition.
The event contains the resolved value, complete next state, complete next query,
and deterministic request key. No callback must read a possibly stale closure
to form a server request.

Detail expansion uses `onDetailExpansionChange`; tree expansion uses
`onTreeExpansionChange`; lazy loading uses `onTreeLoad` and `onTreeLoadState`.
There is no ambiguous `onExpandedChange`.

### 3.4 Query and deterministic request identity

```ts
interface DataTableQuery {
  version: 1;
  sorting: readonly SortDescriptor[];
  filters: readonly FilterDescriptor[];
  globalFilter?: SerializableValue;
  grouping: readonly string[];
  pagination: { pageIndex: number; pageSize: number };
  requestKey: string;
}

interface DataTableQueryChangeEvent {
  previousQuery: DataTableQuery;
  query: DataTableQuery;
  cause: DataTableChangeEvent<DataTableSlice, unknown>['cause'];
  requestKey: string; // exactly query.requestKey
}
```

`requestKey` is the canonical JSON serialization of the other query members:
object keys are lexicographically sorted, descriptor arrays preserve declared
priority, undefined members are omitted, and non-serializable values are
invalid. The string itself is the key; adapters may hash it for transport but
must preserve equality. A sort/filter/group change resets `pageIndex` to zero
in the same atomic event, so only the post-reset request key is emitted.

The caller owns fetch cancellation. Results carry the originating
`requestKey`; an adapter ignores a result whose key is not the latest requested
key unless the caller deliberately supports out-of-order cache hydration.

### 3.5 Row-model pipeline

The client pipeline is deterministic:

```text
core/tree relationships -> filter -> group roots -> sort -> tree expand
-> paginate -> virtual presentation
```

- A disabled stage is an identity transform.
- A manual stage consumes caller-supplied processed rows and does not install
  the corresponding client model.
- Without pagination, no pagination model is installed and all processed rows
  render.
- Virtualization is a renderer over the final rows; it never changes counts or
  state.
- Pagination plus virtualization virtualizes the current page. Dataset-wide
  virtualization requires pagination off.
- Grouping and tree are supported together: grouping classifies **root rows**
  only; each root retains its descendant tree. Descendants are not independently
  regrouped. Group selection includes eligible descendant data rows according
  to selection scope. Other grouping/tree interpretations are invalid.
- **Tree descendants consume pagination slots.** An expanded tree descendant is
  a real record: it enters the row model at the `tree expand` stage, before
  `paginate` runs. A `pageSize` of 25 therefore holds 25 root-plus-descendant
  rows, not 25 roots — a deep tree on a small page size can show few or no
  siblings below the fold. Decided; see ADR-0001
  (`.ai/plans/adr/ADR-0001-expansion-domain-row-model-ownership.md`), OQ-2.
- **Detail-row projection is not a row-model stage.** A detail row is a
  view-layer presentation of a record already on the page: it is appended
  after `paginate` runs, never enters `getRowModel().rows`, `flatRows`, or
  `rowsById`, and never consumes a pagination slot. A `pageSize` of 25 means
  25 records regardless of how many of them have an open detail row. This
  corrects an earlier revision of this section, which placed detail-row
  projection _before_ `paginate` in the pipeline text above; that ordering was
  never implemented, and TanStack's native expand/collapse row model —
  `getExpandedRowModel()` — is subrow-visibility machinery with no detail-row
  concept at all, so there was never a row-model stage for it to occupy.
  Decided; see ADR-0001, "Decided: OQ-1", for the full reasoning. Unlike tree
  descendants above, a detail row is never a record in its own right, so the
  two stages resolve the same "does it consume a page slot" question
  oppositely for a principled reason: one claimant is data, the other is
  presentation of data already accounted for.
- Detail projection is independent of tree expansion. A row may have a tree
  expander, a detail expander, both, or neither.

### 3.6 Manual/server modes

DataTable can independently make sorting, filtering, grouping, and pagination
manual. Manual pagination requires either a known `rowCount`/`pageCount` or
explicit `hasNextPage` and `hasPreviousPage`.

DataGrid exposes one coherent all-manual `server` config:

```ts
type ServerSelection<RowId extends string> =
  | { mode: 'explicit'; ids: ReadonlySet<RowId> }
  | {
      mode: 'all-results';
      queryRequestKey: string;
      excludedIds: ReadonlySet<RowId>;
      token: string;
    };

interface DataGridServerConfig<RowId extends string> {
  query: DataTableQuery;
  rowCount?: number;
  pageCount?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  selection?: ServerSelection<RowId>;
  onQueryChange(event: DataTableQueryChangeEvent): void;
  onSelectionChange?(event: ServerSelectionChangeEvent<RowId>): void;
}

interface ServerSelectionChangeEvent<RowId extends string> {
  previous: ServerSelection<RowId> | undefined;
  selection: ServerSelection<RowId> | undefined;
  cause: DataTableChangeEvent<'selection', unknown>['cause'];
  query: DataTableQuery;
  requestKey: string;
}
```

An all-results selection token is application-issued and scoped to the exact
`queryRequestKey`. DataGrid never invents it from loaded rows. Toggling one row
in all-results mode emits a requested token with that ID added/removed from
`excludedIds`; the controlled `server.selection` remains authoritative.
Changing the query invalidates an all-results token unless the application
returns a token scoped to the new request key.

Data states are `loading | loaded | empty | error`. DataGrid does not infer
empty during loading and never treats an error as empty.

## 4. React adapter architecture

### 4.1 Shared controller and render composition

```tsx
const table = useDataTable({
  columns,
  data,
  getRowId: (row) => row.id,
  defaultState: { pagination: { pageIndex: 0, pageSize: 25 } },
  pagination: {},
});

<DataTableRoot table={table}>
  <DataTableView
    renderHeader={(context) => customHeader(context)}
    renderCell={(context) => customCell(context)}
  />
</DataTableRoot>;
```

- `useDataTable(options)` creates the only TanStack instance.
- `DataTableRoot` provides it.
- `DataTableView` renders through Table.
- DataTable exposes controller selectors/actions and typed render contexts for
  header, cell, row, detail, group, tree, footer, and state projection. It does
  not expose ready-made toolbar, filter, selection, menu, pagination,
  dialog/popover/tooltip, or data-state product controls.
- `DataTable` remains a table-view convenience entry during migration and uses
  the same controller internally. “View” means TanStack rows projected through
  Table, not a batteries-included records-screen component.
- `DataTableInstance<TData>` is TanStack `Table<TData>` plus only
  library-specific current-row, detail-expansion, lazy-tree, persistence, query,
  and announcement metadata/actions.
- DataGrid creates that controller and is the only library layer that composes
  the controller with UIKit primitives into standard feature UI.

The React adapter maps neutral descriptors to TanStack `ColumnDef`, row/state
types, row models, and updater functions. TanStack types belong in React docs
and `adapters.react`, not in the framework-neutral contract.

DataTable has two separate top-level React-only extension inputs:
`engineOptions` for non-owned TanStack options and `plugins` for custom table
features. They are siblings of the normal DataTable options; plugins are not
nested inside `engineOptions`:

```ts
type DataTableSafeEngineOptionKey =
  | 'debugAll'
  | 'debugCells'
  | 'debugColumns'
  | 'debugHeaders'
  | 'debugRows'
  | 'debugTable'
  | 'renderFallbackValue';

type DataTableEngineOptions<TData> = Partial<
  Pick<TableOptions<TData>, DataTableSafeEngineOptionKey>
>;

type TanStackOptionClassification =
  'safe-diagnostic' | 'safe-render-fallback' | 'rejected-library-contract';

const TANSTACK_TABLE_OPTION_CLASSIFICATION = {
  // Every keyof TableOptions<UnknownRow> from installed TanStack v8.21.3 is
  // listed in the implementation. Only the seven keys above use a `safe-*`
  // value; all behavior/state/callback/row-model/faceting/policy keys are
  // `rejected-library-contract`.
} as const satisfies Record<
  keyof TableOptions<UnknownRow>,
  TanStackOptionClassification
>;

type ClassifiedSafeEngineOptionKey = {
  [
    Key in keyof typeof TANSTACK_TABLE_OPTION_CLASSIFICATION
  ]: (typeof TANSTACK_TABLE_OPTION_CLASSIFICATION)[Key] extends `safe-${string}`
    ? Key
    : never;
}[keyof typeof TANSTACK_TABLE_OPTION_CLASSIFICATION];

type _SafeEngineOptionsAreExhaustive = Expect<
  Equal<ClassifiedSafeEngineOptionKey, DataTableSafeEngineOptionKey>
>;

interface DataTableEnginePluginManifest<Id extends string> {
  options: readonly `${Id}.options.${string}`[];
  state: readonly `${Id}.state.${string}`[];
  callbacks: readonly `${Id}.callbacks.${string}`[];
  rowModels: readonly `${Id}.rowModels.${string}`[];
  actions: readonly `${Id}.actions.${string}`[];
  metadata: readonly `${Id}.metadata.${string}`[];
}

interface DataTableEnginePlugin<TData, Id extends string = string> {
  id: Id;
  actionNamespace: `${Id}.actions`;
  metadataNamespace: `${Id}.metadata`;
  manifest: DataTableEnginePluginManifest<Id>;
  setup(registrar: DataTablePluginRegistrar<TData>): void;
}

interface DataTablePluginRegistrar<TData> {
  option(localName: string, factory: PluginOptionFactory<TData>): void;
  state(localName: string, factory: PluginStateFactory<TData>): void;
  callback(localName: string, factory: PluginCallbackFactory<TData>): void;
  rowModel(localName: string, factory: PluginRowModelFactory<TData>): void;
  action(localName: string, factory: PluginActionFactory<TData>): void;
  metadata(localName: string, factory: PluginMetadataFactory<TData>): void;
  hook(
    phase: 'createTable' | 'createHeader' | 'createRow' | 'createCell',
    hook: DataTablePluginHook<TData>
  ): void;
}

type DataTableReactExtensions<TData> = {
  engineOptions?: DataTableEngineOptions<TData>;
  plugins?: readonly DataTableEnginePlugin<TData>[];
};

type ReactDataTableOptions<TData> = DataTableOptions<TData> &
  DataTableReactExtensions<TData>;
```

Example:

```ts
const auditPlugin = {
  id: 'audit',
  actionNamespace: 'audit.actions',
  metadataNamespace: 'audit.metadata',
  manifest: {
    options: [],
    state: [],
    callbacks: [],
    rowModels: [],
    actions: ['audit.actions.refresh'],
    metadata: ['audit.metadata.status'],
  },
  setup(registrar) {
    registrar.action('refresh', createRefreshAction);
    registrar.metadata('status', createStatusMetadata);
  },
} satisfies DataTableEnginePlugin<AuditRow>;

useDataTable({
  columns,
  data,
  engineOptions: { debugTable: true },
  plugins: [auditPlugin],
});
```

The seven-key `Pick` is the complete public engine allowlist verified against
the installed TanStack v8.21.3 declarations. Runtime normalization uses the same
seven-key constant and rejects every other own key before constructing the
TanStack instance. All behavior, state, callbacks, identity, row models,
faceting, feature registration, option merging, and policy stay in DataTable
configs or the validated adapter plugin surface. In particular, `_features`,
`mergeOptions`, and `meta` are rejected; the escape hatch never admits a raw
feature-registration path.

The implementation commits the complete
`TANSTACK_TABLE_OPTION_CLASSIFICATION` object, not the abbreviated comment
shown above. Its `satisfies Record<keyof TableOptions<UnknownRow>, ...>` check
fails when TanStack adds or removes a key. The
`_SafeEngineOptionsAreExhaustive` assertion fails when a classified safe key and
the seven-key public union differ. A dependency update cannot compile until
every changed upstream key is explicitly classified and the public allowlist is
deliberately reviewed.

`DataTableEnginePlugin` is an analyzable descriptor, not a raw TanStack
`TableFeature`. Its preflight is deterministic:

1. `id`, `actionNamespace`, and `metadataNamespace` are required.
   `actionNamespace` must equal `${id}.actions`; `metadataNamespace` must equal
   `${id}.metadata`.
2. Plugin IDs and both namespaces must be unique and must not use a
   library-reserved prefix.
3. The six manifest arrays are the complete added surface. Every entry is a
   fully qualified adapter key under `${id}.<surface>.*`; bare keys and TanStack
   `TableOptions` keys are invalid. Keys must be unique within the plugin,
   disjoint from every library-owned/forbidden key, and disjoint from every
   other plugin's manifest.
4. Only after all descriptors pass those checks does the adapter call `setup`
   against a recording registrar. The exact registered option/state/callback/
   row-model/action/metadata key sets must equal the manifest sets: an
   undeclared key or a declared-but-unregistered key rejects the plugin.
5. The registrar exposes no raw `TableFeature`, table-options object, state
   object, controller, or mutation handle. Registration factories and lifecycle
   hooks receive read-only adapter contexts. Hooks may return/register only the
   declared surface; actions and metadata are attached only under their
   namespaces. Hooks cannot replace options, state containers, callbacks,
   controller methods, query events, pipeline stages, identity, focus/
   accessibility behavior, or another hook.
6. The adapter records the properties produced by every lifecycle hook and
   rejects any undeclared or unnamespaced runtime property before exposing the
   table/row/header/cell. Synchronous mutation of a read-only context also
   rejects the plugin. Factories may close over application services, but
   registration itself is synchronous and deterministic.
7. After successful preflight and registrar validation, the adapter alone
   derives the internal raw TanStack `TableFeature` entries and supplies the
   owned `_features` option.

Registrar methods accept a local name, qualify it into the corresponding
`${id}.<surface>.<name>` key, and compare that key with the manifest. Plugin
`option` values live in a private adapter extension registry captured by the
derived feature and exposed to that plugin's factories/hooks through a
read-only, plugin-scoped view. They are never spread or merged into TanStack
`TableOptions`. Plugin state, callbacks, row models, actions, and metadata use
the same registry rule; they can add a namespaced extension surface but cannot
replace or insert a stage into the canonical DataTable pipeline. A configurable
plugin is created with its application options already closed over, for example
`createAuditPlugin({ endpoint })`; DataTable does not add a third arbitrary
options bag.

Any owned-field, state, callback, row-model, identity, manual-flag,
feature-registration, duplicate, manifest, namespace, hook, or runtime-surface
collision throws a descriptive error in every environment before the conflicting
surface becomes observable; there is no production ignore/fallback path. The
rejected value is never applied, so the library-owned contract remains
authoritative.

DataGrid exposes neither `engineOptions` nor `plugins` and does not forward
them. Consumers that need an advanced TanStack option or custom feature plugin
must use custom DataTable composition.

### 4.2 Table primitive

Keep `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`,
`TableCell`, and `TableCaption`.

Table may add:

- `TableRow`: presentational `selected`, `current`, `expanded` plus native
  ARIA/data attributes;
- `TableHead`: sort direction/priority and native `scope`;
- scroll-container ref/class/size props used by sticky/virtual rendering.

Table does not gain rows, columns, filtering, selection, pagination,
virtualization, persistence, or server state.

### 4.3 Capability and UI ownership

“Model” below means DataTable state, TanStack plugin/row-model integration,
selectors, commands, metadata, and render-context values. It never implies
ready-made product chrome.

| Capability                                               | Table                                                                         | DataTable                                                                                              | DataGrid composed UI                                                                                                | Required UIKit reuse                                                                  |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Table layout, density, borders, sticky/overflow surfaces | Native elements, slots, visual variants, refs, semantic attributes            | Projects engine header/row/cell models into Table                                                      | Chooses config defaults                                                                                             | `Table`; `ScrollArea` where a bounded grid needs it                                   |
| Sorting                                                  | Presents sort direction/priority passed to it                                 | Sort state, row model, manual mode, commands, header render context                                    | Standard sortable header affordance and multi-sort priority UI                                                      | `Button`/`ButtonIcon`, `Tooltip` when explanatory copy is needed                      |
| Toolbar and search                                       | No                                                                            | Global-filter state/actions only                                                                       | Owns complete standard toolbar, search, leading/trailing actions                                                    | `Toolbar`, `InputSearch`, `Button`, `ButtonGroup`                                     |
| Column filter controls                                   | No                                                                            | Filter state, operator registry/plugin hooks, commands, query descriptors                              | Owns field/operator controls, applied-filter chips, reset UI                                                        | `Filter`, `Input*`, `Select`/`Combobox`, `Chip`, `Popover`                            |
| Pagination UI                                            | No                                                                            | Pagination state/actions, page/row counts, manual/unknown-total capabilities                           | Owns page navigation, page-size chooser, counts and unknown-total treatment                                         | `Pagination`, `Select` or `Combobox`, `Button`                                        |
| Selection controls                                       | Presents `selected`/ARIA state supplied to rows                               | Selection model, eligibility, cascade/range/select-all calculations and toggle actions                 | Owns row/header checkboxes, mixed/disabled states and selection count                                               | `Checkbox`, `Tooltip`                                                                 |
| Bulk actions                                             | No                                                                            | Selected-row selectors and action dispatch inputs only                                                 | Owns bulk-action bar, buttons, overflow and confirmation flow                                                       | `Toolbar`, `Button`, `ButtonMenu`/`DropdownMenu`, `ConfirmDialog`                     |
| Row actions and menus                                    | Presents cell/row slots only                                                  | Action metadata, row identity and event-isolation helpers                                              | Owns action cells, menus and disabled/destructive treatment                                                         | `ButtonIconMenu`, `DropdownMenu`, `ConfirmDialog`                                     |
| Empty/loading/error/append                               | State/footer rows may span columns and carry supplied content                 | Status metadata, row projection rules, retry/append action intents; no branded illustration or control | Owns skeleton/overlay/spinner, empty message, error/retry and append presentation                                   | `Skeleton`, `Spinner`, `Empty`, `Alert`, `Button`                                     |
| Dialogs, popovers and tooltips                           | Native title/description hooks and structural slots only                      | Anchor/overflow/action metadata and open-state hooks only when state affects the engine                | Owns every standard overlay, trigger, focus return and dismissal policy                                             | `Dialog`/`ConfirmDialog`, `Popover`, `Tooltip`, `TruncatedText`                       |
| Detail expansion                                         | Presents expanded row and ARIA attributes supplied to it                      | Separate detail state/model/actions, IDs and render context                                            | Owns standard expander button and any configured detail chrome; caller content remains a typed renderer             | `ButtonIcon`, `Collapsible`; feature content may use other UIKit primitives           |
| Tree/group chrome                                        | Presents indent/group-row/sticky visual surfaces                              | Tree/group row models, lazy state, cascade/selectors, expand actions and accessible metadata           | Owns expanders, loading/error/retry, group controls, selection controls and labels                                  | `ButtonIcon`, `Collapsible`, `Spinner`, `Alert`, `Checkbox`, `Tooltip`                |
| Column settings                                          | Header/cell width, pin and style presentation                                 | Visibility/order/size/pin state, constraints, commands and persistence hooks                           | Owns view-options menu, drag/keyboard handles, reset and fit controls                                               | `ButtonIcon`, `DropdownMenu`/`Popover`, `Checkbox`, `Resizable`, `Tooltip`            |
| Footer/summary                                           | Footer semantics and visual cells                                             | Summary inputs/model and footer render context                                                         | Owns standard formatted summary presentation when configured                                                        | `Table` parts and typography primitives; menus/popovers only if explicitly configured |
| Accessibility helpers                                    | Native table semantics, scopes, caption/name plumbing, row/cell ARIA surfaces | Stable IDs, state-derived ARIA metadata, focus targets, virtual indices and announcement intents       | Owns labelled controls, live-region rendering, focus management across composed primitives and overlay focus return | Accessibility behavior of each reused primitive; no bespoke replacement controls      |

DataTable render hooks receive state and commands, not preassembled controls.
DataGrid may have internal feature components, but they are private
implementation details named and tested as DataGrid chrome. They must not be
exported as a parallel public suite of `DataTable*` product components.

## 5. DataGrid grouped API

### 5.1 Precedence and invalid combinations

Resolution order is fixed:

1. Deprecated aliases normalize into grouped configs.
2. Supplying an alias and its grouped replacement is invalid; the grouped value
   wins in production and a development error is emitted.
3. Grouped configs enable behavior and provide behavioral defaults only.
4. `defaultState` supplies initial slice values and wins over config defaults.
5. `state` controls slice values and wins over `defaultState`.
6. `server.query` exclusively controls sorting/filter/global-filter/grouping/
   pagination. Supplying those slices in `state` or `defaultState` with
   `server` is a type error; runtime validation protects JavaScript consumers.
7. `server.selection`, when supplied, exclusively controls selection. It cannot
   coexist with `state.selection`.
8. Persistence restores only uncontrolled slices absent from `defaultState`.
9. DataGrid exposes neither React `engineOptions` nor `plugins`; advanced engine
   extension requires custom DataTable composition.

Config objects do not contain controlled/current values. Those live only in
`state`, `defaultState`, or `server`, preventing two sources of truth.

Chrome ownership is a separate top-level discriminated field:

```ts
type DataGridChrome<TData> =
  | { mode?: 'built-in' }
  | {
      mode: 'external';
      render(context: DataGridChromeContext<TData>): Content;
    };
```

`chrome` defaults to `{ mode: 'built-in' }`. Built-in mode renders the configured
toolbar and pagination controls. External mode retains their engine state but
suppresses those built-in controls and calls `render` with the shared controller
plus typed DataGrid state/actions and render contexts. It does not expose a
second suite of ready-made DataTable companion controls. `toolbar` is invalid
in external mode because the renderer owns toolbar composition. Empty/loading/
error rows and table footer summaries remain body/table content and are not
suppressed. Direct DataTable composition needs no chrome flag because DataTable
never renders standard screen chrome automatically.

### 5.2 Concrete config types and defaults

The sixteen behavior groups are `selection`, `sorting`, `filters`, `pagination`,
`detailExpansion`, `tree`, `grouping`, `virtualization`, `columnsFeatures`,
`persistence`, `toolbar`, `actions`, `appearance`, `dataState`, `footer`, and
`rowInteraction`. The first twelve use `false | Config`; omitted has the same
meaning as `false`. The last four have inert safe defaults. `presets`,
`callbacks`, `state`, `defaultState`, and `server` are top-level normalization
or ownership inputs, not additional behavior groups.

| Config            | Members                                                                                                                                                                                                          | Defaults / invalid combinations                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `selection`       | `mode: 'single' \| 'multiple'`; `selectAll: 'page' \| 'loaded' \| 'all-results'`; `showSelectAll`; `reserve`; `range`; `selectByRow`; `selectAllOnIndeterminate`; `treeCascade`; `groupScope`; `isRowSelectable` | mode `multiple`, page when paginated/loaded otherwise, select-all shown, other flags false (select-by-row and select-all-on-indeterminate off). `all-results` requires `server.selection`. |
| `sorting`         | `mode: 'single' \| 'multiple'`; `cycle`; `maxColumns`                                                                                                                                                            | single; `asc,desc,none`; no max. Multi priority follows descriptor order.                                                                                                                  |
| `filters`         | `global?: { columnIds?; placeholder? }`; `columns: FilterDefinition[]`; `logic: 'and'`                                                                                                                           | no global; empty columns; AND only; per-column `facet` opt-in supplies option/range sources. Non-serializable server operators invalid.                                                    |
| `pagination`      | `pageSizeOptions`; `showPageSize`; `showFirstLast`; `unknownTotal`                                                                                                                                               | `[10,20,30,40,50]`, true, true, false. Unknown total requires server next/previous and hides first/last.                                                                                   |
| `detailExpansion` | `render`; `isExpandable?`; `mode: 'multiple' \| 'accordion'`; `reserve`                                                                                                                                          | multiple, false. Required render. Separate from tree.                                                                                                                                      |
| `tree`            | `getChildren`; `loadChildren?`; `indent`; `renderLoadError?`                                                                                                                                                     | 20px. `loadChildren` requires stable IDs; duplicate child IDs invalid.                                                                                                                     |
| `grouping`        | `allowedColumns`; `renderGroup?`; `collapsible`; `sticky`; `selectionScope`; `ungrouped`                                                                                                                         | collapsible true, sticky false, leaf-descendants; `ungrouped: {show:true,name:'Ungrouped',position:'last'}`.                                                                               |
| `virtualization`  | `estimateRowHeight`; `measure`; `overscan`; `scrollToIndex?`                                                                                                                                                     | 40px, fixed, 8. Requires bounded height/maxHeight.                                                                                                                                         |
| `columnsFeatures` | `visibility`; `pinning`; `resizing`; `reordering`; `fit`; `overflowTooltip`; `lockSystemColumns`                                                                                                                 | visibility true; all others false except lock true. `fit` requires a bounded width.                                                                                                        |
| `persistence`     | `key`; `version`; `storage`; `include`; `migrate?`; `onError?`                                                                                                                                                   | include column visibility/order/width/pinning only. Key/version/storage required. Controlled slices excluded.                                                                              |
| `toolbar`         | `globalSearch`; `columnFilters`; `viewOptions`; `bulkActions`; `leading?`; `trailing?`                                                                                                                           | false, false, true, empty. No implicit external toolbar. Bulk actions require multiple selection.                                                                                          |
| `actions`         | `items`; `render?`; `placement: 'start' \| 'end'`; `onAction`                                                                                                                                                    | end. IDs unique; action controls stop row propagation.                                                                                                                                     |
| `appearance`      | `striped`; `size`; `width`; `height`; `maxHeight`; `background`; `showHeader`; `stickyHeader`; `borders`; row/cell/header class and style callbacks                                                              | false, transparent, medium, auto width, no height bounds, header shown, sticky false, all borders false, callbacks undefined.                                                              |
| `dataState`       | `status`; `loadingMode`; `skeletonRows`; `empty`; `error`; `append`                                                                                                                                              | loaded, skeleton, 5, “No results.”, no error, append idle. Append error/retry is proposed behavior.                                                                                        |
| `footer`          | `summaries`; `render?`; `sticky`                                                                                                                                                                                 | none, not sticky. Renderer and summaries are mutually exclusive.                                                                                                                           |
| `rowInteraction`  | `current`; `activateOn`; `tooltip`; row hover/click/activate/scroll callbacks                                                                                                                                    | current false, activate on Enter, tooltip/callbacks undefined. Cell events live on column metadata.                                                                                        |

The member types are fixed by these neutral pseudo-types; an adapter substitutes
its UI-node and style-object types without changing state or callback meaning:

```ts
type RowId = string;
type ClassValue = string | undefined;
type StyleValue = Readonly<Record<string, string | number>>;
type Content = FrameworkNode;

interface SelectionConfig<TData> {
  mode?: 'single' | 'multiple';
  selectAll?: 'page' | 'loaded' | 'all-results';
  showSelectAll?: boolean;
  reserve?: boolean;
  range?: boolean;
  // Shipped legacy parity: legacy `selectByRow`. A body-row click toggles
  // selection (the checkbox remains the accessible primary control); action
  // and activation controls still isolate propagation.
  selectByRow?: boolean;
  // Shipped legacy parity: legacy `selectOnIndeterminate`. When the header
  // control is indeterminate, activating it selects all eligible rows (true)
  // rather than clearing them (false).
  selectAllOnIndeterminate?: boolean;
  treeCascade?: 'none' | 'descendants' | 'both';
  groupScope?: 'visible-leaves' | 'all-loaded-leaves';
  isRowSelectable?: (row: TData) => boolean;
}

interface SortingConfig {
  mode?: 'single' | 'multiple';
  cycle?: readonly ('asc' | 'desc' | 'none')[];
  maxColumns?: number;
}

type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'in'
  | 'isEmpty'
  | 'isNotEmpty';

interface FilterDefinition {
  columnId: string;
  operators: readonly FilterOperator[];
  // Shipped legacy parity: legacy `filterStats`. The option source for
  // set-membership controls. `'unique'` asks DataTable to expose the distinct
  // faceted values (and counts) for the column from the pre-filter row model;
  // `'min-max'` exposes the numeric range; an explicit list supplies fixed
  // options. DataGrid renders the resulting option list/chips.
  facet?: 'unique' | 'min-max' | readonly SerializableValue[];
}

interface FiltersConfig {
  // `columnIds` is case-insensitive substring match, OR'd across the listed
  // columns: a row matches if the query is a substring of any listed
  // column's rendered value in any listed column. The escape hatch for a
  // column whose match semantics need to differ is a per-column matcher
  // (`globalFilterFn`) on that column's metadata, alongside its comparator
  // and filter-operator customization (§5.2 concrete callbacks). The query
  // descriptor stays `{ q, columnIds }` — serializable, so `server.query`
  // (§3.6) round-trips it unchanged; a `match` function on the config itself
  // was rejected for the client/server asymmetry it would force.
  global?: { columnIds?: readonly string[]; placeholder?: string };
  columns?: readonly FilterDefinition[];
  logic?: 'and';
}

interface PaginationConfig {
  pageSizeOptions?: readonly number[];
  showPageSize?: boolean;
  showFirstLast?: boolean;
  unknownTotal?: boolean;
}

interface DetailExpansionConfig<TData> {
  render(row: TData): Content;
  isExpandable?: (row: TData) => boolean;
  mode?: 'multiple' | 'accordion';
  reserve?: boolean;
}

interface TreeConfig<TData> {
  getChildren(row: TData): readonly TData[] | undefined;
  loadChildren?: (row: TData, requestKey: string) => Promise<readonly TData[]>;
  indent?: number;
  renderLoadError?: (row: TData, retry: () => void) => Content;
}

interface GroupingConfig<TData> {
  allowedColumns: readonly string[];
  renderGroup?: (group: GroupContext<TData>) => Content;
  collapsible?: boolean;
  sticky?: boolean;
  selectionScope?: 'visible-leaves' | 'all-loaded-leaves';
  ungrouped?: { show?: boolean; name?: string; position?: 'first' | 'last' };
}

interface VirtualizationConfig {
  estimateRowHeight?: number | ((rowIndex: number) => number);
  measure?: 'fixed' | 'dynamic';
  overscan?: number;
  scrollToIndex?: number;
}

interface ColumnsFeaturesConfig {
  visibility?: boolean;
  pinning?: boolean;
  resizing?: boolean;
  reordering?: boolean;
  fit?: 'content' | 'container' | false;
  overflowTooltip?: boolean;
  lockSystemColumns?: boolean;
}

interface ToolbarConfig<TData> {
  globalSearch?: boolean;
  columnFilters?: boolean;
  viewOptions?: boolean;
  bulkActions?: readonly BulkAction<TData>[];
  leading?: Content;
  trailing?: Content;
}

type ActionsConfig<TData> = (
  | { items: readonly RowAction<TData>[]; render?: never }
  | { items?: never; render: (row: TData) => Content }
) & {
  placement?: 'start' | 'end';
  onAction(actionId: string, row: TData): void;
};

interface AppearanceConfig<TData> {
  striped?: boolean;
  // Shipped legacy parity: legacy `backgroundColor`
  // (transparent | solid-brand-accent | solid-brand-lightest | fixed-white)
  // normalizes to these neutral, token-resolved surface variants.
  background?: 'transparent' | 'accent' | 'subtle' | 'surface';
  size?: 'small' | 'medium' | 'large';
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  // Shipped legacy parity: legacy `showHeader`. Hides the header row while
  // keeping column model and native semantics for the body.
  showHeader?: boolean;
  stickyHeader?: boolean;
  borders?: Partial<BorderConfig>;
  rowClassName?: (row: RowContext<TData>) => ClassValue;
  rowStyle?: (row: RowContext<TData>) => StyleValue;
  cellClassName?: (cell: CellContext<TData>) => ClassValue;
  cellStyle?: (cell: CellContext<TData>) => StyleValue;
  headerClassName?: (header: HeaderContext) => ClassValue;
  headerStyle?: (header: HeaderContext) => StyleValue;
}

type DataStateConfig =
  | { status?: 'loaded'; append?: AppendState }
  | {
      status: 'loading';
      loadingMode?: 'skeleton' | 'overlay';
      skeletonRows?: number;
    }
  | { status: 'empty'; empty?: Content }
  | { status: 'error'; error: Content };

type FooterConfig<TData> =
  | {
      summaries?: readonly SummaryDefinition<TData>[];
      render?: never;
      sticky?: boolean;
    }
  | {
      summaries?: never;
      render: (rows: readonly TData[]) => Content;
      sticky?: boolean;
    };

interface RowInteractionConfig<TData> {
  current?: boolean;
  activateOn?: 'enter' | 'double-click' | 'both';
  tooltip?: (row: TData) => Content;
  onHover?: (event: RowPointerEvent<TData, RowId>) => void;
  onClick?: (event: RowPointerEvent<TData, RowId>) => void;
  onActivate?: (event: RowActivationEvent<TData, RowId>) => void;
  onScroll?: (event: DataGridScrollEvent) => void;
}
```

`PersistenceConfig` is defined in section 8, concrete callbacks in section 5.3,
and presets have the following exact normalization shape:

```ts
interface DataGridPreset {
  id: string;
  config: Readonly<Partial<DataGridGroupedConfig>>;
}

interface DataGridPresetsInput<TData> {
  definitions: readonly DataGridPreset[];
  apply: readonly string[];
  detect?: (input: {
    columns: readonly NeutralColumnDefinition<TData>[];
    rows: readonly TData[];
  }) => readonly string[];
}
```

A preset cannot contain `state`, `defaultState`, `server`, row data, or
callbacks.

Invalid combinations are type errors and development runtime errors:

- server query slices with the same `state`/`defaultState` slices;
- server selection with `state.selection`;
- `all-results` without an application-issued server token;
- `pagination.unknownTotal=true` outside server mode, without both directional
  capabilities, with `rowCount`/`pageCount`, or with `showFirstLast=true`;
- range selection in single mode;
- bulk actions without multiple selection;
- lazy tree, identity-bearing actions, or `rowInteraction.current` without
  `row-id`;
- virtualization without `height` or `maxHeight`;
- container fit without a bounded width;
- footer summaries together with a custom footer renderer;
- action items together with a custom actions renderer;
- `chrome.mode='external'` with `toolbar`; the renderer owns toolbar
  composition. Pagination state remains enabled, but no built-in controls
  render;
- non-serializable filter/sort/group descriptors in server mode.

Supporting shapes:

```ts
type BorderStyle = 'subtle' | 'default' | 'strong';
type BorderValue = boolean | BorderStyle;
interface BorderConfig {
  top: BorderValue;
  bottom: BorderValue;
  horizontal: BorderValue;
  vertical: BorderValue;
}

type AppendState =
  | { status: 'idle' }
  | { status: 'loading'; label?: string }
  | { status: 'error'; message: string; onRetry: () => void };
```

Border dimensions are independent; `bordered` maps to horizontal+vertical
during migration.

- Row tooltip receives row context; cell overflow tooltip receives cell context.
- Column metadata owns cell `onHover`, `onClick`, class, style, tooltip, icons,
  comparator, filter operator, a global-search matcher (`globalFilterFn`,
  §5.2 `FiltersConfig`), min/max/initial size, and pin/reorder permissions.
- Footer accepts serializable summary definitions or a typed renderer.
- Initial error and append error are distinct.
- Preset resolution is left-to-right, then explicit grouped configs win.
  Duplicate preset writes are allowed only when later-wins is documented by the
  preset. `detect` runs once from columns/data capabilities and returns preset
  IDs; it cannot observe mutable state.

### 5.3 Concrete callbacks

DataGrid exposes named callbacks needed by screens:

```ts
interface DataGridCallbacks<TData, RowId extends string> {
  onStateChange?(event: DataTableChangeEvent<DataTableSlice, unknown>): void;
  onQueryChange?(event: DataTableQueryChangeEvent): void;
  onSelectionChange?(event: SelectionChangeEvent<RowId>): void;
  onCurrentRowChange?(event: CurrentRowChangeEvent<RowId>): void;
  onRowHover?(event: RowPointerEvent<TData, RowId>): void;
  onRowClick?(event: RowPointerEvent<TData, RowId>): void;
  onRowActivate?(event: RowActivationEvent<TData, RowId>): void;
  onCellHover?(event: CellPointerEvent<TData, RowId>): void;
  onCellClick?(event: CellPointerEvent<TData, RowId>): void;
  onDetailExpansionChange?(event: DetailExpansionChangeEvent<RowId>): void;
  onTreeExpansionChange?(event: TreeExpansionChangeEvent<RowId>): void;
  onTreeLoad?(event: TreeLoadEvent<TData, RowId>): void;
  onGroupingChange?(event: GroupingChangeEvent): void;
  onColumnStateChange?(event: ColumnStateChangeEvent): void;
  onPaginationChange?(event: PaginationChangeEvent): void;
  onScroll?(event: DataGridScrollEvent): void;
  onRowAction?(event: RowActionEvent<TData, RowId>): void;
  onDataStateAction?(event: { action: 'retry' | 'append-retry' }): void;
}
```

`server.onQueryChange` is authoritative in server mode; top-level
`callbacks.onQueryChange` observes the same event after it and must not start a
second request.

## 6. Feature interactions

1. Header select-all defaults to the processed page when paginated and all
   processed loaded rows otherwise. Server all-results requires its controlled
   token.
2. Reserved selection retains absent IDs; non-reserved selection prunes on data
   replacement. Disabled rows are skipped.
3. Shift selects the contiguous visible processed range from the last anchor,
   skips disabled rows, and stops at an unloaded server-page boundary. Ctrl/Cmd
   toggles one row.
4. Tree selection is row-local unless cascade is enabled. Lazy children are not
   implicitly selected unless the controlled cascade policy says so.
5. Group selection targets eligible descendant data rows. Synthetic group rows
   are never record IDs.
6. Root rows are grouped; each grouped root retains its descendant tree.
7. Detail accordion closes the previously open detail row. It never collapses
   tree nodes.
8. Groups follow grouping descriptor order; leaf/root rows sort within groups.
   Aggregate sorting requires an explicit aggregate.
9. Pin regions win over order. Reordering stays within a pin region unless the
   action explicitly unpins. Selection/actions columns are locked by default.
10. Explicit size constraints win; fit distributes remaining width among
    flexible columns. Minimums cause horizontal scroll instead of compression.
11. Action controls stop row click/activation/selection propagation.
12. Initial loading can replace rows with skeletons. Append loading retains
    rows. Initial and append errors have separate retry actions.
13. Persistence restores after columns normalize and before interaction.
    Unknown IDs are dropped; controlled/default slices win.
14. Data/column/size container changes automatically schedule layout
    measurement. The controller's `measureLayout()` is an escape hatch for
    external font/container changes; it replaces legacy `doLayout`.
15. Immutable state updates replace legacy `triggerRerender`; no force-render
    API is exposed.

## 7. Accessibility

Native table semantics remain the default; do not switch to `role="grid"` merely
because the table is interactive.

- Every table has a caption, `aria-label`, or `aria-labelledby`.
- Simple headers use `scope="col"`; grouped headers use `colSpan` and
  `scope="colgroup"`; row-group headers use `scope="rowgroup"`.
- Sort controls are buttons. In multi-sort, the primary sorted header owns
  `aria-sort`. Every sorted header's accessible description states direction
  and priority, for example “sorted descending, priority 2”; a visible priority
  indicator conveys the same information. Unsorted buttons announce their next
  action.
- Selected records expose `aria-selected`; current row uses `aria-current`.
  Detail and tree controls have separate `aria-expanded`/`aria-controls`
  targets.
- The adapter accepts or generates a stable table ID. Addressable content uses
  `${tableId}--detail--${base64url(utf8(rowId))}` for a detail row and
  `${tableId}--tree--${base64url(utf8(rowId))}` for a child-row group. An
  expander includes `aria-controls` exactly when that target is mounted in the
  DOM; otherwise it omits the attribute. `aria-expanded` always reflects
  logical state, including while lazy content is loading.
- Select-all and row checkboxes have contextual names and mixed/disabled state.
- Current row uses roving row focus: Up/Down move one visible record, Home/End
  move to first/last visible record, and Enter activates. Interactive
  descendants remain tabbable and do not activate the row.
- Resize handles are focusable separators with min/max/current values and
  keyboard increments. Reorder offers keyboard move commands and live
  announcements.
- Lazy load, server refresh, append completion/failure, selection count, sort
  priority, and column moves use a polite live region.
- Virtual rows preserve row index/count metadata. The virtualizer pins the DOM
  row containing focus outside normal overscan. If an adapter cannot retain it
  during user scroll, DOM focus moves to the table scroll container
  (`tabIndex=-1`), logical current-row ID and last processed index remain
  unchanged, and focus is not automatically stolen when the row remounts.
  Up/Down from that container scrolls to and focuses the adjacent processed
  row. If filtering or replacement removes the focused row, focus moves to the
  row now at the same processed index, otherwise the previous last row,
  otherwise the first enabled toolbar control, otherwise the scroll container.
  Current-row state becomes that fallback row ID or `undefined`, and exactly one
  `data-reconcile` change event is emitted.
- Loading/empty/error/footer rows span visible leaf columns without breaking
  header association.

## 8. Persistence and serialization

Legacy persistence restores column widths and hidden columns. That shipped
subset is required. The versioned envelope, storage adapter, migrations,
pin/order inclusion, validation, and controlled-slice rules are new hardening:

```ts
interface DataGridPersistence {
  key: string;
  version: number;
  storage: {
    read(key: string): string | null | Promise<string | null>;
    write(key: string, value: string): void | Promise<void>;
    remove?(key: string): void | Promise<void>;
  };
  include?: readonly PersistableSlice[];
  migrate?: (stored: unknown, fromVersion: number) => PersistedGridState;
  onError?: (error: unknown) => void;
}
```

Selection, detail/tree expansion, current row, request status, and page index
are not persisted by default. Serialization excludes functions and row data.

## 9. Pattern and screen ownership

- `table-view` becomes `PageHeader` plus one DataGrid. DataGrid owns search,
  column filters/view options, empty/loading/error treatment, and pagination.
- `data-table-bulk-actions` uses DataGrid when its bulk-action config suffices.
  A specialized screen either uses DataGrid's canonical
  `chrome={{ mode: 'external', render }}` contract or one DataTable controller
  with application-owned render composition. Direct DataTable composition has
  no built-in chrome or exported standard companion suite;
  DataGrid external mode suppresses its built-in toolbar/pagination controls.
- Screen descriptors bind concrete DataGrid callbacks:
  `onQueryChange`, `onSelectionChange`, `onCurrentRowChange`, `onRowActivate`,
  `onRowAction`, `onDetailExpansionChange`, `onTreeExpansionChange`,
  `onColumnStateChange`, `onPaginationChange`, and `onDataStateAction`.
- `onStateChange` is diagnostic/general observation, not the only screen
  business-event binding.

## 10. Compatibility and migration

1. Add controller/root/view and keep `<DataTable columns data />`.
2. Move existing standard `DataTableToolbar`, `DataTableViewOptions`,
   `DataTablePagination`, and similar chrome behind DataGrid-owned internal
   components in the feature milestone that owns each control. P0.3 establishes
   only the private boundaries and frozen compatibility adapters. If source
   compatibility requires temporary exports, deprecate them as thin adapters
   with a stated major-removal target; do not add features to them or treat them
   as the target architecture.
3. Build DataGrid incrementally on the controller and existing UIKit primitives
   listed in section 4.3: filter/visibility chrome in P0.4, selection/action
   chrome in P0.5, state/pagination chrome in P0.6, and final config integration
   in P0.7. P0.7 does not rebuild earlier controls. No bespoke checkbox, menu,
   popover, tooltip, pagination, empty-state, alert, or dialog implementation is
   permitted.
4. Preserve current DataTable `skeleton`/`skeletonRows`, `striped`, `bordered`,
   and `highlightCurrentRow` behavior through one explicitly deprecated
   compatibility adapter for the first minor release containing the new
   controller. The adapter is frozen: it may translate only those current props
   and receives no new states or variants. `striped` and `bordered` project to
   Table presentation props; `highlightCurrentRow` projects DataTable's
   current-row metadata to TableRow's `current` presentation; `skeleton`
   preserves the current skeleton output internally only for compatibility.
   That exact-output adapter is the sole temporary exception to the UIKit
   primitive-reuse rule; it is frozen, deprecated, and cannot be used by
   DataGrid. New DataGrid loading UI uses the `Skeleton` primitive.
   Their destinations are:
   - standard records UI: DataGrid `appearance`, `rowInteraction.current`, and
     `dataState`;
   - custom composition: DataTable current-row state/render context plus
     DataTableView/Table presentation props, with caller-composed state content.
5. Normalize deprecated DataGrid `selectable`, `toolbar`, `pagination`,
   `searchKey`, `pageSize`, `state`, `striped`, `bordered`, and
   `highlightCurrentRow` aliases into grouped configs for that same minor line.
6. Preserve DataTable's shipped `getRowCanExpand` and `renderExpandedRow` for
   that minor line. They normalize into detail expansion:
   `getRowCanExpand` becomes `detailExpansion.isExpandable`, and
   `renderExpandedRow` becomes `detailExpansion.render`. If only one legacy prop
   is supplied, preserve today's partial behavior: expose expandability/state
   without projecting content, or supply a renderer without making additional
   rows expandable. Either legacy prop combined with `detailExpansion` is a
   development error; the grouped config wins in production.
7. A grouped config plus its alias is a development error; grouped config wins
   in production.
8. Remove the DataTable compatibility adapter, all aliases, and the two legacy
   expansion props in the next major release after that compatibility minor.
   There is never a second legacy engine. Removal does not move skeleton or
   other composed product UI into DataTable.

The false guidance that separately constructed companions control a
self-contained DataTable is replaced with controller/render-context guidance
when the shared controller lands. New documentation never recommends the
deprecated companion exports.

## 11. Complete feature disposition

| Capability                                                   | Source label                   | Disposition                                                                                                                                          | Delivery |
| ------------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Native parts, caption, header/body/footer                    | Shipped parity                 | Accepted in Table                                                                                                                                    | P0       |
| React DataTable `engineOptions` + `plugins` inputs           | React target                   | DataTable-only seven-key allowlist with exhaustive upgrade guard plus namespaced manifest/registrar plugins; all other keys/raw features rejected    | P0       |
| React DataTable skeleton/striped/bordered/current props      | React current                  | Frozen compatibility adapter (including `skeletonRows`) for one minor; migrate to DataGrid or Table/DataTable render composition; next-major removal | P0       |
| Single/custom/nested/tree-aware sort                         | Shipped parity                 | Accepted                                                                                                                                             | P0/P1    |
| Multi-sort                                                   | Proposed-only                  | Accepted with direction/priority a11y                                                                                                                | P0       |
| AND filters and shipped operators                            | Shipped parity                 | Accepted                                                                                                                                             | P0       |
| `isEmpty` / `isNotEmpty` filters                             | Proposed-only                  | Accepted                                                                                                                                             | P0       |
| Faceted filter values / distinct-value stats (`filterStats`) | Shipped parity, partial        | Accepted as DataTable per-column faceted metadata (`filters` `facet`); DataGrid renders option lists/chips/counts                                    | P0/P1    |
| Single/multiple/select-all/disabled/reserved selection       | Shipped parity                 | Accepted; stable ID required                                                                                                                         | P0       |
| Row-click selection and select-all indeterminate policy      | Shipped parity                 | Accepted in selection config (`selectByRow`, `selectAllOnIndeterminate`, `showSelectAll`)                                                            | P0       |
| Shift range and Ctrl/Cmd additive selection                  | Proposed-only                  | Accepted within loaded processed range                                                                                                               | P1       |
| Detail expansion                                             | Shipped parity                 | Accepted in separate detail state                                                                                                                    | P1       |
| React `getRowCanExpand` / `renderExpandedRow` props          | React current                  | Preserved as deprecated P0 normalizers into detail expansion; major-only removal                                                                     | P0/P1    |
| Accordion detail expansion                                   | Proposed-only                  | Accepted                                                                                                                                             | P1       |
| Tree and lazy children                                       | Shipped parity                 | Accepted in separate tree state                                                                                                                      | P1       |
| Tree load error/retry                                        | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Grouping/collapse/sticky/group selection                     | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Grouping plus tree                                           | Shipped parity combinations    | Accepted: group roots, preserve descendants                                                                                                          | P1       |
| Ungrouped show/hide/name/first/last position                 | Shipped parity                 | Accepted in grouping config                                                                                                                          | P1       |
| Grouped column headers                                       | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Fixed/pinned columns                                         | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Visibility                                                   | Shipped parity                 | Accepted                                                                                                                                             | P0       |
| Resize/size constraints                                      | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Reorder                                                      | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Keyboard resize/reorder                                      | Proposed-only                  | Accepted                                                                                                                                             | P1       |
| Current row and row events                                   | Shipped parity                 | Accepted with keyboard activation                                                                                                                    | P0       |
| Row hover/click and cell hover/click                         | Shipped parity                 | Accepted as concrete callbacks/column metadata                                                                                                       | P0       |
| Row and cell tooltips / overflow tooltip                     | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Row actions, custom cells, custom feature icons              | Shipped parity                 | Accepted through typed definitions/render hooks                                                                                                      | P0/P1    |
| Loading, empty, skeleton                                     | Shipped parity                 | Accepted                                                                                                                                             | P0       |
| Append/loading-more state                                    | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Footer/summary                                               | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Initial error/retry                                          | React target                   | Accepted                                                                                                                                             | P0       |
| Append error/retry                                           | Proposed-only                  | Accepted and labeled new                                                                                                                             | P1       |
| Height/scroll/fit/sticky content                             | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Scroll callback                                              | Shipped parity                 | Accepted                                                                                                                                             | P1       |
| Granular top/bottom/horizontal/vertical borders              | Shipped parity                 | Accepted in appearance                                                                                                                               | P1       |
| Table background variants and header visibility              | Shipped parity                 | Accepted in appearance (`background`, `showHeader`)                                                                                                  | P1       |
| Row/cell/header class and style callbacks                    | Shipped parity                 | Accepted with normalized contexts                                                                                                                    | P1       |
| Client pagination                                            | React current / legacy partial | Accepted, opt-in only                                                                                                                                | P0       |
| Coherent server pagination/query                             | Proposed-only                  | Accepted                                                                                                                                             | P0       |
| Restore hidden columns and widths                            | Shipped parity, partial        | Accepted                                                                                                                                             | P1       |
| Versioned persistence/storage/migration                      | New React hardening            | Accepted, not claimed as shipped parity                                                                                                              | P1       |
| Virtualization                                               | Shipped parity, partial        | Accepted as render adapter                                                                                                                           | P1       |
| Feature presets and one-time feature detection               | Shipped parity                 | Accepted as config normalization                                                                                                                     | P1       |
| Legacy `doLayout`                                            | Shipped parity method          | Replaced by automatic observation plus `measureLayout()` escape hatch                                                                                | P1       |
| Legacy `triggerRerender`                                     | Shipped parity method          | Rejected; immutable controlled/controller updates are the replacement                                                                                | P0       |
| Arbitrary named Vue slots                                    | Shipped parity                 | Replaced by typed column/toolbar/state/footer/action/detail render hooks and lower-layer escape hatches                                              | P0/P1    |
| Other Vue mutation methods                                   | Shipped parity                 | Replaced by controlled state and typed controller reset/toggle/scroll actions                                                                        | P0/P1    |
| Cross-page range over unloaded server rows                   | Proposed-only, unresolved      | Deferred; needs ordered-ID range service and is never simulated                                                                                      | Post-P1  |
| Automatic live-row-state persistence                         | Not required                   | Rejected by default; explicit opt-in only                                                                                                            | P1       |

### 11.1 Verification against the legacy catalog (2026-07-23)

The disposition table above was re-checked field-by-field against the full
legacy `AvTable` surface (`table.ts` props, `AvTableEvents`, the 13
sub-interfaces, `av-table-rows-group`, the 37 composables, and every
`__stories__/*` demo). The catalog is covered except for the three shipped
behaviors added in this revision — faceted filter values (`filterStats`),
row-click selection with the select-all indeterminate policy, and table
background variants with header visibility — now carried as ledger rows and
`§5.2` config members.

Residual legacy nuances judged **presentational or already subsumed**, tracked
here so they are not silently dropped: per-group `backgroundColor` and
`showGroupsOnly` (fold into `grouping.renderGroup` + collapse state), custom
action/settings icons beyond sort/expand (extend "custom feature icons"),
`scrollToOffset` (a variant of the `scrollToRow`/`scrollToIndex` action),
`hideCellContent`/`autoWidth` column presentation (column metadata), and the
`fit-viewport`/`fit-scrollable` height modes (numeric `appearance.height`/
`maxHeight` plus `stickyHeader`). Lazy-composable code-splitting is a React
delivery concern captured in the implementation plan, not a contract feature.

## 12. Definition of parity

Parity requires:

- every accepted P0/P1 ledger row has a neutral spec entry and executable
  adapter scenarios;
- no non-paginated table truncates rows;
- chrome and body share one controller;
- controlled and uncontrolled forms have equivalent visible behavior;
- detail and tree expansion remain independent in state, callbacks, and ARIA;
- manual modes never double-transform rows;
- request keys, server selection tokens, and reconciliation are deterministic;
- DataGrid provides accepted behaviors through grouped configs without consumer
  engine wiring;
- no standard product chrome is exported as a new DataTable companion API, and
  every DataGrid control reuses the corresponding UIKit primitive;
- DataTable's separate top-level `engineOptions` and `plugins` inputs admit
  only the seven allowlisted options and namespaced adapter extensions; the
  exhaustive TanStack-key guard is current; manifest, registrar, hook, and
  runtime surfaces match exactly; every other key/raw feature/collision throws
  in every environment; and DataGrid exposes neither input;
- the four frozen current DataTable presentation behaviors (including the
  `skeletonRows` support prop) preserve behavior for the compatibility minor,
  point to their target layers, and are removed together in the next major;
- keyboard and assistive-state assertions pass;
- every rejected/replaced/deferred legacy item remains documented as such.
