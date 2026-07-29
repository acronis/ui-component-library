---
'@constructor-lab/ui-react': patch
---

fix(data-table): a column-resize drag no longer runs backwards in a right-to-left document

Dragging a resize handle in a right-to-left locale moved the column's edge the wrong
way: pulling the handle in the direction that should widen the column narrowed it by
exactly the same amount. The keyboard path (Tab to a handle, Left/Right) was always
correct, so the two disagreed.

Measured in Chromium on a 348.7px column, dragging 60px in the widening direction:

|               | before              | after               |
| ------------- | ------------------- | ------------------- |
| left-to-right | 408.7px (+60.0)     | 408.7px (+60.0)     |
| right-to-left | **288.7px (−60.0)** | **408.7px (+60.0)** |

**The cause was two sources of truth, not a missing sign.** The keyboard path read the
rendered direction live; the drag inherited `@tanstack/react-table`'s
`columnResizeDirection` option, which this library never set — so it kept the
library's `'ltr'` default and multiplied every delta by `+1` even where the handle
had moved to the opposite physical edge. Both paths now resolve direction from one
element-level read, so they cannot disagree.

No API change, and nothing to configure: direction is observed from the rendered
document, exactly as the keyboard path already did. A caller still cannot pass
`columnResizeDirection` through `controllerOptions` — keeping it in sync with the
document by hand is the defect this replaces.
