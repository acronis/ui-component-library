'use client';

import { FormLayoutDemo as SharedFormLayoutDemo } from '@spec-lab/ui-kit-demos/patterns';
import { useShadowMount } from '@/components/ShadowDemo';

// Render-wrapper around the shared demo; passes the shadow mount so the Select
// popup portals into the shadow root and inherits ui-react's styles.
export function FormLayoutDemo() {
  const mount = useShadowMount();
  return <SharedFormLayoutDemo portalContainer={mount} />;
}
