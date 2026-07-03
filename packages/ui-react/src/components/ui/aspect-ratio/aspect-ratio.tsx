import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Desired width-to-height ratio, e.g. `16 / 9`, `4 / 3`, `1`. Applied via the
   * native CSS `aspect-ratio` property. Defaults to `1` (square).
   */
  ratio?: number;
}

// Ported from the legacy shadcn UI kit's `aspect-ratio`. A layout-only primitive that
// constrains its box to a given width:height ratio; the child (e.g. an image or
// video) fills it. It carries no color tokens.
//
// Adaptation from legacy: the legacy padding-bottom percentage hack + inner
// absolutely-positioned element is replaced by the native CSS `aspect-ratio`
// property (baseline-supported), so it's a single element and children flow
// normally. `relative` is kept so consumers can absolutely-position overlays.
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative w-full', className)}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    />
  )
);
AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
