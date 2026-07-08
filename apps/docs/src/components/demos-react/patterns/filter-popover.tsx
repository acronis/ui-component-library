'use client';

import { FilterPopoverDemo as SharedFilterPopoverDemo } from '@spec-lab/ui-kit-demos/patterns';
import { useShadowMount } from '@/components/ShadowDemo';

// Thin `'use client'` render-wrapper around the shared demo (single source of
// truth in @spec-lab/ui-kit-demos). A render-wrapper — not a bare re-export —
// because Next drops a re-exported client component from its client manifest.
// Passes the shadow mount so the popover/select overlays portal into the shadow
// root and inherit ui-react's styles. See apps/docs/AGENTS.md.
export function FilterPopoverDemo() {
  const mount = useShadowMount();
  return <SharedFilterPopoverDemo portalContainer={mount} />;
}
