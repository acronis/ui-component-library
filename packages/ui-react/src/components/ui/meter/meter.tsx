'use client';

import * as React from 'react';
import { Meter as MeterPrimitive } from '@base-ui/react/meter';

import { cn } from '@/lib/utils';

// Wraps Base UI's Meter (Root / Label / Value / Track / Indicator). A meter shows
// a *static* measurement within a known range — disk usage, quota, a strength
// score — unlike `Progress`, which shows task advancement (and can be
// indeterminate). No `--ui-meter-*` tier: the track reuses the shared border
// surface via `bg-input` and the fill uses the brand action blue via
// `bg-secondary`, matching Progress. The fill width is set by Base UI from
// `value` / `min` / `max`. Compose a label + value row above the track; `Value`
// renders the formatted number (drive locale/units through the Root's `format` /
// `locale`).
const Meter = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Root
    ref={ref}
    className={cn('flex w-full flex-col gap-1.5', className)}
    {...props}
  />
));
Meter.displayName = 'Meter';

const MeterLabel = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Label
    ref={ref}
    className={cn('text-sm font-medium leading-snug', className)}
    {...props}
  />
));
MeterLabel.displayName = 'MeterLabel';

const MeterValue = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Value>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Value
    ref={ref}
    className={cn('text-sm leading-snug text-muted-foreground', className)}
    {...props}
  />
));
MeterValue.displayName = 'MeterValue';

const MeterTrack = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Track>
>(({ className, children, ...props }, ref) => (
  <MeterPrimitive.Track
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-input',
      className
    )}
    {...props}
  >
    {children ?? <MeterIndicator />}
  </MeterPrimitive.Track>
));
MeterTrack.displayName = 'MeterTrack';

const MeterIndicator = React.forwardRef<
  React.ComponentRef<typeof MeterPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof MeterPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Indicator
    ref={ref}
    className={cn('h-full rounded-full bg-secondary transition-all', className)}
    {...props}
  />
));
MeterIndicator.displayName = 'MeterIndicator';

export { Meter, MeterLabel, MeterValue, MeterTrack, MeterIndicator };
