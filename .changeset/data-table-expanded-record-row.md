---
'@constructor-lab/ui-react': patch
---

fix(data-table): a record row with an open detail panel is now painted as expanded

A table could hold two disclosure mechanisms and paint only one of them open: a
grouping header already looked expanded, and a record row whose detail panel was open
did not. Both now carry `data-expanded`, so a row that is disclosing looks like it.

- Only when a panel is actually **rendered**. `detailExpansion: {}` with no `render`
  and no `renderExpandedRow` is a supported configuration — the caller wants expansion
  state and no panel row — and such a row discloses nothing, so it is not painted.
- **Styling only.** `data-expanded` is not `aria-expanded`, which is invalid on a row
  inside `role="table"`; disclosure semantics stay on the expander button.
- Selection still wins over expansion.

⚠ **Known and accepted**: the expanded tint is `--ui-table-data-row-color-hover`, the
hover token, so an open row reads as hover-tinted while the pointer is elsewhere. That
trade-off was chosen deliberately in favour of matching group headers rather than
introducing a new token.

Visual-regression baselines for one story change with this.
