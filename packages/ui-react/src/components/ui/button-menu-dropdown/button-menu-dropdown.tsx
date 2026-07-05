import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { ChevronRightIcon } from '@spec-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonMenuDropdown" node (3116:60887): the open dropdown
// surface a `ButtonMenu` reveals. Built on the same Base UI Menu primitives as
// `dropdown-menu` (Root, Trigger, Positioner, Popup, Portal, Group, Item —
// positioning, focus management, typeahead, outside-press/Esc dismissal, ARIA),
// but themed from its OWN dedicated `--ui-button-menu-dropdown-*` token tier
// (@spec-lab/tokens) instead of the generic semantic tokens dropdown-menu uses.
// A bordered panel (container tokens) holds one or more sections (top divider
// from the section tokens on non-first sections) of items. Each item wires its
// interaction states to its own token: idle -> `*-item-container-color-idle`,
// `data-[highlighted]` (Base UI sets this on pointer hover AND keyboard nav) ->
// `*-item-container-color-hover`, `active:` (press) -> `*-item-container-color-active`.
//
// Per-role icon colors: the leading `icon` uses `*-item-icon-color`, the trailing
// cascade chevron uses `*-extras-cascade-icon-color`, and the shortcut label uses
// `*-extras-shortcut-label-color`. Because a blanket `[&_svg]` color rule on the
// item would out-specify a trailing icon's own color (descendant selector wins),
// the item sets only svg *size* globally and colors each icon at its own site.
//
// DEFERRED (Figma optionals, tracked in the README + spec):
//   • `hasSearch` search field — not built.
//   • `cascade` renders the chevron INDICATOR only; no live Base UI SubmenuRoot /
//     SubmenuTrigger is wired (full submenu deferred).

const ButtonMenuDropdown = MenuPrimitive.Root;
const ButtonMenuDropdownTrigger = MenuPrimitive.Trigger;
const ButtonMenuDropdownPortal = MenuPrimitive.Portal;

const popupClassName =
  'z-50 flex min-w-[8rem] flex-col gap-[var(--ui-button-menu-dropdown-container-gap)] overflow-hidden rounded-[var(--ui-button-menu-dropdown-container-border-radius)] border [border-width:var(--ui-button-menu-dropdown-container-border-width)] border-[color:var(--ui-button-menu-dropdown-container-border-color)] bg-[var(--ui-button-menu-dropdown-container-color)] px-[var(--ui-button-menu-dropdown-container-padding-x)] py-[var(--ui-button-menu-dropdown-container-padding-y)] outline-none duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2';

export interface ButtonMenuDropdownContentProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup> {
  side?: MenuPrimitive.Positioner.Props['side'];
  align?: MenuPrimitive.Positioner.Props['align'];
  sideOffset?: number;
  /** Render inside a portal (default `true`). */
  portal?: boolean;
  /** Portal container — pass a shadow-root mount for isolated-style previews. */
  portalContainer?: MenuPrimitive.Portal.Props['container'];
  keepMounted?: MenuPrimitive.Portal.Props['keepMounted'];
}

const ButtonMenuDropdownContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  ButtonMenuDropdownContentProps
>(
  (
    {
      className,
      side,
      align,
      sideOffset = 4,
      portal = true,
      portalContainer,
      keepMounted,
      ...props
    },
    ref
  ) => {
    const positioner = (
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <MenuPrimitive.Popup
          ref={ref}
          className={cn(popupClassName, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    );
    return portal ? (
      <MenuPrimitive.Portal container={portalContainer} keepMounted={keepMounted}>
        {positioner}
      </MenuPrimitive.Portal>
    ) : (
      positioner
    );
  }
);
ButtonMenuDropdownContent.displayName = 'ButtonMenuDropdownContent';

const sectionClassName =
  'flex flex-col gap-[var(--ui-button-menu-dropdown-section-list-gap)] border-t [border-top-width:var(--ui-button-menu-dropdown-section-container-border-width)] border-[color:var(--ui-button-menu-dropdown-section-container-border-color)] px-[var(--ui-button-menu-dropdown-section-container-padding-x)] py-[var(--ui-button-menu-dropdown-section-container-padding-y)] first:border-t-0';

const ButtonMenuDropdownSection = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Group
    ref={ref}
    className={cn(sectionClassName, className)}
    {...props}
  />
));
ButtonMenuDropdownSection.displayName = 'ButtonMenuDropdownSection';

const itemClassName =
  'relative flex min-h-[var(--ui-button-menu-dropdown-item-container-height)] cursor-default select-none items-center gap-[var(--ui-button-menu-dropdown-item-container-gap)] whitespace-nowrap px-[var(--ui-button-menu-dropdown-item-container-padding-x)] py-[var(--ui-button-menu-dropdown-item-container-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-button-menu-dropdown-item-label-color)] outline-none transition-colors bg-[var(--ui-button-menu-dropdown-item-container-color-idle)] data-[highlighted]:bg-[var(--ui-button-menu-dropdown-item-container-color-hover)] active:bg-[var(--ui-button-menu-dropdown-item-container-color-active)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export interface ButtonMenuDropdownItemProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  /** Leading icon, rendered before the label at 16px in the item icon color. */
  icon?: React.ReactNode;
  /** Trailing keyboard-shortcut hint (e.g. `⌘C`), muted via the extras token. */
  shortcut?: React.ReactNode;
  /**
   * Show a trailing cascade chevron indicating a nested submenu. Renders the
   * indicator only — the live submenu is not wired yet (deferred).
   */
  cascade?: boolean;
}

const ButtonMenuDropdownItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  ButtonMenuDropdownItemProps
>(({ className, icon, shortcut, cascade, children, ...props }, ref) => (
  <MenuPrimitive.Item ref={ref} className={cn(itemClassName, className)} {...props}>
    {icon != null && (
      <span className="flex shrink-0 items-center text-[var(--ui-button-menu-dropdown-item-icon-color)]">
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {shortcut != null && (
      <span className="ms-auto shrink-0 text-[var(--ui-button-menu-dropdown-extras-shortcut-label-color)]">
        {shortcut}
      </span>
    )}
    {cascade && (
      <ChevronRightIcon
        className={cn(
          'shrink-0 rtl:rotate-180 text-[var(--ui-button-menu-dropdown-extras-cascade-icon-color)]',
          shortcut == null && 'ms-auto'
        )}
      />
    )}
  </MenuPrimitive.Item>
));
ButtonMenuDropdownItem.displayName = 'ButtonMenuDropdownItem';

export {
  ButtonMenuDropdown,
  ButtonMenuDropdownTrigger,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownItem,
  ButtonMenuDropdownPortal,
};
