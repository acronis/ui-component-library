---
'@constructor-lab/ui-react': patch
---

Table: `TableHead`'s accessible name no longer absorbs `trailing` content.

A header cell's accessible name is computed from its contents, so a control in the
`trailing` slot with an `aria-label` — a resize handle, say — was folded into it:
the column header announced as "Name Resize name column". That is worse than it
sounds, because a screen reader repeats the column header for **every cell** in
the column, so the handle's label was announced on every row.

When `trailing` content is present, `TableHead` now names the header from its label
region explicitly, which structurally excludes the slot. The control keeps its own
accessible name.

A header with no `trailing` content is unchanged — no `aria-labelledby`, no
wrapper element, name still computed from content — so nothing about the common
case moves.

This is deliberately automatic rather than a prop. Anything mounted in `trailing`
gets the correct naming without the caller knowing the hazard exists; an opt-in
would have meant every future consumer rediscovering it.
