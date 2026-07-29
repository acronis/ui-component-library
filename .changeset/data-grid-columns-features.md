---
'@constructor-lab/ui-react': minor
---

DataTable/DataGrid: add the `columnsFeatures` behavior group — engine wiring and
config resolution.

`DataGrid` gains a `columnsFeatures` prop (`visibility`, `pinning`, `resizing`,
`reordering`, `resizeMode`, `fit`, `overflowTooltip`, `lockSystemColumns`), and
the DataTable feature module turns on TanStack's column pinning and resizing and
exposes pin/size/order commands on the header render context.

Three behavioral notes:

- `resizeMode` defaults to `'onEnd'`, not TanStack's `'onChange'`. The library
  default commits sizing state on every pointer move, which re-renders every row
  per frame; pass `resizeMode: 'onChange'` to opt back in.
- Only `enableColumnPinning` is set. TanStack's `enablePinning` is deprecated in
  favour of the per-axis flags, and row pinning is not in scope.
- `lockSystemColumns` defaults to on, so the selection and actions columns cannot
  be moved, pinned or resized, and offer no header controls, unless it is
  explicitly `false`.

The presentation half — pinned columns and their offsets, resolved widths, and
the header resize handle and reorder grip — is in this release too; see the
`columnsFeatures` header-chrome entry.
