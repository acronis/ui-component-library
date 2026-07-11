import * as React from 'react';

import { cn } from '@/lib/utils';

// Composable dashboard-widget table parts, ported from the legacy shadcn UI
// kit's `widget-table-data`. Plain styled elements — no Base UI primitive. No
// `--ui-widget-table-data-*`
// tier exists yet, so this design-pending v1 themes the outer chrome from the
// shared semantic vocabulary (same root/header/icon mapping as
// `widget-placeholder`) and the actual `<table>` internals from the dedicated
// `--ui-table-*` tier (`@spec-lab/tokens`) that `data-table.tsx` already uses:
//   • root      -> border-border + bg-background + text-foreground
//   • icon/link (was --av-fixed-link) -> text-secondary (the brand action blue)
//   • interactive hover/active -> bg-accent (surface-hover) /
//     surface-active; focus -> the standard 3px --ui-focus-primary ring
//   • thead border (was --av-brand-accent) -> --ui-table-global-cell-border-color
//   • thead tint (was --av-brand-lightest, "Colored-Background") -> bg-muted
//     (--ui-background-surface-secondary — same tint DataTable's `striped` uses)
//   • th label color -> --ui-table-header-label-color
//   • row divider / footer border (was --av-brand-accent) ->
//     --ui-table-global-cell-border-color
//   • row hover -> --ui-table-global-row-color-hover
//   • footer caption -> text-muted-foreground (matches widget-placeholder's
//     footer, a deliberate de-emphasis not present in the legacy source)
// Reconcile with `/figma-component WidgetTableData <url> --update` once a
// mockup lands (Figma: Charts-anatomy / Table-Data, node 826:86024).

export interface WidgetTableDataProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

const WidgetTableData = React.forwardRef<HTMLDivElement, WidgetTableDataProps>(
  ({ className, interactive, ...props }, ref) => (
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
  )
);
WidgetTableData.displayName = 'WidgetTableData';

const WidgetTableDataHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 px-6 pt-4 pb-2', className)}
    {...props}
  />
));
WidgetTableDataHeader.displayName = 'WidgetTableDataHeader';

const WidgetTableDataTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 truncate text-sm font-semibold leading-6', className)}
    {...props}
  />
));
WidgetTableDataTitle.displayName = 'WidgetTableDataTitle';

const WidgetTableDataIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-shrink-0 text-secondary [&>svg]:size-4', className)}
    {...props}
  />
));
WidgetTableDataIcon.displayName = 'WidgetTableDataIcon';

const WidgetTableDataContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 px-6 py-2', className)} {...props} />
));
WidgetTableDataContent.displayName = 'WidgetTableDataContent';

const WidgetTableDataTable = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn('w-full text-sm', className)} {...props} />
));
WidgetTableDataTable.displayName = 'WidgetTableDataTable';

const WidgetTableDataThead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'border-b border-[var(--ui-table-global-cell-border-color)] bg-muted',
      className
    )}
    {...props}
  />
));
WidgetTableDataThead.displayName = 'WidgetTableDataThead';

const WidgetTableDataTh = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-3 py-2 text-start text-xs font-semibold text-[var(--ui-table-header-label-color)]',
      className
    )}
    {...props}
  />
));
WidgetTableDataTh.displayName = 'WidgetTableDataTh';

const WidgetTableDataTbody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&>tr]:border-b [&>tr]:border-[var(--ui-table-global-cell-border-color)]',
      className
    )}
    {...props}
  />
));
WidgetTableDataTbody.displayName = 'WidgetTableDataTbody';

const WidgetTableDataTr = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors hover:bg-[var(--ui-table-global-row-color-hover)]',
      className
    )}
    {...props}
  />
));
WidgetTableDataTr.displayName = 'WidgetTableDataTr';

const WidgetTableDataTd = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-3 py-2 text-sm', className)} {...props} />
));
WidgetTableDataTd.displayName = 'WidgetTableDataTd';

const WidgetTableDataLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn('cursor-pointer text-secondary hover:underline', className)}
    {...props}
  />
));
WidgetTableDataLink.displayName = 'WidgetTableDataLink';

const WidgetTableDataFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-t border-[var(--ui-table-global-cell-border-color)] px-6 py-2 text-xs text-muted-foreground',
      className
    )}
    {...props}
  />
));
WidgetTableDataFooter.displayName = 'WidgetTableDataFooter';

export {
  WidgetTableData,
  WidgetTableDataHeader,
  WidgetTableDataTitle,
  WidgetTableDataIcon,
  WidgetTableDataContent,
  WidgetTableDataTable,
  WidgetTableDataThead,
  WidgetTableDataTh,
  WidgetTableDataTbody,
  WidgetTableDataTr,
  WidgetTableDataTd,
  WidgetTableDataLink,
  WidgetTableDataFooter,
};
