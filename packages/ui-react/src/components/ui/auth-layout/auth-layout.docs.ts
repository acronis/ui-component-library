import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The AuthLayout parts all
// extend `React.HTMLAttributes<HTMLDivElement>`, which expands to every div DOM
// attribute — a large, noisy table with no component-specific props. This
// companion documents the props callers actually set on the root. (The runtime
// types live in auth-layout.tsx; this file is never bundled.) The sub-parts
// (`AuthLayoutCard`, `AuthLayoutLogo`, `AuthLayoutFooter`) take plain HTML div
// attributes.

/** Props for `AuthLayout` — the full-page centered auth layout root. */
export interface AuthLayoutProps {
  /** Extra classes merged onto the root `<div>`. */
  className?: string;
  /** The composed content (typically a single `AuthLayoutCard`). */
  children?: React.ReactNode;
}
