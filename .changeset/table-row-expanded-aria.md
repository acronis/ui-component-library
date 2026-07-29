---
'@constructor-lab/ui-react': patch
---

Table: `TableRow`'s `expanded` no longer emits `aria-expanded`.

`aria-expanded` is only valid on a `treegrid` row. On a row inside a
`role="table"` it is invalid, and axe reports it as `aria-conditional-attr` at
**serious** impact. `expanded` now sets `data-expanded` only, which is what the
styling hooks use.

The attribute belongs on the **disclosure control**, alongside `aria-controls`
pointing at the revealed row — which is what the component spec's anatomy already
specifies for the expander parts, and what DataGrid's expander implements. So this
aligns the primitive with a contract it was contradicting rather than changing the
family's accessible behaviour.

If the table family later adopts `role="treegrid"`, the attribute returns to the
row gated on that role, which needs a `Table`-level prop: a row cannot know the
role of the table containing it.

No consumer migration — `expanded` shipped on this release line only, and nothing
reads `aria-expanded` from a row.
