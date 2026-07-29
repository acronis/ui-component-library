import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { SquareArrowUpRightIcon } from '@constructor-lab/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "Link" component: an inline text link (semibold, 14/24) with an
// optional trailing external-link icon (`external`). Themed by the `--ui-link-*`
// tier. Shared bits come from `--ui-link-global-*` (container gap, per-state text
// decoration — underline on hover only). The `variant` (Figma `background`) picks
// the color set: `normal` (on a light surface) uses `--ui-link-normal-*`,
// `inverse` (on a dark surface) uses `--ui-link-inverse-*`; each wires its own
// per-state text color and external-icon color (the icon color is kept separate
// from the text per the tier). Focus paints a 3px `--ui-focus-primary` ring.
// Polymorphic via Base UI `useRender` — pass `render` to render a router `Link`
// instead of the default `<a>`. `disabled` makes it inert (disabled color, removed
// from the tab order, no navigation) — only `normal` defines a disabled color;
// the design has no inverse-disabled state.
//
// The Figma container has a fixed 32px height for grid alignment
// (`--ui-link-global-container-height`); it is intentionally NOT applied here so
// the link flows inline within prose.
const linkVariants = cva(
  'inline-flex cursor-pointer items-center gap-[var(--ui-link-global-container-gap)] rounded-sm text-sm font-semibold leading-6 outline-none transition-colors [text-decoration:var(--ui-link-global-text-decoration-idle)] hover:[text-decoration:var(--ui-link-global-text-decoration-hover)] active:[text-decoration:var(--ui-link-global-text-decoration-active)] focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] aria-disabled:pointer-events-none aria-disabled:[text-decoration:var(--ui-link-global-text-decoration-disabled)] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        normal:
          'text-[var(--ui-link-normal-text-color-idle)] [&_svg]:text-[var(--ui-link-normal-external-icon-color-idle)] hover:text-[var(--ui-link-normal-text-color-hover)] hover:[&_svg]:text-[var(--ui-link-normal-external-icon-color-hover)] active:text-[var(--ui-link-normal-text-color-active)] active:[&_svg]:text-[var(--ui-link-normal-external-icon-color-active)] aria-disabled:text-[var(--ui-link-normal-text-color-disabled)] aria-disabled:[&_svg]:text-[var(--ui-link-normal-external-icon-color-disabled)]',
        inverse:
          'text-[var(--ui-link-inverse-text-color-idle)] [&_svg]:text-[var(--ui-link-inverse-external-icon-color-idle)] hover:text-[var(--ui-link-inverse-text-color-hover)] hover:[&_svg]:text-[var(--ui-link-inverse-external-icon-color-hover)] active:text-[var(--ui-link-inverse-text-color-active)] active:[&_svg]:text-[var(--ui-link-inverse-external-icon-color-active)]',
      },
    },
    defaultVariants: { variant: 'normal' },
  }
);

export interface LinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Append a trailing external-link icon (e.g. for links that leave the app). */
  external?: boolean;
  /** Render the link inert: disabled color, removed from the tab order, no navigation. */
  disabled?: boolean;
  /**
   * Replace the rendered `<a>` with another element or component (Base UI
   * composition) — e.g. a router `Link`. Props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      external,
      disabled,
      href,
      children,
      render,
      ...props
    },
    ref
  ) =>
    useRender({
      render,
      ref,
      defaultTagName: 'a',
      props: mergeProps<'a'>(
        {
          className: cn(linkVariants({ variant, className })),
          href: disabled ? undefined : href,
          'aria-disabled': disabled || undefined,
          tabIndex: disabled ? -1 : undefined,
          children: (
            <>
              {children}
              {external && <SquareArrowUpRightIcon size={16} />}
            </>
          ),
        },
        props
      ),
    })
);
Link.displayName = 'Link';

export { Link, linkVariants };
