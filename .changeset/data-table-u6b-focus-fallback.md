---
'@constructor-lab/ui-react': minor
---

feat(data-table): fall back to a neighbouring row when data removes the current one (§7 clauses 3–4)

When a data change removes the row that holds roving focus, `DataTable` no longer just
**clears** the current row — which stranded the keyboard user, because the next arrow
key had nowhere to resume from. It now falls back, per design §7 clause 3
(`data-grid/behavior.md:275-276`):

- **rung 1, same index** — the row that shifted into the vacated position becomes
  current;
- **rung 2, previous last** — when the vacated index no longer exists (the removed row
  was at or past the new end), the last surviving row becomes current;
- **rung 3, the toolbar** — with no row surviving, DOM focus moves to the first
  focusable control of the `DataGrid` toolbar, found by query
  (`[data-slot="data-grid-toolbar"]`) rather than by any new prop or ref;
- **rung 4, the scroll container** — when there is no toolbar, or its controls are all
  inert, or it holds none at all, focus moves to the table's scroll container instead.

The current row is still **cleared** when no row survives: rungs 3 and 4 move DOM focus
and touch no state, which is design §7's "without changing logical current row".

**Position is measured over the visible list — `getRowModel().rows`, with group headers
excluded — not over `data`.** Roving focus is a visual affordance, so the index a user
perceives is the one in the post-filter/sort/pagination list they can see. Group rows
are in that list and cannot hold roving focus, so counting them would land rung 1 on a
group header. Tree descendants **are** records and **do** occupy positions, so they are
counted.

**§7 clause 4 — "exactly one `data-reconcile` event updates the current row"** — holds
structurally rather than by care: the whole chain resolves to a single value before one
request is issued, so there is no branch that can emit a clear followed by a set. A
controlled caller applying both would otherwise see the current row blink out and back.

**Behaviour change for controlled callers.** A caller that mirrors `currentRowId` will
now receive a row id where it previously received `undefined` after a removal. The
`cause` is still `data-reconcile`, and `rowInteraction: { reserve: true }` still opts out
of reconciliation entirely.

**A rung-3 miss falls THROUGH to rung 4; it is never a landing.** That path is the
ordinary one, not an edge case, and in two different ways: `DataGrid` renders no toolbar
row at all unless `toolbar` is passed or a search column exists, and a toolbar that does
render can still hold no focusable control (`toolbar={{ viewOptions: false }}` with no
search column and no active filter). Focusing the toolbar row itself was considered and
rejected — an empty layout div announces nothing to a screen reader, so it would turn a
miss into a silent dead end. Controls that are `disabled` or `aria-disabled` are skipped
for the same reason: `.focus()` on an inert control leaves focus where it was.

**Focus is only taken when it was lost from this table.** Two conditions, and they reject
different mistakes: focus must have been inside the table and not deliberately moved out
of it since, and the removed current row must have been one the person could actually see
(a current row that was filtered out or on another page never held DOM focus, so moving
focus would take it from wherever they are). Without the first, a background refresh that
empties an untouched table would pull focus into it out of nowhere.

`DataGridToolbar` now carries `data-slot="data-grid-toolbar"`. It is the only markup
difference between it and the frozen `DataTableToolbar` adapter, which is asserted in
both directions.

**Not verified in a browser.** happy-dom has no layout engine, so the tests assert which
element receives focus and in what order — not that the scroll container can then be
scrolled, which is part of why rung 4 is useful to a person. See the CI gap in the
project's issue #78.
