---
'@constructor-lab/ui-react': minor
---

feat(data-grid): actions grouped form and preset normalization (P0.7)

Completes the grouped-config normalization with the last delivered group and the
preset layer above it.

`actions` now matches the design's union: `false | DataGridActionsConfig`, where
the config carries **exactly one** of `items` (the built-in menu) or `render`
(a typed escape hatch owning the whole cell), plus `placement` and `onAction`.
The custom renderer gets the same propagation isolation as the menu — its
controls never toggle row selection or fire the row click/activate handlers — and
the cell now justifies to the side `placement` puts the column on. Development
validation reports action items combined with a renderer, and duplicate item ids.

`presets` adds named grouped-config bundles:

```tsx
presets={{
  definitions: [{ id: 'reviewable', config: { selection: { mode: 'multiple' }, … } }],
  apply: ['reviewable'],
  detect: ({ columns, rows }) => (rows.length > 20 ? ['paged'] : []),
}}
```

Precedence rises with explicitness: detected presets apply first, then `apply`
left-to-right (later writes win), then any group the caller supplied — by grouped
prop **or** deprecated alias — which a preset never overrides. That last rule
also means a preset can't manufacture a spurious grouped-vs-alias duplicate
warning. `detect` runs exactly once against the initial columns/rows, so it can
never observe mutable state. Development validation reports an applied preset
that is not defined and a preset carrying anything but a grouped config
(`state`, `defaultState`, `server`, `columns`, `rows`, `callbacks`).

`DataGridProps` now extends the new exported `DataGridGroupedConfig`, so the prop
surface and what a preset may set cannot drift. `DataGridGroupedConfig`,
`DataGridPreset`, `DataGridPresetsInput`, `DataGridFiltersConfig`,
`DataGridPaginationConfig`, and `DataGridToolbarConfig` are exported.

Remaining P0.7 (follow-up): the P1 feature groups (`detailExpansion`, `tree`,
`grouping`, `virtualization`, `columnsFeatures`, `persistence`, `footer`), the
required-`getRowId` API change, and the `table-view`/`data-table` screen
migrations.
