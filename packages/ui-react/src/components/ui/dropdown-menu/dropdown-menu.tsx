// DropdownMenu — a menu of actions anchored to a trigger. It is a thin alias of
// the canonical `Menu` component: the parts render identically and share the
// `--ui-button-menu-dropdown-*` token tier `Menu` is styled from. This module
// re-exports `Menu`'s parts under the legacy shadcn `DropdownMenu*` names (with
// `Sub*` mapping to `Menu`'s `Submenu*`) and keeps its own tests, stories, spec,
// and Figma Code Connect. Reconcile with `/figma-component DropdownMenu <url>
// --update` once a mockup lands.
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSubmenu,
  MenuSubmenuContent,
  MenuSubmenuTrigger,
  MenuTrigger,
  type MenuContentProps,
} from '../menu';

const DropdownMenu = Menu;
const DropdownMenuTrigger = MenuTrigger;
const DropdownMenuPortal = MenuPortal;
const DropdownMenuContent = MenuContent;
const DropdownMenuGroup = MenuGroup;
const DropdownMenuItem = MenuItem;
const DropdownMenuCheckboxItem = MenuCheckboxItem;
const DropdownMenuRadioGroup = MenuRadioGroup;
const DropdownMenuRadioItem = MenuRadioItem;
const DropdownMenuLabel = MenuLabel;
const DropdownMenuSeparator = MenuSeparator;
const DropdownMenuShortcut = MenuShortcut;
const DropdownMenuSub = MenuSubmenu;
const DropdownMenuSubContent = MenuSubmenuContent;
const DropdownMenuSubTrigger = MenuSubmenuTrigger;

export type DropdownMenuContentProps = MenuContentProps;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
