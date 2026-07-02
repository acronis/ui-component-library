'use client';

import dynamic from 'next/dynamic';

export { DropdownMenuWithCheckboxes } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuWithRadio } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuVariants } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuWithSearch } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuDisabled } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';
export { DropdownMenuAlignments } from '@spec-lab/shadcn-uikit-demos/dropdown-menu';

// Dynamic imports for demos that reference missing-icons
export const DropdownMenuBasic = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuBasic
    ),
  { ssr: false }
);

export const DropdownMenuWithLabels = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithLabels
    ),
  { ssr: false }
);

export const DropdownMenuWithIcons = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithIcons
    ),
  { ssr: false }
);

export const DropdownMenuWithSubmenu = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuWithSubmenu
    ),
  { ssr: false }
);

export const DropdownMenuMultipleSections = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuMultipleSections
    ),
  { ssr: false }
);

export const DropdownMenuComplex = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/dropdown-menu').then(
      (mod) => mod.DropdownMenuComplex
    ),
  { ssr: false }
);
