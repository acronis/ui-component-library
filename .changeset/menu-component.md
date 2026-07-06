---
'@spec-lab/ui-react': minor
---

Add a canonical `Menu` component and make `ButtonMenuDropdown` and `DropdownMenu` aliases of it.

`Menu` is the full Base UI Menu wrapper — `Menu`, `MenuTrigger`, `MenuPortal`, `MenuContent`, `MenuGroup`, `MenuSection`, `MenuItem` (`icon` / `shortcut` / `cascade` / `inset`), live cascaded submenus (`MenuSubmenu` / `MenuSubmenuTrigger` / `MenuSubmenuContent`), `MenuCheckboxItem`, `MenuRadioItem`, `MenuRadioGroup`, `MenuLabel`, `MenuSeparator`, `MenuShortcut` — styled from the `--ui-button-menu-dropdown-*` token tier.

- **`ButtonMenuDropdown`** re-exports `Menu`'s parts under the existing names and now gains **live submenus** (`ButtonMenuDropdownSubmenu` / `…SubmenuTrigger` / `…SubmenuContent`); the previous submenu deferral is lifted. Renders identically to before.
- **`DropdownMenu`** re-exports `Menu`'s parts (its full checkbox/radio/label/separator/shortcut/submenu API is preserved) and is now **restyled** from the shared `--ui-button-menu-dropdown-*` tokens instead of the generic semantic tokens — a visual change. Prefer the `shortcut` prop on `DropdownMenuItem` over a `DropdownMenuShortcut` child.
