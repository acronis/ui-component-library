# FittedActions — behavior

FittedActions renders a row of actions and moves the ones that don't fit into a
"More" dropdown, recomputing whenever its width changes.

```gherkin
Scenario: Everything fits
  Given actions whose total width is within the container
  Then all actions render inline
  And no "More" trigger is shown

Scenario: Overflow
  Given actions wider than the container (and showDropdown is true)
  Then only the leading actions that fit render inline
  And the trailing actions move into the "More" dropdown menu

Scenario: Resize
  Given some actions have overflowed
  When the container grows (e.g. a sidebar collapses)
  Then actions return inline from the menu until they no longer fit
  When the container shrinks
  Then more actions collapse into the menu

Scenario: Choosing an action
  When an inline action is clicked or a menu item is selected
  Then the action's `onSelect` runs, then the component's `onAction` fires

Scenario: Conditional actions
  Given an action with `isDisplayed: false`
  Then it is omitted entirely — inline and from the menu

Scenario: Overflow disabled
  Given `showDropdown` is false
  Then every action renders inline and none collapse into a menu

Scenario: Before measurement (SSR / hidden / first paint)
  Given the container width cannot be read yet
  Then every action renders inline (rather than collapsing all into the menu)
```
