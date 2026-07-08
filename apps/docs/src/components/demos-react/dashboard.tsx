'use client';

import { DashboardDemo as SharedDashboardDemo } from '@spec-lab/ui-kit-demos/patterns';

// Thin `'use client'` render-wrapper around the shared demo (single source of
// truth in @spec-lab/ui-kit-demos). A render-wrapper — not a bare re-export —
// because Next drops a re-exported client component from its client manifest
// (renders `undefined`); wrapping it in a locally-defined client component
// keeps it in the manifest. See apps/docs/AGENTS.md.
export function DashboardDemo() {
  return <SharedDashboardDemo />;
}
