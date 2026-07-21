# FittedActions

A responsive action row with automatic overflow. Actions render inline in
priority order; when they don't fit the available width, the trailing ones
collapse into a "More" dropdown, recomputed on resize. React reimplementation of
the ui-kit Vue `AvFittedActions`.

Design-pending v1 — themed from semantic/Button tokens; reconcile with
`/figma-component FittedActions <url> --update` once a mockup lands.

## When to use

- A space-constrained action cluster that must degrade gracefully — a table row's
  actions, a card footer, a **Toolbar** action group.
- Anywhere the number of actions may exceed the available width.

## When not to use

- A fixed, always-visible set of actions that never overflows — use `Button` /
  `ButtonGroup`.
- A full menu button on its own — use `ButtonMenu` / `ButtonMenuDropdown`.

## Parts

FittedActions is **config-driven** (an `actions` array), not composed from
exported sub-parts. Conceptually it renders:

| Concept       | Element  | Purpose                                         |
| ------------- | -------- | ----------------------------------------------- |
| action        | `button` | An inline action (default a ghost `Button`).    |
| more-trigger  | `button` | Opens the overflow menu when actions don't fit. |
| overflow-menu | `div`    | `ButtonMenuDropdown` of the overflowed actions. |

## Example

```tsx
import { FittedActions } from '@constructor-lab/ui-react';

<FittedActions
  actions={[
    { id: 'edit', label: 'Edit', onSelect: onEdit },
    { id: 'tag', label: 'Tag', onSelect: onTag },
    { id: 'export', label: 'Export', onSelect: onExport },
    { id: 'delete', label: 'Delete', divided: true, onSelect: onDelete },
  ]}
  onAction={(action) => console.log('chose', action.id)}
/>;
```

Customize rendering with `renderAction` / `renderTrigger` — e.g. the Toolbar
passes a roving `ToolbarButton` and a secondary `ButtonMenu` trigger. Set
`showDropdown={false}` to keep every action inline.
