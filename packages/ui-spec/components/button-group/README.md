# ButtonGroup

Groups adjacent buttons (and related controls) into a single **segmented unit** —
the shared inner edges collapse so they read as one control. Ported from
`ui-legacy` as a **design-pending v1** (no Figma node yet; reconcile with
`/figma-component ButtonGroup <url> --update` when mockups land).

## When to use

- A set of related actions that belong together (a pager, a view switcher, a
  toolbar cluster).
- An input paired with a static prefix/suffix addon (`https://` + a field).

## When not to use

- **A single-select segmented value** (pick one of N) → use `ToggleGroup`.
- **A menu of actions behind one trigger** → use `ButtonMenu` / `DropdownMenu`.
- **Unrelated buttons** — only group buttons that form one logical unit.

## Parts

| Part                   | Element                 | Role                                                    |
| ---------------------- | ----------------------- | ------------------------------------------------------- |
| `ButtonGroup`          | `<div role="group">`    | Root; collapses children's shared edges. `orientation`. |
| `ButtonGroupText`      | `<div>` (`render`-able) | Static muted/bordered label or icon addon.              |
| `ButtonGroupSeparator` | `Separator`             | Divider between items (vertical by default).            |

## Examples

```tsx
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  Button,
} from '@spec-lab/ui-react';

// Segmented actions
<ButtonGroup>
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>

// With a text addon
<ButtonGroup>
  <ButtonGroupText>https://</ButtonGroupText>
  <Button variant="secondary">example.com</Button>
</ButtonGroup>

// Vertical, with a separator
<ButtonGroup orientation="vertical">
  <Button variant="secondary">Copy</Button>
  <ButtonGroupSeparator orientation="horizontal" />
  <Button variant="secondary">Paste</Button>
</ButtonGroup>
```
