# Toolbar — behavior

Toolbar is a `role="toolbar"` container (Base UI Toolbar) that groups related
actions with roving-tabindex keyboard navigation. It composes ghost action
buttons/links, an optional divider, and a non-interactive status label.

```gherkin
Scenario: Roving tabindex
  Given a Toolbar with several actions
  Then only the first action is in the page tab order (tabindex="0")
  And the remaining actions have tabindex="-1"

Scenario: Arrow-key navigation
  Given focus is on the first action of a horizontal Toolbar
  When the user presses ArrowRight
  Then focus moves to the next action
  And ArrowLeft moves it back (Home/End jump to the first/last)

Scenario: Focus wrap
  Given loopFocus is true (default) and focus is on the last action
  When the user presses ArrowRight
  Then focus wraps to the first action

Scenario: Disabled toolbar
  Given a Toolbar with `disabled`
  Then every action is greyed and reports aria-disabled="true"
  And activating an action does nothing
  But the actions remain focusable so they can still be discovered

Scenario: Selection status
  Given a selection is active
  Then the trailing group shows the selection count ("N items selected:")
  And a "Deselect" action (and/or a "More actions" menu) beside it
  When there is no selection
  Then the toolbar is disabled and shows an item-count status instead

Scenario: Responsive overflow (ToolbarActions)
  Given a ToolbarActions list whose actions do not all fit its width
  Then the trailing overflow actions move into a "More actions" menu
  And only the leading actions that fit are shown inline
  When the available width grows (e.g. a sidebar collapses)
  Then actions return inline from the menu until they no longer fit
  And when everything fits, no "More actions" trigger is shown
```
