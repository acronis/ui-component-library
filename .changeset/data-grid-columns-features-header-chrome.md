---
'@constructor-lab/ui-react': minor
---

DataGrid: `columnsFeatures` gains its header chrome — a resize handle, a reorder
grip, keyboard operation, and one live region per grid.

With `columnsFeatures: { resizing: true }` every unlocked column's header carries
a focusable resize handle: pointer drag (TanStack's own maths, committing per
`resizeMode`) plus Left/Right arrows for a 16px step. With
`columnsFeatures: { reordering: true }` it carries a grip; activate it and the
arrow keys move the column one **visible** position inside its own pin region,
with Enter or Escape ending the interaction. Pointer drag-and-drop reorder is not
part of this release.

- **The controls are siblings of the sort affordance, not children of it.** They
  mount through the header-cell adornment seam with `placement: 'edge'`, which is
  `TableHead`'s `trailing` slot — so on a sortable column a pointer release does
  not sort, Enter/Space acts instead of sorting, and the header's accessible name
  stays the column label rather than absorbing the control's.
- **Announcements go to one live region per grid**, mounted by the group itself,
  and shared with the column-settings menu. Widths, moves, pin changes and
  visibility changes are announced in the logical vocabulary (`pinned to start`,
  never `left`).
- **`aria-valuemax` is emitted only for a column the caller capped.** The
  engine's resolved maximum is `Number.MAX_SAFE_INTEGER`, which is a safe clamp
  and a nonsense thing to publish.
- **Locked columns offer no controls at all**, resizing included, so the default
  `lockSystemColumns` leaves the selection and actions columns untouched.

For a hand-composed `DataTable`, the same commands are on the header render
context as `columns` (`resizeTo`, `moveTo`, `moveBy`, `pin`, plus `size`,
`minSize`, `maxSize`, `position`, `total`). Each returns a structured
announcement intent, or `undefined` when nothing changed — the engine renders no
handle and no live region, so a custom composer owns the wording exactly as
DataGrid does.
