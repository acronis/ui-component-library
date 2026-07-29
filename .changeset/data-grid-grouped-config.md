---
'@constructor-lab/ui-react': minor
---

feat(data-grid): grouped-config API for delivered features (P0.7)

DataGrid now accepts the design's grouped, object-form configs for the delivered
features, and the flat prototype props become deprecated aliases that normalize
into them:

- `selection` (`false | { mode, showSelectAll, isRowSelectable }`) ← `selectable`
  / `selectionMode` / `isRowSelectable`
- `sorting` (`false | { mode }`) ← `sortable` / `multiSort`
- `appearance` (`{ striped }`) ← `striped`
- `dataState` (`{ status, skeletonRows, empty, error, onRetry }`) ← `state` /
  `error` / `onRetry` / `skeletonRows` / `emptyMessage`
- `rowInteraction` (`{ current, onClick, onActivate, onHover }`) ← `currentRow` /
  `onRowClick` / `onRowActivate` / `onRowHover`

Precedence follows the design: a grouped config wins over its deprecated alias,
and supplying both emits a development warning. The grouped config types are
exported (`DataGridSelectionConfig`, `DataGridSortingConfig`,
`DataGridAppearanceConfig`, `DataGridDataStateConfig`,
`DataGridRowInteractionConfig`). `selection.showSelectAll` can now hide the header
select-all in multiple mode.

Story added: `GroupedConfig`.

Not yet migrated to grouped form (follow-up, some pending P1 engine features):
`filters`/`pagination`/`toolbar` (need `legacy | config` union props), `actions`,
`presets`, and the P1 groups (tree/grouping/virtualization/columns/persistence/
detailExpansion). The `table-view` / `data-table` screen migrations also remain.
