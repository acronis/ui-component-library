'use client';

import dynamic from 'next/dynamic';

export { InputBasic } from '@spec-lab/shadcn-uikit-demos/input';
export { InputTypes } from '@spec-lab/shadcn-uikit-demos/input';
export { InputWithLabels } from '@spec-lab/shadcn-uikit-demos/input';
export { InputWithIcons } from '@spec-lab/shadcn-uikit-demos/input';
export { InputDisabled } from '@spec-lab/shadcn-uikit-demos/input';
export { InputRequired } from '@spec-lab/shadcn-uikit-demos/input';
export { InputWithHelper } from '@spec-lab/shadcn-uikit-demos/input';
export { InputError } from '@spec-lab/shadcn-uikit-demos/input';
export { InputSizes } from '@spec-lab/shadcn-uikit-demos/input';
export { InputForm } from '@spec-lab/shadcn-uikit-demos/input';
export { InputSearch } from '@spec-lab/shadcn-uikit-demos/input';

// Dynamic import for demo that references missing-icons
export const InputVariousTypes = dynamic(
  () =>
    import('@spec-lab/shadcn-uikit-demos/input').then(
      (mod) => mod.InputVariousTypes
    ),
  { ssr: false }
);
