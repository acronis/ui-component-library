# Toolbar

A horizontal action bar for a selection / list context — a `role="toolbar"`
container (Base UI Toolbar) with roving-tabindex keyboard navigation. A left
cluster of ghost actions sits opposite a right cluster carrying a status label
and optional trailing actions.

## When to use

- Bulk / selection actions over a list, table, or grid ("6 items selected: …").
- A compact row of related actions that should share one keyboard tab stop.

## When not to use

- A page's primary heading actions — use `PageHeader` actions.
- Top-level app navigation — use `SidebarPrimary` / `NavigationMenu`.
- A single button or a plain button row with no roving-focus grouping — use
  `Button` / `ButtonGroup`.

## Parts

| Export             | Element             | Purpose                                             |
| ------------------ | ------------------- | --------------------------------------------------- |
| `Toolbar`          | `div[role=toolbar]` | Root; roving-tabindex container.                    |
| `ToolbarGroup`     | `div`               | Clusters items; `ms-auto` pushes one to the right.  |
| `ToolbarActions`   | `div`               | Width-aware action list; overflow → "More actions". |
| `ToolbarButton`    | `button`            | Ghost action button.                                |
| `ToolbarLink`      | `a`                 | Ghost action rendered as a link.                    |
| `ToolbarSeparator` | `div`               | Optional vertical divider.                          |
| `ToolbarStatus`    | `span`              | Non-interactive status / count label.               |

## Example

```tsx
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarStatus,
} from '@constructor-lab/ui-react';

<Toolbar aria-label="Selection actions" disabled={selection.length === 0}>
  <ToolbarGroup>
    <ToolbarButton onClick={onEdit}>Edit</ToolbarButton>
    <ToolbarButton onClick={onExport}>Export</ToolbarButton>
  </ToolbarGroup>
  <ToolbarGroup className="ms-auto">
    <ToolbarStatus>{selection.length} items selected:</ToolbarStatus>
    <ToolbarButton onClick={onDeselect}>Deselect</ToolbarButton>
  </ToolbarGroup>
</Toolbar>;
```

The `disabled` prop maps to the Figma `state` (active | disabled); actions reuse
the Button `ghost` tokens, so no Toolbar-specific token tier exists.

## Responsive overflow

For a width-constrained toolbar, use `ToolbarActions` (config-driven) instead of
hand-placed `ToolbarButton`s. It measures its slot and moves the trailing actions
that don't fit into a "More actions" menu (Figma breakpoints node 6262-28276),
recomputing on resize:

```tsx
import {
  Toolbar,
  ToolbarActions,
  ToolbarGroup,
  ToolbarStatus,
} from '@constructor-lab/ui-react';

<Toolbar aria-label="Selection actions">
  <ToolbarActions
    actions={[
      { id: 'edit', label: 'Edit', onSelect: onEdit },
      { id: 'tag', label: 'Tag', onSelect: onTag },
      { id: 'export', label: 'Export', onSelect: onExport },
      { id: 'delete', label: 'Delete', onSelect: onDelete },
    ]}
  />
  <ToolbarGroup className="ms-auto shrink-0">
    <ToolbarStatus>6 items selected:</ToolbarStatus>
  </ToolbarGroup>
</Toolbar>;
```
