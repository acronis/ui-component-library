import * as React from 'react';

import { cn } from '@/lib/utils';

// Chunked-progress dashboard widget, ported from `@spec-lab/shadcn-uikit`'s
// `widget-progress-chunks` (packages/ui-legacy/src/components/ui/widget-progress-chunks.tsx).
// Plain styled elements — no Base UI primitive, mirroring the sibling
// `widget`/`widget-placeholder` ports. No `--ui-widget-progress-chunks-*` tier
// exists yet, so this design-pending v1 themes from the shared semantic
// vocabulary:
//   • root surface/text (was --av-inversed-primary / --av-fixed-primary) ->
//     bg-background / text-foreground; border -> border-border
//   • icon (was --av-fixed-link, the brand action blue) -> text-secondary
//   • row label (was --av-fixed-primary) -> text-foreground
//   • chunk track (was --av-brand-light) -> bg-input (matches the track token
//     `progress` uses for its own bar)
//   • chunk fill -> the caller-supplied `color` (a per-chunk CSS color, same
//     as `chart`'s consumer-configured series colors) — not tokenized here
//   • divider (was --av-brand-accent, a brand tint) -> border-border (matches
//     the divider convention used by `widget`/`accordion`/`app-shell`)
//   • interactive hover/active -> hover:bg-accent / active surface; focus ->
//     the standard 2px --ui-focus-primary outline (matches widget-placeholder)
// Anatomy:
// - WidgetProgressChunks (root)
//   - WidgetProgressChunksHeader (icon + title)
//   - WidgetProgressChunksBody
//     - WidgetProgressChunkRow (label + value/total + colored track) — one per chunk
//   - WidgetProgressChunksFooter (optional summary)
// Reconcile with `/figma-component WidgetProgressChunks <url> --update` once a
// mockup lands (legacy Figma ref: Charts-anatomy / Progress-Chunks, node 237:74702).

export interface ProgressChunk {
  label: string;
  value: number;
  total: number;
  color: string;
}

export interface WidgetProgressChunksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetProgressChunks = React.forwardRef<
  HTMLDivElement,
  WidgetProgressChunksProps
>(({ className, interactive, ...props }, ref) => (
  <div
    ref={ref}
    tabIndex={interactive ? 0 : undefined}
    className={cn(
      'relative flex flex-col rounded-lg border border-border bg-background text-foreground transition-colors',
      interactive &&
        'cursor-pointer hover:bg-accent active:bg-[var(--ui-background-surface-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-focus-primary)]',
      className
    )}
    {...props}
  />
));
WidgetProgressChunks.displayName = 'WidgetProgressChunks';

const WidgetProgressChunksHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pb-2 pt-4', className)}
    {...props}
  />
));
WidgetProgressChunksHeader.displayName = 'WidgetProgressChunksHeader';

const WidgetProgressChunksTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetProgressChunksTitle.displayName = 'WidgetProgressChunksTitle';

const WidgetProgressChunksIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetProgressChunksIcon.displayName = 'WidgetProgressChunksIcon';

const WidgetProgressChunksBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 px-6 py-2', className)}
    {...props}
  />
));
WidgetProgressChunksBody.displayName = 'WidgetProgressChunksBody';

export interface WidgetProgressChunkRowProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  total: number;
  color: string;
  formatValue?: (value: number) => string;
  formatTotal?: (total: number) => string;
}

const WidgetProgressChunkRow = React.forwardRef<
  HTMLDivElement,
  WidgetProgressChunkRowProps
>(
  (
    { className, label, value, total, color, formatValue, formatTotal, ...props },
    ref
  ) => {
    const pct = total > 0 ? (value / total) * 100 : 0;
    const displayValue = formatValue ? formatValue(value) : String(value);
    const displayTotal = formatTotal ? formatTotal(total) : String(total);

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground">{label}</span>
          <span className="font-semibold tabular-nums">
            {displayValue} / {displayTotal}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-input">
          <div
            className="h-full rounded transition-all"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    );
  }
);
WidgetProgressChunkRow.displayName = 'WidgetProgressChunkRow';

const WidgetProgressChunksFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-border px-6 py-2 text-xs', className)}
    {...props}
  />
));
WidgetProgressChunksFooter.displayName = 'WidgetProgressChunksFooter';

export {
  WidgetProgressChunks,
  WidgetProgressChunksHeader,
  WidgetProgressChunksTitle,
  WidgetProgressChunksIcon,
  WidgetProgressChunksBody,
  WidgetProgressChunkRow,
  WidgetProgressChunksFooter,
};
