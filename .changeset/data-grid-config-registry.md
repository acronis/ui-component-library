---
'@constructor-lab/ui-react': minor
---

feat(data-grid): config registry + `toolbar.columnFilters`/`viewOptions` members

**New: the toolbar's own members are now configurable (design §5.2).**

`DataGridToolbarConfig` gains `columnFilters` and `viewOptions`:

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  filters={{ columns: filterDefinitions }}
  toolbar={{ columnFilters: true, viewOptions: false }}
/>
```

**Migration — `toolbar.columnFilters` defaults to `false`.** Defining column
filters and _surfacing_ their controls are now separate decisions, as the design
specifies. Previously the controls rendered whenever `filters` carried column
definitions, with no way to turn them off; now `toolbar.columnFilters` governs it
and defaults to off.

If you pass `filters` with `columns` (or the deprecated bare
`DataGridColumnFilterDef[]` form) and want the controls, add
`toolbar={{ columnFilters: true }}`. In development DataGrid logs an error when
filter definitions would render nowhere, so an un-migrated grid reports itself
rather than silently dropping its filter row. `filters.global` (the toolbar
search box) is unaffected.

`toolbar.viewOptions` defaults to `true` — the previous, unconditional behavior —
and set to `false` hides the column-visibility menu. DataGrid now renders its own
toolbar row rather than the frozen `DataTableToolbar` adapter, which is unchanged;
direct DataTable composition is unaffected.

**Internal: DataGrid's behavior groups are now a config registry.**

No public API change. `data-grid.tsx` hand-listed every behavior group in eight
places — the `DataGridGroupedConfig` interface, a total-record `satisfies` over
its keys, the resolved shape, the resolver, the resolved-field destructure, the
`useDataTable({…})` assembly, the column assembly, and the render body. All eight
are now derived from one module per group under `data-grid-config/`, each
declaring its own prop surface, resolution, controller options, column
injection, view props, and chrome. Adding a behavior group is a new file plus one
line in the module list.

Two behavior-adjacent consequences worth knowing:

- Config resolution is memoized on the props the registry actually reads instead
  of on the props object, and the named callbacks are read through a stable
  accessor. Both make the assembled column set referentially stable in cases
  where it previously churned — notably when `callbacks` is passed as an object
  literal, which used to reset TanStack row selection on re-render.
- A module may not overwrite another module's controller option or view prop; a
  collision throws in development rather than letting one silently win.
