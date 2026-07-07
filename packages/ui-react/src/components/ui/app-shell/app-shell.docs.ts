import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The AppShell parts all
// extend `React.HTMLAttributes<…>`, which expands to every DOM attribute — a
// large, noisy table with no component-specific props. This companion documents
// the props callers actually set on the root. (The runtime types live in
// app-shell.tsx; this file is never bundled.) Every part
// (`AppShellSidebar`, `AppShellBody`, `AppShellHeader`, `AppShellMain`,
// `AppShellFooter`) takes the standard attributes of the element it renders.

/** Props for `AppShell` — the full-page layout root. */
export interface AppShellProps {
  /** Extra classes merged onto the root `<div>`. */
  className?: string;
  /** The composed layout regions (sidebar + body). */
  children?: React.ReactNode;
}
