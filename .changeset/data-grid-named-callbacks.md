---
'@constructor-lab/ui-react': minor
---

feat(data-grid): named screen callbacks (P0.7)

Adds the `callbacks` prop — the surface a screen binds to (design §5.3). Each
callback carries the enriched event (`cause`, the complete next `state`, the
`query`, and its `requestKey`) instead of a bare value:

```tsx
callbacks={{
  onSelectionChange: (event) => setSelected(event.value),
  onQueryChange: (event) => syncUrl(event.query),
  onColumnStateChange: (event) => persist(event.slice, event.value),
  onRowAction: ({ actionId, row }) => run(actionId, row),
}}
```

Implemented: `onStateChange`, `onQueryChange`, `onSelectionChange`,
`onCurrentRowChange`, `onPaginationChange`, `onColumnStateChange`, `onRowHover`,
`onRowClick`, `onRowActivate`, `onCellHover`, `onCellClick`, `onRowAction`,
`onDataStateAction`.

**One ordering rule throughout: a config-level handler owns the behavior and runs
first; the named callback observes afterwards.** So `server.onQueryChange`
refetches and `callbacks.onQueryChange` only observes the same event (it must not
start a second request), `rowInteraction.on*` runs before `onRow*`,
`actions.onAction` before `onRowAction`, and `dataState.onRetry` before
`onDataStateAction`. Binding both is supported and expected — the config handler
gets the row, the callback gets the full event.

Every slice-derived event reuses the controller's own `DataTableChangeEvent`
narrowed to its slice, so the family has one event shape rather than a parallel
vocabulary. The four column slices fan into a single `onColumnStateChange`
discriminated by `event.slice`, so persisting column preferences is one handler.
Binding no callbacks installs no per-slice handlers on the controller.

The design's `onDetailExpansionChange`, `onTreeExpansionChange`, `onTreeLoad`,
`onGroupingChange`, and `onScroll` are deliberately **not** included: their
features are P1, and they will land with the behavior that emits them rather than
as callbacks that can never fire. `onDataStateAction`'s `append-retry` action
likewise arrives with the P1 append state.

Exports `DataGridCallbacks` plus the event types
(`DataGridSelectionChangeEvent`, `DataGridCurrentRowChangeEvent`,
`DataGridPaginationChangeEvent`, `DataGridColumnStateChangeEvent`,
`DataGridColumnSlice`, `DataGridRowActionEvent`,
`DataGridDataStateActionEvent`).
