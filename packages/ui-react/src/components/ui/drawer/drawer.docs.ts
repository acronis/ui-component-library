import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. `Drawer` and its parts
// extend Base UI's `Drawer` primitive props, which expand to a large, noisy
// table; this companion documents only the props callers set directly. (The
// runtime types live in drawer.tsx; this file is never bundled.)

/** Props for the root `Drawer` — owns open state and the edge. */
export interface DrawerProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /**
   * Screen edge the panel anchors to and slides in from: `top` · `bottom`
   * (default) · `left` · `right`. Mapped to Base UI's `swipeDirection` and
   * shared with `DrawerContent` for positioning.
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Modal behavior — traps focus and locks background scroll while open.
   * `'trap-focus'` keeps the focus trap but allows background interaction.
   * Default `true`.
   */
  modal?: boolean | 'trap-focus';
  /** Fires when the drawer opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
  children?: React.ReactNode;
}

/** Props for `DrawerContent` — the portaled, edge-anchored sliding panel. */
export interface DrawerContentProps {
  /** Edge the panel anchors to. Falls back to the root `Drawer` `side`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Render the content inside a portal (default `true`). Disable only when you
   * supply your own `DrawerPortal` ancestor (e.g. inline usage).
   */
  portal?: boolean;
  /**
   * Portal container. Pass a shadow-root mount for isolated-style previews
   * (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed. */
  keepMounted?: boolean;
  /** Extra classes merged onto the panel. */
  className?: string;
  children?: React.ReactNode;
}
