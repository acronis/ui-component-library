# Drawer — behavior

Drawer is an edge-anchored panel with swipe-to-dismiss, built on the Base UI
Drawer primitive (which extends Dialog). It owns one piece of state, `open`;
`side` chooses the edge and the swipe direction.

```gherkin
Scenario: Open from a trigger
  Given a Drawer with a DrawerTrigger
  When the user activates the trigger
  Then the panel slides in from its side and the backdrop covers the page
  And open-change(true) is emitted
```

```gherkin
Scenario: Side
  Given a Drawer with side="right"
  Then the panel anchors to the right edge, slides in from the right, and a
  rightward swipe dismisses it
  (bottom is the default; top/bottom are full-width, left/right full-height)
```

```gherkin
Scenario: Dismiss by pointer / keyboard
  Given an open Drawer
  When the user clicks the close button, presses Esc, or clicks the backdrop
  Then the panel slides out and open-change(false) is emitted
```

```gherkin
Scenario: Dismiss by swipe
  Given an open Drawer with side="bottom"
  When the user drags the panel downward past the release threshold
  Then the panel follows the drag (via --drawer-swipe-movement-y), then slides out
  And open-change(false) is emitted
```

```gherkin
Scenario: Controlled
  Given a Drawer with a controlled `open` prop
  When a dismiss interaction occurs
  Then open-change is emitted but the panel stays until the consumer updates `open`
```

```gherkin
Scenario: Focus + scroll
  Given an open modal Drawer
  Then focus is trapped within the panel and background scroll is locked
  And focus returns to the trigger on close
```
