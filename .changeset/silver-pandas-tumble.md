---
'@constructor-lab/ui-react': patch
---

Fix a render loop that froze the browser when a group row was collapsed.

Toggling a group in a grouped `DataGrid` locked the page: 11,293 controller state
writes in 8 seconds, with a stable DOM and a flat heap — a render loop, not a leak.
TanStack auto-resets its `expanded` state whenever the row model is invalidated, that
reset reached `onExpandedChange`, and `requestChange` allocated a fresh state object
even when the value had not changed, so React never bailed out and the re-render
invalidated the row model again.

Two independent fixes, each verified to break the loop on its own:

- `autoResetExpanded: false` — the controller _derives_ `expanded` from
  `treeExpanded`/`detailExpanded`, so a slice the engine does not own must not be
  auto-reset by it. Correct regardless of the loop.
- `requestChange` now skips the write, and the change callbacks, when a slice's value
  is unchanged. It bails only where equality can be positively established; slices
  carrying arbitrary values (`columnFilters`, `globalFilter`) always write, because a
  wrong "equal" would silently drop a caller's update.

A no-op request no longer emits `onStateChange`, `onSliceChange` or `onQueryChange`.
Nothing else about the public surface changes, and at-rest rendering is unaffected
(measured: zero guard bails at mount across all 111 table-family stories).
