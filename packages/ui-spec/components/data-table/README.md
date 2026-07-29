# DataTable

The flexible React/TanStack engine and custom-composition escape hatch. One
controller owns state, plugins, row models, queries, metadata and actions;
`DataTableView` projects them through the semantic `Table` primitive.

> **Boundary.** DataTable does not supply batteries-included toolbar, search,
> filters, selection controls, bulk actions, column-settings menus, pagination
> controls, overlays, tooltips, empty/error components or live-region UI.
> Existing public `DataTableToolbar`, `DataTableViewOptions`,
> `DataTablePagination` and similar exports are current migration liabilities,
> not target companion APIs. Their implementations move behind DataGrid-owned
> private chrome; compatibility exports are deprecated only as required.

## Choose the layer

- Use `Table` for fully custom semantic table markup and presentation.
- Use `DataTable` for headless engine behavior, selective manual processing, or
  a deliberately custom composition built from render contexts.
- Use `DataGrid` for any standard records-screen UI. It is the sole
  batteries-included layer and composes the required UIKit primitives.

## Current React baseline

```tsx
<DataTable columns={columns} data={rows} />
```

Do not surround that self-contained current view with separately constructed
legacy companions; their engine state diverges. Migration replaces that guidance
with one controller plus render contexts, not a new public companion suite.

Current React `getRowCanExpand` and `renderExpandedRow` remain deprecated for
one minor line and normalize to `detailExpansion.isExpandable` and
`detailExpansion.render`. Partial legacy behavior is preserved. Combining either
alias with `detailExpansion` is a development error; the grouped value wins in
production.

### Frozen visual compatibility

For the first minor that introduces the controller API, the current React
convenience component also keeps `skeleton`/`skeletonRows`, `striped`,
`bordered`, and `highlightCurrentRow` as deprecated, frozen inputs. Their
rendered behavior is preserved exactly: no expanded semantics, new variants, or
new customization are added. They are removed in the next major.

- Move loading UI to DataGrid `dataState`, or project it from DataTable's state
  render context. Until removal, the deprecated `skeleton` path is DataTable's
  sole primitive-rendering exception and must reuse UIKit `Skeleton`;
  `skeletonRows` affects only that path.
- Move stripes and borders to DataGrid `appearance`, or compose presentation
  directly with Table.
- Move current-row treatment to DataGrid `rowInteraction`, or a custom
  DataTable row render context.

## Controller and render composition (planned)

```tsx
const table = useDataTable({
  columns,
  data: rows,
  getRowId: (row) => row.id,
  defaultState: { pagination: { pageIndex: 0, pageSize: 25 } },
  sorting: { mode: 'multiple' },
  filtering: {},
  selection: { reserve: true },
  pagination: {},
  engineOptions: { debugTable: true },
  plugins: [auditPlugin],
});

<DataTableRoot table={table}>
  <DataTableView
    renderHeader={(context) => customHeader(context)}
    renderCell={(context) => customCell(context)}
    renderRow={(context) => customRow(context)}
    renderState={(context) => customStateProjection(context)}
  />
</DataTableRoot>;
```

Render contexts exist for header, cell, row, detail, tree, group, footer and
state projection. They contain state, commands, metadata and values—not
preassembled Checkbox, Filter, Pagination, Empty, Alert, Menu or other product
controls. A custom application composition may build its own UI from UIKit
primitives; it is not a second batteries-included DataTable API.

### React engine extensions

`engineOptions` and `plugins` are separate, top-level React escape hatches.
Neither exists on DataGrid, and `plugins` nested in `engineOptions` is invalid.

`engineOptions` is an all-optional `Partial<Pick<TableOptions<…>, …>>` with
exactly seven accepted keys: `debugAll`, `debugCells`, `debugColumns`,
`debugHeaders`, `debugRows`, `debugTable`, and `renderFallbackValue`. Every
other TanStack option rejects statically and at runtime before construction,
including `_features`, `mergeOptions`, `meta`, state, callbacks, row models,
faceting, identity, manual flags, feature/policy controls, and nested `plugins`.

The adapter commits an exhaustive classification of every installed
`keyof TableOptions`. Its type must satisfy the full upstream key set, and its
classified-safe keys must equal the seven-key public union. A TanStack upgrade
that adds or removes a key fails compilation until the key is explicitly
classified and the public allowlist is deliberately reviewed. Runtime
normalization is generated from the same seven-key constant.

A plugin is an analyzable `DataTableEnginePlugin` descriptor, never a raw
TanStack `TableFeature`:

```ts
{
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
}
```

The six manifest arrays are complete. Every entry is a fully qualified
`${id}.<surface>.<name>` adapter key; bare names and TanStack `TableOptions`
keys are invalid. IDs and namespaces are required, unique, free of reserved
prefixes, and the namespaces must equal `${id}.actions` and `${id}.metadata`.
Keys must be unique, non-owned, and disjoint across plugins.

Only after every descriptor passes preflight does setup receive a recording
registrar for option, state, callback, row-model, action, metadata, and
restricted lifecycle-hook registration. The six registered key sets must equal
the manifest exactly. Registrar methods accept local names and qualify them to
`${id}.<surface>.<name>` before comparison. Factories and hooks receive
read-only contexts; they cannot replace engine state, controller behavior,
queries, identity, row-model stages, focus/accessibility behavior, or another
hook. Runtime properties must also equal the declared, namespaced surface.
Undeclared, missing, unnamespaced, duplicate, owned, reserved, mutating, or
cross-plugin output throws in every environment before it becomes observable.

Plugin option values and all other plugin surfaces live in a private,
plugin-scoped adapter registry. They are available to that plugin's factories
and hooks through a read-only view, but are never spread or merged into TanStack
`TableOptions` and cannot insert or replace a canonical DataTable pipeline
stage. Configuration is closed over when the descriptor is created.

After that validation—and only then—the React adapter derives its private
TanStack `TableFeature` entries and supplies the owned `_features` option.

## Server engine (planned P0)

```tsx
const table = useDataTable({
  columns,
  data: rows,
  getRowId: (row) => row.id,
  state: { sorting, columnFilters, grouping, pagination },
  manual: { sorting: true, filtering: true, grouping: true, pagination: true },
  rowCount,
  dataState,
  onQueryChange: ({ query, requestKey }) => loadLatest(query, requestKey),
});
```

DataTable models pagination and data states and exposes their actions/metadata;
it does not render standard page buttons, page-size controls, Empty, Alert,
retry, Skeleton or Spinner UI. DataGrid owns those visible treatments, except
for the frozen deprecated React `skeleton` compatibility path described above.

`row-id` is conditionally required for any identity-bearing behavior, including
`rowInteraction.current` specifically — not row interaction as a whole; its
`onClick`/`onHover`/`onActivate` handlers receive the row object and need no
identity — either expansion domain, legacy `getSubRows`, actions, server mode,
row-state persistence and row targeting. Column-only persistence remains
identity-free.

Config members with defaults are optional. Required values are limited to
non-inferable engine inputs such as detail `render`, tree `getChildren`, grouping
`allowedColumns`, and persistence `key`/`version`/`storage`.
