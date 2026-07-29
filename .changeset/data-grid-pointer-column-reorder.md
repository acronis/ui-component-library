---
'@constructor-lab/ui-react': minor
---

feat(data-grid): reorder columns by dragging the header grip

`columnsFeatures.reordering` now offers a pointer gesture as well as the keyboard
one. Drag a column's reorder grip onto another column: that column's header is
outlined as the drop target, release moves the dragged column into its place, and
Escape (or a cancelled pointer) abandons the drag with nothing moved.

- **A gesture layer over the existing commands, not new reorder logic.** Release
  calls the engine's own `moveTo`, which stays the authority on legality — a move
  is still clamped to the column's pin region and still refuses a locked target
  (design §6.9). Both paths announce through the same intent, so a pointer user and
  a keyboard user hear the same sentence.
- **The keyboard path is unchanged.** A press below a 4px threshold is still a
  click, and a click still engages arrow-key reordering. A keyboard activation is
  never consumed by the pointer path.
- **New, and useful to a composer**: every header cell now publishes
  `data-column-id`, and — with `reordering` on — carries the drop-target paint rule
  keyed on `data-reorder-target`. A composer that maps its own gesture onto
  `moveTo`/`moveBy` can identify the column under a pointer and mark it without
  authoring colour of its own.

Nothing is added at rest beyond the grip's grab cursor: the drop outline exists
only while a pointer is down.
