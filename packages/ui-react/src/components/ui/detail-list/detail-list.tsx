import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  DescriptionList,
  DescriptionListActions,
  DescriptionListItem,
  DescriptionListLabel,
  DescriptionListValue,
  DescriptionListValueDescription,
} from '../description-list';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Tier 2).
//
// DetailList is the config-driven label/value list: `<DetailList items={…} />`.
// Where DescriptionList is a compositional part set, DetailList takes a flat
// item list and renders the approved key/value shape — label, value, an optional
// leading icon, a muted description, and inline actions — in one or two responsive
// columns, so every "details of the selected thing" panel reads the same way.
// Built on DescriptionList; compose those parts directly for anything the item
// descriptor can't express.

export interface DetailListItem {
  /** Stable key for the row (falls back to the row index). */
  id?: string;
  /** The property name. */
  label: React.ReactNode;
  /** The property value. */
  value: React.ReactNode;
  /** A muted line under the value. */
  description?: React.ReactNode;
  /** A leading icon (sized to 16px) beside the value — e.g. a status glyph. */
  icon?: React.ReactNode;
  /** Inline actions under the value (e.g. Link elements). */
  actions?: React.ReactNode;
}

export interface DetailListProps extends React.HTMLAttributes<HTMLDListElement> {
  /** The rows, in order. */
  items: DetailListItem[];
  /** Column count. `2` uses a responsive grid that collapses to one column. */
  columns?: 1 | 2;
  /** Width of the label column (CSS length). Defaults to 14rem (1 col) / 8rem (2 col). */
  labelWidth?: string;
}

export const DetailList = React.forwardRef<HTMLDListElement, DetailListProps>(
  function DetailList(
    { items, columns = 1, labelWidth, className, style, ...props },
    ref
  ) {
    const resolvedLabelWidth =
      labelWidth ?? (columns === 2 ? '8rem' : undefined);
    return (
      <DescriptionList
        ref={ref}
        className={cn(
          columns === 2 && 'grid grid-cols-1 sm:grid-cols-2',
          className
        )}
        style={
          resolvedLabelWidth
            ? ({
                '--description-list-label': resolvedLabelWidth,
                ...style,
              } as React.CSSProperties)
            : style
        }
        {...props}
      >
        {items.map((item, index) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key -- prefer item.id; index is the documented fallback for a static, caller-ordered list
          <DescriptionListItem key={item.id ?? index}>
            <DescriptionListLabel>{item.label}</DescriptionListLabel>
            <DescriptionListValue>
              {item.icon}
              <div className="flex min-w-0 flex-col gap-1">
                <span>{item.value}</span>
                {item.description ? (
                  <DescriptionListValueDescription>
                    {item.description}
                  </DescriptionListValueDescription>
                ) : null}
                {item.actions ? (
                  <DescriptionListActions>
                    {item.actions}
                  </DescriptionListActions>
                ) : null}
              </div>
            </DescriptionListValue>
          </DescriptionListItem>
        ))}
      </DescriptionList>
    );
  }
);
