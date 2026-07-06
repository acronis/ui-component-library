import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `MenuItemProps`,
// `MenuContentProps`, and `MenuSubmenuTriggerProps` in menu.tsx each extend a
// Base UI primitive's own props (`Menu.Item`, `Menu.Popup`,
// `Menu.SubmenuTrigger`), which expand to a large, noisy table of inherited
// DOM attributes/event handlers; this companion documents only the props
// callers set directly. (The runtime types live in menu.tsx; this file is
// never bundled.)

/** Props for `MenuItem` — a single interactive row in the menu. */
export interface MenuItemProps {
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
  /** Whether the item should ignore user interaction. */
  disabled?: boolean;
  /** Extra classes merged onto the item. */
  className?: string;
  children?: React.ReactNode;
}

/** Props for `MenuContent` (and `MenuSubmenuContent`) — the positioned, portaled menu popup. */
export interface MenuContentProps {
  /** Which side of the trigger to render on. Defaults to `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';
  /** Alignment along the chosen side. */
  align?: 'start' | 'center' | 'end';
  /** Distance in px from the trigger. Defaults to `4`. */
  sideOffset?: number;
  /**
   * Render inside a portal (default `true`). Disable only when you supply your
   * own `MenuPortal` ancestor.
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the popup. */
  className?: string;
  children?: React.ReactNode;
}

/** Props for `MenuSubmenuTrigger` — a row that opens a nested `MenuSubmenuContent`. */
export interface MenuSubmenuTriggerProps {
  /** Leading icon, rendered before the label at 16px in the item icon color. */
  icon?: React.ReactNode;
  /** Pad the label to align with checkbox/radio items in the same panel. */
  inset?: boolean;
  /** Whether the component should ignore user interaction. */
  disabled?: boolean;
  /** Whether the submenu should also open when the trigger is hovered. */
  openOnHover?: boolean;
  /** Extra classes merged onto the item. */
  className?: string;
  children?: React.ReactNode;
}
