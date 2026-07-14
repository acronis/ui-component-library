import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { EllipsisIcon } from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIconMenu" component: an icon-only menu trigger — a
// square 32px box with a fixed 16px ellipsis ("more"/kebab) glyph. It is the
// icon-only sibling of `ButtonMenu` and, like it, is **presentational**: pass
// `open` in sync with the menu you control (the Figma `active` state is the
// **open** state — container + border take their `*-active` colors), and compose
// it onto the menu's trigger via the `render` prop.
//
// The design reuses ButtonIcon's `secondary` token tier (it is always bordered):
// container geometry + fill + glyph color from `--ui-button-icon-global-*`, and
// the per-state border from `--ui-button-icon-secondary-container-border-color-*`.
// Each interaction state wires its own token (runtime `var()` refs, so brand
// overrides are honored); disabled uses the explicit disabled tokens (not
// opacity); focus is a 3px `--ui-focus-primary` ring flush to the edge.
const buttonIconMenuClasses = cn(
  'inline-flex size-[var(--ui-button-icon-global-container-height)] shrink-0 items-center justify-center rounded-[var(--ui-button-icon-global-container-border-radius)] border transition-colors',
  'bg-[var(--ui-button-icon-global-container-color-idle)] text-[var(--ui-button-icon-global-icon-color-idle)] border-[var(--ui-button-icon-secondary-container-border-color-idle)]',
  'hover:bg-[var(--ui-button-icon-global-container-color-hover)] hover:text-[var(--ui-button-icon-global-icon-color-hover)] hover:border-[var(--ui-button-icon-secondary-container-border-color-hover)]',
  'active:bg-[var(--ui-button-icon-global-container-color-active)] active:text-[var(--ui-button-icon-global-icon-color-active)] active:border-[var(--ui-button-icon-secondary-container-border-color-active)]',
  'data-[open]:bg-[var(--ui-button-icon-global-container-color-active)] data-[open]:text-[var(--ui-button-icon-global-icon-color-active)] data-[open]:border-[var(--ui-button-icon-secondary-container-border-color-active)]',
  'disabled:pointer-events-none disabled:bg-[var(--ui-button-icon-global-container-color-disabled)] disabled:text-[var(--ui-button-icon-global-icon-color-disabled)] disabled:border-[var(--ui-button-icon-secondary-container-border-color-disabled)]',
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
  '[&_svg]:pointer-events-none [&_svg]:size-[var(--ui-button-icon-global-icon-size)] [&_svg]:shrink-0'
);

export interface ButtonIconMenuProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /**
   * Whether the menu this triggers is open. Applies the open (`*-active`)
   * treatment and reflects `aria-expanded`. Keep it in sync with the menu.
   */
  open?: boolean;
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition) — e.g. a menu trigger. Accepts a React element or a
   * render function; the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * An icon-only button that opens a menu — a fixed ellipsis ("more") glyph in a
 * bordered 32px box. Defaults its accessible name to "More options"; override
 * `aria-label` for a more specific one. Pair it with the menu it controls and
 * keep `open` in sync.
 */
const ButtonIconMenu = React.forwardRef<HTMLButtonElement, ButtonIconMenuProps>(
  (
    {
      className,
      open,
      render,
      'aria-label': ariaLabel = 'More options',
      ...props
    },
    ref
  ) => {
    return useRender({
      render,
      ref,
      defaultTagName: 'button',
      props: mergeProps<'button'>(
        {
          className: cn(buttonIconMenuClasses, className),
          'aria-label': ariaLabel,
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          // `data-open` drives the open (`*-active`) token switch via attribute
          // selectors; present only while open, typed loosely because React's
          // button attribute map doesn't include arbitrary data-* keys.
          ...(open ? ({ 'data-open': '' } as Record<string, string>) : {}),
          children: <EllipsisIcon />,
        },
        props
      ),
    });
  }
);
ButtonIconMenu.displayName = 'ButtonIconMenu';

export { ButtonIconMenu };
