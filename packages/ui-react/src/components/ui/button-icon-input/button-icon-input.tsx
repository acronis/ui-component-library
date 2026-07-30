import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Mirrors the Figma "ButtonIconInput" component set (node 5304:5404): the small
// icon-only affordance that lives *inside* an input box — a clear (✕) button, a
// password reveal eye, a search trigger. It is a distinct component from
// `ButtonIcon`, not a size of it: the container is 20×20 (not 32×32) with 2px
// padding around a 16px glyph, and it carries a `variant` property
// (`normal` / `error`) so the affordance can turn red inside a field in its
// error treatment. Each interaction state is wired to its own
// `--ui-button-icon-input-*` token (runtime `var()` references, so brand
// overrides are honored), and the focus ring follows the variant the way the
// input box does — 3px `--ui-focus-primary` for `normal`, `--ui-focus-error`
// for `error`, both confirmed against the Figma focus variants.
//
// One deliberate deviation: the `error` tier emits no `icon-color-disabled`
// (only `normal` does), so a disabled `error` button reuses
// `--ui-button-icon-input-normal-icon-color-disabled`. The Figma has no
// disabled+error rendering to contradict this — it shows a constraint-validation
// note there instead, because a disabled control is barred from validation.
const buttonIconInputVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors ' +
    'h-[var(--ui-button-icon-input-global-container-height)] w-[var(--ui-button-icon-input-global-container-width)] ' +
    'px-[var(--ui-button-icon-input-global-container-padding-x)] py-[var(--ui-button-icon-input-global-container-padding-y)] ' +
    'rounded-[var(--ui-button-icon-input-global-container-border-radius)] ' +
    'disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-[3px] ' +
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        normal:
          'bg-[var(--ui-button-icon-input-normal-container-color-idle)] text-[var(--ui-button-icon-input-normal-icon-color-idle)] ' +
          'hover:bg-[var(--ui-button-icon-input-normal-container-color-hover)] hover:text-[var(--ui-button-icon-input-normal-icon-color-hover)] ' +
          'active:bg-[var(--ui-button-icon-input-normal-container-color-active)] active:text-[var(--ui-button-icon-input-normal-icon-color-active)] ' +
          'disabled:bg-[var(--ui-button-icon-input-normal-container-color-disabled)] disabled:text-[var(--ui-button-icon-input-normal-icon-color-disabled)] ' +
          'focus-visible:ring-[var(--ui-focus-primary)] ' +
          '[&_svg]:size-[var(--ui-button-icon-input-normal-icon-size)]',
        error:
          'bg-[var(--ui-button-icon-input-error-container-color-idle)] text-[var(--ui-button-icon-input-error-icon-color-idle)] ' +
          'hover:bg-[var(--ui-button-icon-input-error-container-color-hover)] hover:text-[var(--ui-button-icon-input-error-icon-color-hover)] ' +
          'active:bg-[var(--ui-button-icon-input-error-container-color-active)] active:text-[var(--ui-button-icon-input-error-icon-color-active)] ' +
          'disabled:bg-[var(--ui-button-icon-input-error-container-color-disabled)] disabled:text-[var(--ui-button-icon-input-normal-icon-color-disabled)] ' +
          'focus-visible:ring-[var(--ui-focus-error)] ' +
          '[&_svg]:size-[var(--ui-button-icon-input-error-icon-size)]',
      },
    },
    defaultVariants: {
      variant: 'normal',
    },
  }
);

export interface ButtonIconInputProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonIconInputVariants> {
  /**
   * Replace the rendered `<button>` with another element or component
   * (Base UI composition). Accepts a React element or a render function —
   * the component's props and class names are merged onto it.
   */
  render?: useRender.RenderProp;
}

/**
 * The 20×20 icon-only button that sits inside an input box (clear, reveal,
 * search). The icon is passed as `children`; provide an `aria-label` (or
 * `aria-labelledby`) so the control has an accessible name.
 */
const ButtonIconInput = React.forwardRef<
  HTMLButtonElement,
  ButtonIconInputProps
>(({ className, variant, render, type = 'button', ...props }, ref) => {
  return useRender({
    render,
    ref,
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type,
        className: cn(buttonIconInputVariants({ variant, className })),
      },
      props
    ),
  });
});
ButtonIconInput.displayName = 'ButtonIconInput';

export { ButtonIconInput, buttonIconInputVariants };
