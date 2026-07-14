# Menu

The canonical composable menu: a trigger plus a portaled popup of one or more
groups/sections of items — actions with optional leading icon / trailing
shortcut / cascade chevron, checkbox items, radio items, labels, separators,
and cascaded submenus. Built on the Base UI Menu primitive and themed by the
shared `--ui-button-menu-dropdown-*` token tier.

> **Status: draft (design-pending).** `Menu` is the underlying implementation
> for `ButtonMenuDropdown` and `DropdownMenu`, which are now thin aliases of
> its parts (they render identically and share this same token tier). This
> spec documents the full composable contract; reconcile with
> `/figma-component Menu <url> --update` once a dedicated mockup lands.

## When to use

- To present the actions/options a trigger reveals — a compact panel of menu
  items, optionally grouped into divided sections.
- Toggle/choice options (checkbox / radio items) grouped under a trigger.
- A menu with one or more levels of cascaded submenus.

## When not to use

- Selecting one option that stays shown on the control — use **Select**.
- Secondary content or a form anchored to a trigger — use **Popover**.
- Primary page navigation — use a nav, not a menu.

## Example (React — implemented)

```tsx
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuSection,
  MenuItem,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuSubmenuContent,
} from '@constructor-lab/ui-react';
import {
  PencilIcon,
  FolderIcon,
} from '@constructor-lab/icons-react/stroke-mono';

<Menu>
  <MenuTrigger>Actions</MenuTrigger>
  <MenuContent>
    <MenuSection>
      <MenuItem icon={<PencilIcon />} shortcut="⌘R">
        Rename
      </MenuItem>
      <MenuSubmenu>
        <MenuSubmenuTrigger icon={<FolderIcon />}>Move to</MenuSubmenuTrigger>
        <MenuSubmenuContent>
          <MenuSection>
            <MenuItem>Documents</MenuItem>
          </MenuSection>
        </MenuSubmenuContent>
      </MenuSubmenu>
    </MenuSection>
  </MenuContent>
</Menu>;
```

Vue and Web Component implementations are planned against the same contract.

## Parts

| Part              | Element                   | Notes                                                    |
| ----------------- | ------------------------- | -------------------------------------------------------- |
| `trigger`         | `button`                  | Opens the panel                                          |
| `content`         | `div[role=menu]`          | The portaled, positioned panel                           |
| `group`           | `div[role=group]`         | Plain cluster of parts — no divider/padding              |
| `section`         | `div[role=group]`         | A group of items; non-first sections carry a top divider |
| `item`            | `div[role=menuitem]`      | An action row — label + optional icon/shortcut/cascade   |
| `checkbox-item`   | `[role=menuitemcheckbox]` | A toggle row with a check indicator                      |
| `radio-group`     | `div[role=group]`         | Wraps a set of mutually exclusive `radio-item`s          |
| `radio-item`      | `[role=menuitemradio]`    | A single-choice row with a dot indicator                 |
| `label`           | `div`                     | A non-interactive section heading                        |
| `separator`       | `div[role=separator]`     | A divider between groups of items                        |
| `shortcut`        | `span`                    | Standalone right-aligned keyboard-shortcut hint          |
| `submenu-trigger` | `div[role=menuitem]`      | Opens a nested submenu (trailing cascade chevron)        |
| `submenu`         | `div[role=menu]`          | The nested panel a submenu-trigger opens                 |

## Deferred (Figma optionals)

- **`hasSearch` search field** — the panel's optional search input is not
  built yet.
