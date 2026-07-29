# Table — behavior

Table is a composable, presentational table. It holds no row data, sorting,
filtering, selection, pagination, virtualization, persistence, or server state;
an owner drives the relevant props. DataTable is that owner for flexible grids,
and DataGrid configures DataTable for standard record screens.

Unless marked **Target**, a scenario describes the current React primitive.
Target P0/P1 scenarios are accepted by the parity design but are not shipped yet.

## Sorting

```gherkin
Scenario: A sortable header exposes its state
  Given a TableHead with sortable = true and sort-direction = false
  Then it renders an inactive sort icon and aria-sort = "none"
```

```gherkin
Scenario: [Target P0 — proposed-only] Multi-sort priority is presentational
  Given a sorted TableHead has direction descending and priority 2
  Then it renders a visible priority 2 indicator
  And its accessible description states "sorted descending, priority 2"
  And Table does not own the descriptor order
```

```gherkin
Scenario: [Target P1 — shipped legacy parity] Grouped headers retain native association
  Given a grouped column header spans two leaf columns
  When Table renders the supplied header structure
  Then the grouped header has colspan = 2 and scope = "colgroup"
  And each leaf header has scope = "col"
  And Table does not infer or own the column grouping
```

```gherkin
Scenario: Activating a sortable header
  Given a sortable TableHead with an onSort handler
  When the user clicks it (or focuses it and presses Enter / Space)
  Then the sort event fires
  And the consumer updates sort-direction, which swaps the icon (↑ asc / ↓ desc)
  and sets aria-sort to "ascending" / "descending"
```

## Column headers

```gherkin
Scenario: A header control sits outside the sort control
  Given a sortable column header with a resize handle supplied as trailing content
  When the user activates the handle by pointer or keyboard
  Then the handle receives the interaction and the column is not re-sorted
  And the sort control's accessible name does not include the handle's label
  And Table owns neither resizing nor the handle — it only guarantees the handle
    is not nested inside the sort control
```

```gherkin
Scenario: A header exposes an explanatory tooltip
  Given a TableHead whose label needs clarification or is truncated to fit its column
  When the user hovers or keyboard-focuses a tooltip trigger rendered inside the header
  Then a Tooltip reveals the full description or label
  And the trigger is a real focusable control with an accessible name
  And Table owns no tooltip state — the trigger is consumer composition in the header cell
```

## Selection

```gherkin
Scenario: A selected row
  Given a TableRow with selected = true
  Then it carries data-state="selected" and the active row background token
```

```gherkin
Scenario: Current is distinct from selected
  Given a TableRow with current = true and selected = false
  Then it exposes aria-current and the current visual state
  And it does not expose aria-selected
  And the two axes are independent, so current + selected is a legal fourth state
```

```gherkin
Scenario: Expanded state is presentation-only
  Given an owner supplies expanded = true for a row disclosure
  Then Table reflects the expanded data state on the row, for styling only
  And it does not put aria-expanded on the row, which is invalid outside a treegrid
  And the disclosure control carries aria-expanded and aria-controls instead
  And Table does not render, load, or toggle child/detail content by itself
  And when the row is also selected, the selected surface wins
```

```gherkin
Scenario: Row selection is consumer-driven
  Given a checkbox rendered inside a leading cell
  When the user toggles it
  Then the consumer updates the row's selected prop (Table does not manage it)
```

## Layout

```gherkin
Scenario: Overflow scrolls horizontally
  Given a table wider than its container
  When it renders
  Then the wrapping container scrolls horizontally, keeping the page intact
```

```gherkin
Scenario: Coordinated scroll container
  Given DataTable supplies a height (or max-height) and a scroll-container ref
  When content exceeds the available width or height
  Then the Table wrapper scrolls without breaking native table structure
  And the container reports itself bounded, which is the precondition for
    sticky sections and for windowed/virtual rendering
  And the owner can coordinate sticky headers and virtual presentation through
    the ref, the container class, and the container attributes
```

```gherkin
Scenario: An unbounded container cannot pin content
  Given a Table with neither height nor max-height
  Then the container is not bounded
  And a sticky header, sticky footer, or sticky row has nothing to pin against
  And Table reports the boundedness rather than inferring a height of its own
```

```gherkin
Scenario: The height constraint bounds the element that scrolls
  Given a bounded Table whose content exceeds the bound
  When it renders
  Then the constraint applies to the scrolling element, not only to the box drawn
    around it
  And `max-height` produces a scrolling element exactly as `height` does
  And the bounded report cannot disagree with the ability to scroll, because one
    constraint produces both
```

```gherkin
Scenario: Sticky sections replace the border that would scroll away
  Given a bounded Table whose header is sticky
  When the body scrolls under it
  Then the header keeps its position at the top of the scroll container
  And it paints the background surface the Table's background variant publishes
  And it draws its divider in the row-divider token, because a collapsed border
    is painted on the table's border grid and would scroll out of view
  And turning horizontal borders off removes that divider too
```

```gherkin
Scenario: Group rows pin below the column header
  Given a bounded Table with a sticky header and sticky group rows
  When the owner supplies each group row's offset
  Then each group row pins at that offset, below the column header
  And Table does not measure the header or own the group model
```

```gherkin
Scenario: A pinned column stays legible while the table scrolls sideways
  Given a header or data cell pinned to the start or end edge at an offset
  When the table scrolls horizontally
  Then the pinned cell stays at its edge and paints the sticky surface
  And a pinned header cell renders above the header cells that follow it
  And Table presents the pin only — the owner decides which columns are pinned
    and supplies the accumulated offset
```

```gherkin
Scenario: Granular borders are independent
  Given top, bottom, horizontal, and vertical border values
  Then each edge/direction renders its configured visibility or strength
  And enabling one dimension does not imply another
  And each strength (subtle / default / strong) resolves to its own token
  And omitting the configuration keeps the shipped row divider
```

```gherkin
Scenario: Density is applied from the root
  Given a Table with size = "small" (or "medium" / "large")
  Then every header and data cell takes that density
  And "medium" is the shipped metric set, so the default output is unchanged
  And Table changes no data or column decision to apply it
```

```gherkin
Scenario: Background surface variants
  Given a Table with background = "accent" (or "subtle" / "surface" / "transparent")
  Then the wrapper renders that token-resolved surface
  And the legacy transparent / solid-brand-accent / solid-brand-lightest /
    fixed-white values map onto those neutral variants
  And the same variant supplies the surface a sticky or pinned cell paints
  And Table changes no data, layout, or border decision to apply it
```

```gherkin
Scenario: Hiding the header is the owner's composition, not a Table property
  Given DataGrid resolves appearance.showHeader = false
  Then it omits the header section entirely
  And the column model, selection, and data-state behavior are unchanged
  And Table exposes no showHeader property — a header it is not given is a
    header it does not render
```

```gherkin
Scenario: Hover feedback
  Given a row in the body
  When the pointer is over it
  Then it takes the hover background token (unless selected, which wins)
```

## Boundary

```gherkin
Scenario: Table remains presentational
  Given an author needs data-driven filtering, selection, pagination, grouping, or virtualization
  Then those features are configured in DataTable or DataGrid
  And Table receives only markup, native attributes, callbacks, and visual state
```
