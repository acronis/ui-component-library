import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Ported from the legacy shadcn UI kit's `button-group`. Groups adjacent `Button`s (and other
// controls) into a single segmented control: the root collapses the shared inner
// edges so the buttons read as one unit. Two parts join them — a static text/icon
// addon (`ButtonGroupText`) and a divider (`ButtonGroupSeparator`, which reuses
// the ui-react `Separator`).
//
// Adaptations from legacy: `ButtonGroupText` drops Radix `asChild`/`Slot` for
// Base UI's `render` prop (`useRender` + `mergeProps`); the divider reuses
// `Separator` instead of a raw `bg-input` line; and the legacy root's
// `select-trigger`/`input`-specific `has-[…]` selectors are dropped for this v1
// (the core edge-collapsing behavior is kept). Colors map to the shared semantic
// tokens via the bridged names (`bg-muted`, `border-border`, `text-foreground`) —
// no `--av-*`, no hex. Design-pending v1: no dedicated `--ui-button-group-*` tier.
const buttonGroupVariants = cva(
  'flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10',
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

export interface ButtonGroupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation ?? 'horizontal'}
      className={cn(buttonGroupVariants({ orientation, className }))}
      {...props}
    />
  )
);
ButtonGroup.displayName = 'ButtonGroup';

export interface ButtonGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Replace the rendered `<div>` with another element or component (Base UI
   * composition) — e.g. render the addon as a `<label>`. Accepts a React
   * element or a render function; props and classes are merged onto it.
   */
  render?: useRender.RenderProp;
}

const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, render, ...props }, ref) =>
    useRender({
      render,
      ref,
      defaultTagName: 'div',
      props: mergeProps<'div'>(
        {
          className: cn(
            "flex items-center gap-2 rounded-md border border-border bg-muted px-4 text-sm font-medium text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            className
          ),
        },
        props
      ),
    })
);
ButtonGroupText.displayName = 'ButtonGroupText';

const ButtonGroupSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <Separator
    ref={ref}
    data-slot="button-group-separator"
    orientation={orientation}
    className={cn('self-stretch data-[orientation=vertical]:h-auto', className)}
    {...props}
  />
));
ButtonGroupSeparator.displayName = 'ButtonGroupSeparator';

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
