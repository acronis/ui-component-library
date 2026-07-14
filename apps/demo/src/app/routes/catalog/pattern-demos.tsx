import type * as React from 'react';
import {
  AppShellDemo,
  AuthScreenDemo,
  CardGridDemo,
  ConfirmDialogDemo,
  DashboardDemo,
  DataTableBulkActionsDemo,
  DetailDrawerDemo,
  EmptyScreenDemo,
  FieldGroupDemo,
  FilterPopoverDemo,
  FormDialogDemo,
  FormLayoutDemo,
  FormTwoColumnDemo,
  FormValidationDemo,
  IntelligencePanelDemo,
  SheetDetailPanelDemo,
  SidebarNavigationDemo,
  TableViewDemo,
  WizardDialogDemo,
} from '@constructor-lab/ui-kit-demos/patterns';

// Registry mapping each ui-spec pattern `name` (from @constructor-lab/ui-spec's
// spec-index) to the shared live demo that realizes it. The demos live in
// @constructor-lab/ui-kit-demos (the single source of truth); Vite imports them
// directly with no RSC caveat. A pattern absent from this map renders only its
// metadata + copy-paste example. Mirrors component-demos.tsx.
export const patternDemos: Record<string, React.ComponentType> = {
  'app-shell': AppShellDemo,
  'auth-screen': AuthScreenDemo,
  'card-grid': CardGridDemo,
  'confirm-dialog': ConfirmDialogDemo,
  dashboard: DashboardDemo,
  'data-table-bulk-actions': DataTableBulkActionsDemo,
  'detail-drawer': DetailDrawerDemo,
  'empty-screen': EmptyScreenDemo,
  'field-group': FieldGroupDemo,
  'filter-popover': FilterPopoverDemo,
  'form-dialog': FormDialogDemo,
  'form-layout': FormLayoutDemo,
  'form-two-column': FormTwoColumnDemo,
  'form-validation': FormValidationDemo,
  'intelligence-panel': IntelligencePanelDemo,
  'sheet-detail-panel': SheetDetailPanelDemo,
  'sidebar-navigation': SidebarNavigationDemo,
  'table-view': TableViewDemo,
  'wizard-dialog': WizardDialogDemo,
};

/** Whether a live demo exists for the given spec pattern `name`. */
export function hasPatternDemo(name: string): boolean {
  return name in patternDemos;
}
