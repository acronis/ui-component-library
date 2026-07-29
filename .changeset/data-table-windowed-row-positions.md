---
'@constructor-lab/ui-react': patch
---

fix(data-table): a virtualized table now reports its true row positions to assistive technology

A windowed table renders a slice of real rows between two `aria-hidden` spacers, so
assistive technology counted only what was in the accessibility tree — announcing
"row 3 of 20" where the truth was row 1,847 of 4,821. That is not an imprecise
number; it is a different quantity.

With `virtualization` on, the table now publishes `aria-rowcount` and every rendered
row publishes `aria-rowindex` — the mechanism ARIA provides for a table whose rows
are not all in the DOM. Header rows are numbered too, and group-header, detail and
footer rows get indices alongside records, so the sequence has no holes.

**Nothing changes when virtualization is off**, and that is deliberate rather than an
oversight: when every row is in the DOM the browser's own count is already correct, so
publishing an explicit one could only replace a right implicit number with a chance to
be wrong. Per MDN, the attribute is not needed in that case.

No visual change and no API change.

**Verified as emitted, not as announced.** The attributes and their values are
asserted in a rendered DOM, including the off-by-one that a variable header-row count
introduces. Whether a given screen reader honours them over its own count of the
accessibility tree is not covered by any automated check in this repository.
