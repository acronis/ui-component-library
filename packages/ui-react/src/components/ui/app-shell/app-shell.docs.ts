import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The AppShell parts all
// extend `React.HTMLAttributes<…>`, which expands to every DOM attribute — a
// large, noisy table with no component-specific props. This companion documents
// the props callers actually set on the root. (The runtime types live in
// app-shell.tsx; this file is never bundled.) Every part
// (`AppShellSidebar`, `AppShellBody`, `AppShellHeader`, `AppShellMain`,
// `AppShellFooter`, `AppShellPanel`) takes the standard attributes of the
// element it renders.

/** Props for `AppShell` — the full-page layout root. */
export interface AppShellProps {
  /** Extra classes merged onto the root `<div>`. */
  className?: string;
  /** The composed layout regions (sidebar + body + optional right-hand panel). */
  children?: React.ReactNode;
  /**
   * Controlled state of the right-hand AI/chat panel:
   * `'docked'` (fixed rail) · `'collapsed'` (icon rail) · `'full'` (fills the
   * body, which hides). Omit for uncontrolled — see `defaultPanelState`.
   */
  panelState?: 'docked' | 'collapsed' | 'full';
  /** Uncontrolled initial panel state. Defaults to `'docked'`. */
  defaultPanelState?: 'docked' | 'collapsed' | 'full';
  /** Fires when the panel state changes (e.g. an `AppShellPanelTrigger`). */
  onPanelStateChange?: (state: 'docked' | 'collapsed' | 'full') => void;
}
