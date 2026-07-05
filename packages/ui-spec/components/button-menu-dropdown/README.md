# ButtonMenuDropdown

The themed dropdown panel a **ButtonMenu** opens: a bordered surface of one or
more sections, each a list of menu items. An item is a label with optional
extras — a leading icon, a trailing keyboard-shortcut hint, and/or a trailing
cascade chevron. Built on the Base UI Menu primitive and themed by its dedicated
`--ui-button-menu-dropdown-*` token tier.

## When to use

- To present the actions/options a **ButtonMenu** trigger reveals — a compact
  panel of menu items, optionally grouped into divided sections.

## When not to use

- The trigger itself (the labelled chevron button) — use **ButtonMenu**.
- A general-purpose menu with checkbox/radio items, submenus, and the shared
  semantic theme — use **DropdownMenu**.
- Picking one option that stays shown on the control — use **Select**.

## Example (React — implemented)

```tsx
import {
  ButtonMenu,
  ButtonMenuDropdown,
  ButtonMenuDropdownTrigger,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownItem,
} from '@spec-lab/ui-react';
import { PencilIcon } from '@spec-lab/icons-react/stroke-mono';

<ButtonMenuDropdown>
  <ButtonMenuDropdownTrigger render={<ButtonMenu>Actions</ButtonMenu>} />
  <ButtonMenuDropdownContent>
    <ButtonMenuDropdownSection>
      <ButtonMenuDropdownItem icon={<PencilIcon />} shortcut="⌘R">
        Rename
      </ButtonMenuDropdownItem>
      <ButtonMenuDropdownItem cascade>Move to</ButtonMenuDropdownItem>
    </ButtonMenuDropdownSection>
    <ButtonMenuDropdownSection>
      <ButtonMenuDropdownItem disabled>Delete</ButtonMenuDropdownItem>
    </ButtonMenuDropdownSection>
  </ButtonMenuDropdownContent>
</ButtonMenuDropdown>;
```

Pair the trigger with a `ButtonMenu` via its `render` prop so the chevron and
`aria-expanded` reflect the panel's open state. Vue and Web Component
implementations are planned against the same contract.

## Parts

| Part      | Element  | Notes                                                       |
| --------- | -------- | ----------------------------------------------------------- |
| `trigger` | `button` | Opens the panel (usually a `ButtonMenu`)                    |
| `content` | `div`    | The portaled, positioned panel (`role="menu"`)              |
| `section` | `div`    | A group of items; non-first sections carry a top divider    |
| `item`    | `div`    | An action row (`role="menuitem"`) — label + optional extras |

## Deferred (Figma optionals)

- **`hasSearch` search field** — the panel's optional search input is not built
  yet.
- **Live submenu** — `cascade` renders the chevron indicator only; it does not
  wire a Base UI `SubmenuRoot` / `SubmenuTrigger`. Full submenu support is
  deferred.
