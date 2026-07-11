import * as React from 'react';
import { BarsFilterIcon } from '@spec-lab/icons-react/stroke-mono';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Ported from the legacy shadcn UI kit's `filter`. A plain styled button —
// no Base UI primitive needed (it's not stateful/compound). The legacy version
// wrapped shadcn's `Button` and themed itself from four dedicated `--filter-*`
// HSL vars (all "Technical/fixed-link" / "Technical/fixed-button" — the brand
// action blue — per the Figma comments in `_globals.scss`). No
// `--ui-filter-*` tier exists yet, so this design-pending v1 themes from the
// shared semantic vocabulary instead of wrapping the shared `Button`:
//   • label + icon (was `--filter-text` / `--filter-icon`) -> text-secondary
//     (--ui-background-brand-secondary, the brand action blue — same bridge
//     WidgetPlaceholder's action text uses)
//   • count badge background (was `--filter-counter-bg`) -> bg-secondary
//   • count badge text (was `--filter-counter-text`, Inversed/inversed-primary)
//     -> text-primary-foreground (the pure-white glyph token; NOT
//     text-secondary-foreground, which is a dimmed white — see Tabs's active
//     treatment for the same distinction)
// The label/icon color and the forced-transparent hover background are kept
// unconditional across all three `variant`s, faithfully matching the legacy
// behavior (only the idle background/border differ by variant).
// Reconcile with `/figma-component Filter <url> --update` once a mockup lands.

const filterVariants = cva(
  'inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold leading-6 text-secondary transition-colors hover:bg-transparent hover:text-secondary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        outline: 'border border-border bg-background',
        ghost: '',
      },
    },
    defaultVariants: {
      variant: 'ghost',
    },
  }
);

export interface FilterProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterVariants> {
  /** Shows a count badge instead of the filter icon when > 0. */
  count?: number;
  /** Bolds the label. Purely presentational — mirrors the legacy prop. */
  active?: boolean;
}

const Filter = React.forwardRef<HTMLButtonElement, FilterProps>(
  (
    { className, count, active = false, variant = 'ghost', children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          filterVariants({ variant }),
          active && 'font-semibold',
          className
        )}
        {...props}
      >
        {count !== undefined && count > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-sm bg-secondary px-1 text-[11px] font-bold uppercase leading-4 tracking-wider text-primary-foreground">
            {count}
          </span>
        )}
        {!count && <BarsFilterIcon size={16} />}
        <span className="text-sm font-semibold leading-6">
          {children || 'Filter'}
        </span>
      </button>
    );
  }
);
Filter.displayName = 'Filter';

export { Filter, filterVariants };
