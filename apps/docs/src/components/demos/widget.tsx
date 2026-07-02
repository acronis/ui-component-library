'use client';

import dynamic from 'next/dynamic';

export const WidgetAll = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetAll
    ),
  { ssr: false }
);

export const WidgetBasic = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetBasic
    ),
  { ssr: false }
);

export const WidgetSizes = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetSizes
    ),
  { ssr: false }
);

export const WidgetInteractive = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetInteractive
    ),
  { ssr: false }
);

export const WidgetWithIcon = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetWithIcon
    ),
  { ssr: false }
);

export const WidgetValueDisplay = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetValueDisplay
    ),
  { ssr: false }
);

export const WidgetWithDivider = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetWithDivider
    ),
  { ssr: false }
);

export const WidgetMinimal = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetMinimal
    ),
  { ssr: false }
);

export const WidgetDashboardGrid = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/widget').then(
      (mod) => mod.WidgetDashboardGrid
    ),
  { ssr: false }
);
