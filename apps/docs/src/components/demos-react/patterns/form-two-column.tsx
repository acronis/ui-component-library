'use client';

import { FormTwoColumnDemo as SharedFormTwoColumnDemo } from '@constructor-lab/ui-kit-demos/patterns';
import { useShadowMount } from '@/components/ShadowDemo';

// Render-wrapper around the shared demo; passes the shadow mount so the
// Autocomplete popup portals into the shadow root and inherits ui-react's styles.
export function FormTwoColumnDemo() {
  const mount = useShadowMount();
  return <SharedFormTwoColumnDemo portalContainer={mount} />;
}
