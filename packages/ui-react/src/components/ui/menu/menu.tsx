import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { CheckIcon, ChevronRightIcon } from '@spec-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// The canonical Base UI Menu wrapper for the kit: a composable set of parts
// (Root, Trigger, Portal, Content, Group/Section, Item, Submenu, checkbox/radio
// items, label, separator, shortcut) built on the Base UI Menu primitive
// (positioning, focus management, typeahead, outside-press / Esc dismissal,
// ARIA). It is themed from the dedicated `--ui-button-menu-dropdown-*` token
// tier (@spec-lab/tokens): a bordered panel (container tokens) holds one or more
// sections (top divider from the section tokens on non-first sections) of items.
// Each item wires its interaction states to its own token: idle ->
// `*-item-container-color-idle`, `data-[highlighted]` (Base UI sets this on
// pointer hover AND keyboard nav) -> `*-item-container-color-hover`, `active:`
// (press) -> `*-item-container-color-active`.
//
// Per-role icon colors: the leading `icon` and the checkbox/radio indicators use
// `*-item-icon-color`, the trailing cascade chevron uses
// `*-extras-cascade-icon-color`, and the shortcut label uses
// `*-extras-shortcut-label-color`. Because a blanket `[&_svg]` color rule on the
// item would out-specify a trailing icon's own color (descendant selector wins),
// the item sets only svg *size* globally and colors each icon at its own site.
//
// `ButtonMenuDropdown` and `DropdownMenu` are thin aliases of these parts
// (see their modules) — they render identically and differ only in name/spec.
//
// DEFERRED (Figma optionals, tracked in the spec): the `hasSearch` search field.

const Menu = MenuPrimitive.Root;
const MenuTrigger = MenuPrimitive.Trigger;
const MenuPortal = MenuPrimitive.Portal;
const MenuGroup = MenuPrimitive.Group;
const MenuRadioGroup = MenuPrimitive.RadioGroup;
const MenuSubmenu = MenuPrimitive.SubmenuRoot;

const popupClassName =
  'z-50 flex min-w-[8rem] flex-col gap-[var(--ui-button-menu-dropdown-container-gap)] overflow-hidden rounded-[var(--ui-button-menu-dropdown-container-border-radius)] border [border-width:var(--ui-button-menu-dropdown-container-border-width)] border-[color:var(--ui-button-menu-dropdown-container-border-color)] bg-[var(--ui-button-menu-dropdown-container-color)] px-[var(--ui-button-menu-dropdown-container-padding-x)] py-[var(--ui-button-menu-dropdown-container-padding-y)] outline-none duration-200 data-[open]:animate-in data-[closed]:animate-out data-[open]:fade-in-0 data-[closed]:fade-out-0 data-[open]:zoom-in-95 data-[closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2';

export interface MenuContentProps
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

const MenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  MenuContentProps
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
MenuContent.displayName = 'MenuContent';

const sectionClassName =
  'flex flex-col gap-[var(--ui-button-menu-dropdown-section-list-gap)] border-t [border-top-width:var(--ui-button-menu-dropdown-section-container-border-width)] border-[color:var(--ui-button-menu-dropdown-section-container-border-color)] px-[var(--ui-button-menu-dropdown-section-container-padding-x)] py-[var(--ui-button-menu-dropdown-section-container-padding-y)] first:border-t-0';

const MenuSection = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Group
    ref={ref}
    className={cn(sectionClassName, className)}
    {...props}
  />
));
MenuSection.displayName = 'MenuSection';

const itemClassName =
  'relative flex min-h-[var(--ui-button-menu-dropdown-item-container-height)] cursor-default select-none items-center gap-[var(--ui-button-menu-dropdown-item-container-gap)] whitespace-nowrap px-[var(--ui-button-menu-dropdown-item-container-padding-x)] py-[var(--ui-button-menu-dropdown-item-container-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-button-menu-dropdown-item-label-color)] outline-none transition-colors bg-[var(--ui-button-menu-dropdown-item-container-color-idle)] data-[highlighted]:bg-[var(--ui-button-menu-dropdown-item-container-color-hover)] active:bg-[var(--ui-button-menu-dropdown-item-container-color-active)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export interface MenuItemProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  /** Leading icon, rendered before the label at 16px in the item icon color. */
  icon?: React.ReactNode;
  /** Trailing keyboard-shortcut hint (e.g. `⌘C`), muted via the extras token. */
  shortcut?: React.ReactNode;
  /**
   * Show a trailing cascade chevron indicating a nested submenu. Indicator only;
   * use `MenuSubmenuTrigger` for a live nested menu.
   */
  cascade?: boolean;
  /** Pad the label to align with checkbox/radio items in the same panel. */
  inset?: boolean;
}

const MenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  MenuItemProps
>(({ className, icon, shortcut, cascade, inset, children, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(itemClassName, inset && 'ps-8', className)}
    {...props}
  >
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
MenuItem.displayName = 'MenuItem';

export interface MenuSubmenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger> {
  /** Leading icon, rendered before the label at 16px in the item icon color. */
  icon?: React.ReactNode;
  /** Pad the label to align with checkbox/radio items in the same panel. */
  inset?: boolean;
}

const MenuSubmenuTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.SubmenuTrigger>,
  MenuSubmenuTriggerProps
>(({ className, icon, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
    ref={ref}
    className={cn(
      itemClassName,
      inset && 'ps-8',
      // Keep the row in the hover state while its submenu is open.
      'data-[popup-open]:bg-[var(--ui-button-menu-dropdown-item-container-color-hover)]',
      className
    )}
    {...props}
  >
    {icon != null && (
      <span className="flex shrink-0 items-center text-[var(--ui-button-menu-dropdown-item-icon-color)]">
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate">{children}</span>
    <ChevronRightIcon className="ms-auto shrink-0 rtl:rotate-180 text-[var(--ui-button-menu-dropdown-extras-cascade-icon-color)]" />
  </MenuPrimitive.SubmenuTrigger>
));
MenuSubmenuTrigger.displayName = 'MenuSubmenuTrigger';

// A submenu's panel is a nested Menu.Popup — Base UI positions it to the
// `inline-end` side automatically — so it reuses the root content wrapper.
const MenuSubmenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  MenuContentProps
>((props, ref) => <MenuContent ref={ref} {...props} />);
MenuSubmenuContent.displayName = 'MenuSubmenuContent';

const indicatorItemClassName =
  'relative flex min-h-[var(--ui-button-menu-dropdown-item-container-height)] cursor-default select-none items-center gap-[var(--ui-button-menu-dropdown-item-container-gap)] whitespace-nowrap ps-8 pe-[var(--ui-button-menu-dropdown-item-container-padding-x)] py-[var(--ui-button-menu-dropdown-item-container-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-button-menu-dropdown-item-label-color)] outline-none transition-colors bg-[var(--ui-button-menu-dropdown-item-container-color-idle)] data-[highlighted]:bg-[var(--ui-button-menu-dropdown-item-container-color-hover)] active:bg-[var(--ui-button-menu-dropdown-item-container-color-active)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

const MenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(indicatorItemClassName, className)}
    {...props}
  >
    <span className="absolute start-2 flex size-3.5 items-center justify-center text-[var(--ui-button-menu-dropdown-item-icon-color)]">
      <MenuPrimitive.CheckboxItemIndicator>
        <CheckIcon className="size-4" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
));
MenuCheckboxItem.displayName = 'MenuCheckboxItem';

const MenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={cn(indicatorItemClassName, className)}
    {...props}
  >
    <span className="absolute start-2 flex size-3.5 items-center justify-center text-[var(--ui-button-menu-dropdown-item-icon-color)]">
      <MenuPrimitive.RadioItemIndicator>
        <span className="size-2 rounded-full bg-current" />
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
));
MenuRadioItem.displayName = 'MenuRadioItem';

const MenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-[var(--ui-button-menu-dropdown-item-container-padding-x)] py-[var(--ui-button-menu-dropdown-item-container-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-button-menu-dropdown-item-label-color)]',
      inset && 'ps-8',
      className
    )}
    {...props}
  />
));
MenuLabel.displayName = 'MenuLabel';

const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      'my-[var(--ui-button-menu-dropdown-section-list-gap)] h-[var(--ui-button-menu-dropdown-section-container-border-width)] bg-[var(--ui-button-menu-dropdown-section-container-border-color)]',
      className
    )}
    {...props}
  />
));
MenuSeparator.displayName = 'MenuSeparator';

function MenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'ms-auto shrink-0 text-[var(--ui-button-menu-dropdown-extras-shortcut-label-color)]',
        className
      )}
      {...props}
    />
  );
}
MenuShortcut.displayName = 'MenuShortcut';

export {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuContent,
  MenuGroup,
  MenuSection,
  MenuItem,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuSubmenuContent,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
};
