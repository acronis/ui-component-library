---
'@constructor-lab/ui-react': minor
---

DataTable/DataGrid: add the `grouping` behavior group — row grouping with
collapsible, sticky group headers, a group-scoped select-all, and the ungrouped
bucket policy.

`DataGrid` gains a `grouping` prop (`allowedColumns` required; `renderGroup`,
`collapsible`, `sticky`, `selectionScope`, `ungrouped` optional). `DataTable`
gains the matching `grouping` config, a `groupCollapsed` state slice, and a
working `toggle-group` imperative action. Root records group while each root's
descendant tree stays attached; a group's members render underneath its header
and collapse into it.

`grouping` does **not** require `getRowId`: collapse is keyed by the synthetic
group id, not by row identity. A grid that groups _and_ selects needs `getRowId`
because of `selection`.

Five notes worth reading before you use it:

- **Grouping is switched on through the `grouping` state slice, not the config.**
  `allowedColumns` says which columns _may_ group; pass
  `defaultState={{ grouping: ['status'] }}` (or a controlled `state.grouping`) to
  group by one. This mirrors `sorting`, where the config carries behavior and the
  slice carries the current value. There is no built-in group-by control in this
  release.
- **`getGroupedRowModel()` alone shows group headers with no members.** The
  grouped row model nests each group's members in `subRows`, and TanStack's stock
  expand stage returns early while nothing is expanded, so this release installs
  its own expand stage — owned by the `grouping` feature module and shared with
  `tree`, which no longer installs one. Tree expansion is unchanged.
- **`groupedColumnMode` is set to `false`.** TanStack's default (`'reorder'`)
  hoists every grouped column to the front of the column order the moment
  grouping activates, silently overriding `columnsFeatures.columnOrder`. The
  group header shows the value already, so the caller's order is kept.
- **`selectionScope` defaults to `'all-loaded-leaves'`**, so a collapsed group is
  still selectable. `'visible-leaves'` restricts the group select-all to rows
  currently on screen, which means a collapsed group's control is empty and
  disabled.
- **A sticky group header needs `appearance.height` or `appearance.maxHeight`**,
  and with `appearance.stickyHeader` it slides under the table header rather than
  stacking below it (the fixed z-ladder puts the header above group rows). There
  is no offset member for clearing the header.

Two inherited limitations, recorded rather than left to be discovered: a real
`null` and the string `"null"` land in the **same** group, because the row model
keys groups by the stringified value above this layer; and `allowedColumns` is
enforced when the grouping slice is written through the engine, so a value pushed
directly into a controlled `state.grouping` is honoured as the caller's own
assertion.
