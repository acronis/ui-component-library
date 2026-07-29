import * as React from 'react';
import { MagnifierIcon } from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';

// A global ("search anything") field: a 48px pill with a gradient border, a
// leading magnifier, a borderless native input, and a trailing keyboard-shortcut
// hint (⌘K by default).
//
// This component is retired (see the deprecation note below) and its dedicated
// `--ui-search-global-*` token tier has been removed from @constructor-lab/tokens.
// Every reference below is therefore the shared token that tier used to alias —
// the AI gradients, the `--ui-units-*` sizes, and the AI-purple glyph/text
// semantics — so the field still resolves through generated tokens and renders
// unchanged. Do not reintroduce a component tier for it.
//
// The border is a brand gradient, not a flat color, so it can't go through
// `border-color`. Instead a private `--sg-border` custom property holds the
// active gradient and the box paints it with the standard padding-box/border-box
// double-background trick (box fill in padding-box, gradient in border-box over a
// transparent border). State swaps only the gradient: idle / hover / active
// (`:active`, the darkest). Focus reuses the idle gradient plus a 3px
// `--ui-focus-primary` ring via `focus-within`, mirroring the Figma focused
// state. The typography was two generated `.ui-search-global-*-text-style`
// classes (14px/400/24px), now the equivalent utilities.

/**
 * @deprecated The global search field is retired — it no longer appears in the
 * app-shell layouts (Figma nodes 6226-24149 / 6226-24150). Don't use it in new
 * work; existing usages should move to their surface's own search affordance.
 * Slated for removal.
 */
export interface SearchGlobalProps extends React.ComponentPropsWithoutRef<'input'> {
  /** Keyboard-shortcut hint shown at the trailing edge (decorative). Pass `null` to hide. */
  shortcut?: React.ReactNode;
}

/**
 * @deprecated The global search field is retired — it no longer appears in the
 * app-shell layouts (Figma nodes 6226-24149 / 6226-24150). Don't use it in new
 * work; existing usages should move to their surface's own search affordance.
 * Slated for removal.
 */
const SearchGlobal = React.forwardRef<HTMLInputElement, SearchGlobalProps>(
  (
    {
      className,
      type = 'search',
      placeholder = 'Search anything',
      shortcut = '⌘K',
      'aria-label': ariaLabel = 'Search',
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        'inline-flex h-[var(--ui-units-size-48)] w-[var(--ui-units-size-512)] min-w-[var(--ui-units-size-256)] max-w-[var(--ui-units-size-512)] items-center gap-[var(--ui-units-gap-8)]',
        'rounded-[var(--ui-units-radius-24)] border-[length:var(--ui-units-stroke-2)] border-solid border-transparent px-[var(--ui-units-gap-16)]',
        // Gradient border via padding-box (box fill) + border-box (the `--sg-border` gradient).
        '[--sg-border:var(--ui-gradients-ai-idle)] hover:[--sg-border:var(--ui-gradients-ai-hover)] active:[--sg-border:var(--ui-gradients-ai-active)]',
        '[background:linear-gradient(var(--ui-background-surface-primary),var(--ui-background-surface-primary))_padding-box,var(--sg-border)_border-box]',
        'transition-[background] focus-within:ring-[3px] focus-within:ring-[var(--ui-focus-primary)]',
        className
      )}
    >
      <MagnifierIcon
        size={16}
        className="shrink-0 text-[var(--ui-glyph-on-status-ai)]"
      />
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-normal leading-6 text-foreground outline-none placeholder:text-[var(--ui-text-on-status-ai)] [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {shortcut != null && (
        <span
          aria-hidden
          className="shrink-0 whitespace-nowrap text-sm font-normal leading-6 text-[var(--ui-text-on-surface-secondary)]"
        >
          {shortcut}
        </span>
      )}
    </div>
  )
);
SearchGlobal.displayName = 'SearchGlobal';

export { SearchGlobal };
