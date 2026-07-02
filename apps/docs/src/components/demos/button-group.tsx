'use client';

import dynamic from 'next/dynamic';

export { ButtonGroupBasic } from '@spec-lab/shadcn-uikit-demos/button-group';
export { ButtonGroupDaySelector } from '@spec-lab/shadcn-uikit-demos/button-group';
export { ButtonGroupDaySelectorSmall } from '@spec-lab/shadcn-uikit-demos/button-group';
export { ButtonGroupVertical } from '@spec-lab/shadcn-uikit-demos/button-group';
export { ButtonGroupSizes } from '@spec-lab/shadcn-uikit-demos/button-group';
export { ButtonGroupZoomControls } from '@spec-lab/shadcn-uikit-demos/button-group';

// Dynamic imports for demos that reference missing-icons
export const ButtonGroupWithIcons = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithIcons
    ),
  { ssr: false }
);

export const ButtonGroupTextAlignment = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupTextAlignment
    ),
  { ssr: false }
);

export const ButtonGroupTextFormatting = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupTextFormatting
    ),
  { ssr: false }
);

export const ButtonGroupWithSeparators = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithSeparators
    ),
  { ssr: false }
);

export const ButtonGroupWithTextLabels = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupWithTextLabels
    ),
  { ssr: false }
);

export const ButtonGroupMediaControls = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupMediaControls
    ),
  { ssr: false }
);

export const ButtonGroupComplexToolbar = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/button-group').then(
      (mod) => mod.ButtonGroupComplexToolbar
    ),
  { ssr: false }
);
