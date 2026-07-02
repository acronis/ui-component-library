'use client';

import dynamic from 'next/dynamic';

export { EmptyBasic } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyWithAction } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyWithButtonAndLink } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyWithMultipleLinks } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyOnlyLinks } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyError } from '@spec-lab/shadcn-uikit-demos/empty';
export { EmptyDiscoveryAgent } from '@spec-lab/shadcn-uikit-demos/empty';

// Dynamic import for demo that references missing-icons
export const EmptyVariousStates = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/empty').then(
      (mod) => mod.EmptyVariousStates
    ),
  { ssr: false }
);
