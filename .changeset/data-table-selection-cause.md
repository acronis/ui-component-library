---
'@constructor-lab/ui-react': patch
---

fix(selection): a pointer-driven selection change now reports `cause: 'pointer'`
instead of `'api'`.

Every selection control goes through the engine — `row.toggleSelected()`,
`table.toggleAll*RowsSelected()` — so by the time the controller saw the change it
knew only _that_ the engine asked, not _what_ asked it. Each one reported
`cause: 'api'`, which is the single thing `cause` exists to distinguish from: a
consumer could not tell a user's click from a programmatic selection. In one click
handler the same pointer event produced `'pointer'` for the current row and
`'api'` for the selection two lines apart.

Three call sites are fixed together — the row checkbox, the header select-all, and
`selection.selectByRow` — because a partial fix is worse than uniform dishonesty:
it reads as a deliberate distinction.

**The engine still decides _which_ rows change.** The provenance is carried across
the round-trip rather than replacing it, so single-selection replacement,
`isRowSelectable` eligibility and the sub-row cascade all keep living in TanStack's
own `mutateRowIsSelected`. Writing the slice directly from the control — the
obvious fix — would have traded a wrong string for those three behaviours.

A change nothing drove still reports `'api'`, which is the honest answer for a
genuinely programmatic selection.

For a hand-composed `DataTable`, the same treatment is available: wrap an engine
call in `withSelectionCause(cause, act)`. It is scoped to selection deliberately —
a general "cause of the next change" would be an untyped side channel every feature
could reach into.
