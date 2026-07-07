import type * as React from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The PageHeader parts all
// extend `React.HTMLAttributes<…>`, which expands to every DOM attribute — a
// large, noisy table with no component-specific props. This companion documents
// the props callers actually set on the root. (The runtime types live in
// page-header.tsx; this file is never bundled.) Every part
// (`PageHeaderBreadcrumb`, `PageHeaderRow`, `PageHeaderTitle`,
// `PageHeaderDescription`, `PageHeaderActions`) takes the standard attributes of
// the element it renders.

/** Props for `PageHeader` — the page header region root (`role="banner"`). */
export interface PageHeaderProps {
  /** Extra classes merged onto the root `<div>`. */
  className?: string;
  /** The composed header parts (breadcrumb / row / description). */
  children?: React.ReactNode;
}
