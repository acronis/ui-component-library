// ButtonMenuDropdown — the open dropdown surface a `ButtonMenu` reveals (Figma
// node 3116:60887). It is a thin alias of the canonical `Menu` component: the
// parts render identically and share the `--ui-button-menu-dropdown-*` token
// tier `Menu` is styled from (that tier is named for this component). This
// module only re-exports `Menu`'s parts under the `ButtonMenuDropdown*` names
// and keeps its own tests, stories, spec, and Figma Code Connect.
//
// DEFERRED (Figma optionals, tracked in the spec): the `hasSearch` search field.
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuPortal,
  MenuSection,
  MenuSubmenu,
  MenuSubmenuContent,
  MenuSubmenuTrigger,
  MenuTrigger,
  type MenuContentProps,
  type MenuItemProps,
  type MenuSubmenuTriggerProps,
} from '../menu';

const ButtonMenuDropdown = Menu;
const ButtonMenuDropdownTrigger = MenuTrigger;
const ButtonMenuDropdownPortal = MenuPortal;
const ButtonMenuDropdownContent = MenuContent;
const ButtonMenuDropdownSection = MenuSection;
const ButtonMenuDropdownItem = MenuItem;
const ButtonMenuDropdownSubmenu = MenuSubmenu;
const ButtonMenuDropdownSubmenuTrigger = MenuSubmenuTrigger;
const ButtonMenuDropdownSubmenuContent = MenuSubmenuContent;

export type ButtonMenuDropdownContentProps = MenuContentProps;
export type ButtonMenuDropdownItemProps = MenuItemProps;
export type ButtonMenuDropdownSubmenuTriggerProps = MenuSubmenuTriggerProps;

export {
  ButtonMenuDropdown,
  ButtonMenuDropdownTrigger,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownItem,
  ButtonMenuDropdownPortal,
  ButtonMenuDropdownSubmenu,
  ButtonMenuDropdownSubmenuTrigger,
  ButtonMenuDropdownSubmenuContent,
};
