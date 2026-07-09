'use client';

import * as React from 'react';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';

import { cn } from '@/lib/utils';

// Wraps Base UI's CheckboxGroup — a `<div>` that provides shared state to a set
// of `Checkbox`es so the group reads/writes a single `string[]` of the ticked
// checkboxes' `name`s (each child `Checkbox` takes a `name`). Pairs with `Field`
// / `FieldSet` for validation: `field.tsx` already reserves the tighter
// `[data-slot=checkbox-group]` gap. The group itself has no color tokens — the
// checkboxes carry their own `--ui-checkbox-*` theming — so this is a layout-only
// wrapper (vertical stack by default).
export type CheckboxGroupProps = React.ComponentPropsWithoutRef<
  typeof CheckboxGroupPrimitive
>;

const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof CheckboxGroupPrimitive>,
  CheckboxGroupProps
>(({ className, ...props }, ref) => (
  <CheckboxGroupPrimitive
    ref={ref}
    data-slot="checkbox-group"
    className={cn('flex flex-col gap-3', className)}
    {...props}
  />
));
CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup };
