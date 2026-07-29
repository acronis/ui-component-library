'use client';

import * as React from 'react';

const PortalContainerContext = React.createContext<
  HTMLElement | null | undefined
>(undefined);

export interface PortalContainerProviderProps {
  /**
   * The DOM element portaled content should render into (e.g. a `<div>` inside
   * a shadow root). When set, every ui-react portaling component (`Dialog`,
   * `AlertDialog`, `Popover`, `Tooltip`, `Menu`, `Select`, `Combobox`,
   * `Autocomplete`, `Drawer`, `Sheet`, `Toast`, `Tour`, `NavigationMenu`)
   * mounts its popup inside this element instead of `document.body`.
   */
  container: HTMLElement | null;
  children: React.ReactNode;
}

/**
 * Provides a default portal container for all ui-react portaling components.
 *
 * Wrap your app (or a subtree) once so that popups, dialogs, tooltips, toasts,
 * etc. render inside the given container instead of `document.body`. This is
 * the recommended way for shadow-DOM micro-frontends to keep portaled content
 * inside the shadow root, where adopted stylesheets apply.
 *
 * A component's own `portalContainer` prop still overrides this context, so the
 * provider is a non-breaking default rather than a hard override.
 *
 * @example
 * ```tsx
 * // Inside a shadow-DOM MFE — all portals go into the shadow root mount point
 * <PortalContainerProvider container={shadowRootMountDiv}>
 *   <App />
 * </PortalContainerProvider>
 * ```
 */
export function PortalContainerProvider({
  container,
  children,
}: PortalContainerProviderProps) {
  return (
    <PortalContainerContext value={container}>
      {children}
    </PortalContainerContext>
  );
}

/**
 * Returns the portal container set by the nearest `PortalContainerProvider`, or
 * `undefined` if there is none (letting Base UI fall back to `document.body`).
 */
export function usePortalContainer(): HTMLElement | null | undefined {
  return React.use(PortalContainerContext);
}
