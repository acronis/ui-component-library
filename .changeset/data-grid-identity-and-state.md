---
'@constructor-lab/ui-react': minor
---

feat(data-grid): `state`/`defaultState` exposure + the `getRowId` identity rule

**New: `state` and `defaultState` on DataGrid.**

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  getRowId={(row) => row.id}
  selection={{ mode: 'multiple' }}
  state={{ selection }} // controlled: requests, never commits
  defaultState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  callbacks={{ onSelectionChange: (event) => setSelection(event.value) }}
/>
```

A slice in `state` is controlled: DataGrid emits the change event so the screen can
apply it, but commits nothing internally. A slice absent from `state` is
uncontrolled and initializes once from `defaultState`. The same slice in both is a
development error and the controlled value wins. The controller already implemented
all three rules — this exposes them at the DataGrid layer.

Two precedence rules resolve the overlaps DataGrid adds on top. Server mode
controls the query slices exclusively, so a caller controlling one of those is
reported rather than silently overridden. And a caller `defaultState` slice beats a
group's own initial value — `defaultState.pagination` wins over
`pagination.pageSize`.

**`state` keeps its deprecated string form.** `state="loading"` is still the
data-status alias for `dataState.status` and still warns when combined with
`dataState`. The prop is now a structural union of the status string and the
controlled-slice object, discriminated by `typeof state === 'string'`; the two are
disjoint, so no caller needs to change.

**Migration: `getRowId` is now required by the grouped API when a feature needs row
identity.** `DataGridProps` is a discriminated union implementing design §3.1:
`getRowId` is optional only while every identity-bearing feature is disabled, and
required as soon as one is enabled — `selection`, `actions`, `rowInteraction.current`,
`server`, or a controlled `selection`/`currentRowId`/`detailExpanded`/`treeExpanded`
slice. Omitting it is a compile error naming the missing prop.

Nothing needs to change today: **every existing call site already complies.** The
deprecated flat aliases (`selectable`, `currentRow`, `onRowClick`, …) stay
source-compatible for one minor line, as the design requires. They now log a
development warning explaining that identity falls back to the row index and cannot
survive a data change, and the fix is either `getRowId` or the grouped config.

The rule is deliberately finer than the design sketch in one place:
`rowInteraction`'s `onClick`/`onActivate`/`onHover` receive the row _object_, not an
id, so they remain available without `getRowId`. Only `current` requires it.
