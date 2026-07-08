import type * as React from 'react';
import {
  AppShellDemo,
  DashboardDemo,
  DataTableBulkActionsDemo,
  EmptyScreenDemo,
  FilterPopoverDemo,
  SheetDetailPanelDemo,
} from '@spec-lab/ui-kit-demos/patterns';

// Registry mapping each ui-spec pattern `name` (from @spec-lab/ui-spec's
// spec-index) to the shared live demo that realizes it. The demos live in
// @spec-lab/ui-kit-demos (the single source of truth); Vite imports them
// directly with no RSC caveat. A pattern absent from this map renders only its
// metadata + copy-paste example. Mirrors component-demos.tsx.
export const patternDemos: Record<string, React.ComponentType> = {
  'app-shell': AppShellDemo,
  dashboard: DashboardDemo,
  'data-table-bulk-actions': DataTableBulkActionsDemo,
  'empty-screen': EmptyScreenDemo,
  'filter-popover': FilterPopoverDemo,
  'sheet-detail-panel': SheetDetailPanelDemo,
};

/** Whether a live demo exists for the given spec pattern `name`. */
export function hasPatternDemo(name: string): boolean {
  return name in patternDemos;
}
