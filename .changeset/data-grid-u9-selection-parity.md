---
'@constructor-lab/ui-react': minor
---

feat(data-grid): selection `selectByRow`, `reserve`, and the indeterminate policy (U9)

**`selection.selectByRow`** toggles a row's selection when its body row is
clicked:

```tsx
selection={{ mode: 'multiple', selectByRow: true }}
```

The checkbox column stays the accessible primary control — the row gets a pointer
cursor and a click handler, and deliberately **no tab stop and no keyboard
binding**, so it does not become an unlabelled focus target. Action controls, the
detail expander and the row checkbox all isolate propagation, so none of them
selects on the way through. Eligibility comes from `isRowSelectable` and
single-selection mode replaces rather than accumulates, both straight from the
engine.

Composes with a row-click handler rather than replacing it: with both
`selection.selectByRow` and `rowInteraction.onClick`, the toggle runs first and the
handler observes the post-toggle state. On a double-click activation the row is
toggled twice and therefore ends where it started, so double-clicking to open does
not disturb selection.

**`selection.reserve`** keeps selected ids whose records are absent after a data
replacement, instead of pruning them:

```tsx
selection={{ mode: 'multiple', reserve: true }}
```

The pruning behavior itself is the controller's and unchanged — this is the config
surface that reaches it from `DataGrid`. Default stays `false`, so a selected id
whose record disappears is still dropped with cause `data-reconcile`.

**`selection.selectAllOnIndeterminate`** picks what the header select-all does
when it is in the mixed state: select every eligible row (`true`, the default), or
clear the selection (`false`).

```tsx
// the new opt-in: a mixed header control clears instead of selecting
selection={{ mode: 'multiple', selectAllOnIndeterminate: false }}
```

**No behavior change.** The default matches what already ships, so existing callers
see nothing new. Only the mixed state is governed at all: an unchecked header
control still selects the page and a fully checked one still clears it, under either
policy, and select-all skips rows excluded by `isRowSelectable` either way.

_Deviation from the design contract, recorded deliberately._ Design §5.2 defaults
this member to `false`. Shipping that default would have changed behavior for every
existing caller with no code change on their part — the most invisible kind of
breaking change — and both behaviors are defensible UX with no correctness argument
for either, so the shipped one wins and the member exists for callers who want the
other. (Today's behavior is `true` by accident rather than by decision: an
indeterminate checkbox reports `checked: true` and that value was passed straight
through. Consumers depend on observed behavior regardless of whether it was
intended.)

Setting `selectAllOnIndeterminate` where the header control does not render — in
single mode, or with `showSelectAll: false` — logs a development error, since the
policy governs exactly that one control. The check keys off the caller having _set_
the member rather than off its resolved value, because with a `true` default a
resolved-value check would fire for every single-mode grid.

**Fix, and a second behavior change: the row checkbox now isolates event
propagation.** `DataTableViewProps.onRowClick` has always documented that
"interactive descendants that stop propagation (checkboxes, action buttons) do not
trigger it". That was true of the actions cell and the detail expander but not of
the selection checkbox, so ticking a row's box also ran the row-click handler and,
with roving focus on, moved the current row. It no longer does. If you were relying
on a checkbox click to reach `rowInteraction.onClick` (or the deprecated
`onRowClick`), read the selection change from `callbacks.onSelectionChange`
instead — it reports the transition the checkbox actually caused.

The selection cell now wraps its checkbox in a `<span class="contents">` to carry
that isolation. It has `display: contents`, so it generates no box and the cell's
layout is unchanged — but it is a new node, so a DOM query for the cell's first
element child now finds the span rather than the checkbox. The handler cannot go on
the checkbox itself: Base UI renders the visible `<span role="checkbox">` and a
hidden native `<input>` as siblings, and activating the box dispatches a click from
the input, which does not pass through the box.

**None of the three members has a deprecated flat alias**, and that is a limit of
the alias form rather than an omission: `selectable` / `selectionMode` /
`isRowSelectable` are flat and carry no place for a policy flag. A caller on the
aliases migrates to the grouped `selection` config to reach any of them, which also
brings `getRowId` with it under the identity rule.
