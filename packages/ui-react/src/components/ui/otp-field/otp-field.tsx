'use client';

import * as React from 'react';
import { OTPField as OTPFieldPrimitive } from '@base-ui/react/otp-field';

import { cn } from '@/lib/utils';

// Wraps Base UI's OTPField (Root / Input / Separator) — a segmented one-time-code
// input for verification / 2FA flows. The Root owns the whole value (`length`
// slots, `numeric` by default, optional `mask`, `autoSubmit`) and manages focus,
// paste-to-fill, and a hidden validation input; render `length` `OTPFieldInput`
// slots inside it. No `--ui-otp-*` tier: each slot reuses the `--ui-input-text-*`
// box tokens (matching InputBox) with a focus ring on the focused slot.
const OTPField = React.forwardRef<
  React.ElementRef<typeof OTPFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Root>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Root
    ref={ref}
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
));
OTPField.displayName = 'OTPField';

const OTPFieldInput = React.forwardRef<
  React.ElementRef<typeof OTPFieldPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Input>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Input
    ref={ref}
    className={cn(
      'size-10 rounded-[var(--ui-input-text-global-box-border-radius)] border bg-[var(--ui-input-text-global-box-color-idle)] border-[var(--ui-input-text-normal-box-border-color-idle)] text-center text-base leading-6 text-[var(--ui-input-text-global-value-color-idle)] transition-colors',
      'not-disabled:hover:border-[var(--ui-input-text-normal-box-border-color-hover)]',
      'focus-visible:z-10 focus-visible:border-[var(--ui-input-text-normal-box-border-color-hover)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
      'disabled:cursor-not-allowed disabled:border-[var(--ui-input-text-normal-box-border-color-disabled)] disabled:bg-[var(--ui-input-text-global-box-color-disabled)] disabled:text-[var(--ui-input-text-global-value-color-disabled)]',
      className
    )}
    {...props}
  />
));
OTPFieldInput.displayName = 'OTPFieldInput';

const OTPFieldSeparator = React.forwardRef<
  React.ElementRef<typeof OTPFieldPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof OTPFieldPrimitive.Separator>
>(({ className, children, ...props }, ref) => (
  <OTPFieldPrimitive.Separator
    ref={ref}
    className={cn('px-1 text-muted-foreground', className)}
    {...props}
  >
    {children ?? '-'}
  </OTPFieldPrimitive.Separator>
));
OTPFieldSeparator.displayName = 'OTPFieldSeparator';

export { OTPField, OTPFieldInput, OTPFieldSeparator };
