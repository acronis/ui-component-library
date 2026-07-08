'use client';

import { WizardDialogDemo as SharedWizardDialogDemo } from '@spec-lab/ui-kit-demos/patterns';
import { useShadowMount } from '@/components/ShadowDemo';

// Thin `'use client'` render-wrapper around the shared demo (single source of
// truth in @spec-lab/ui-kit-demos). A render-wrapper — not a bare re-export —
// because Next drops a re-exported client component from its client manifest.
// Passes the shadow mount so the dialog overlay portals into the shadow root and
// inherits ui-react's styles. See apps/docs/AGENTS.md.
export function WizardDialogDemo() {
  const mount = useShadowMount();
  return <SharedWizardDialogDemo portalContainer={mount} />;
}
