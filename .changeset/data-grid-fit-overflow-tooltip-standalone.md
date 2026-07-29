---
'@constructor-lab/ui-react': patch
---

fix(data-grid): `columnsFeatures.fit` and `overflowTooltip` now work on their own

Both are documented props that did nothing unless an unrelated column feature
happened to be switched on. `columnsFeatures={{ fit: 'content' }}` and
`{{ overflowTooltip: true }}` reached the engine only alongside `visibility`,
`pinning`, `resizing` or `reordering`.

The config layer resolved both members and carried them in the resolved value, but
the guard in `controllerOptions` discarded the entire config unless one of the four
_affordances_ was on — so the two members were computed, stored, and thrown away.

Fixed at that guard, whose question is "does the engine need this config?" — not by
adding the members to the shared `enabled` flag. `enabled` has three readers and they
do not ask the same thing: `toolbar` uses it to decide whether a grid opted in at all,
and widening it would have flipped that ternary and **silently removed the column
list from the settings menu** of any `{ fit: ... }` caller. That is measured, and a
test pins it so the predicate cannot be collapsed back into `enabled`.

`enabled`'s docstring said "any sub-feature enabled", which was false; it is the four
affordances, and reading it as true is what made the discard guard look correct.

No behaviour change for a grid that sets neither member, including
`columnsFeatures={{}}`.
