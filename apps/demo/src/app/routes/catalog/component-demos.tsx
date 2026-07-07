import type * as React from 'react';
import { AlertDemo } from '@/components/AlertDemo';
import { BreadcrumbDemo } from '@/components/BreadcrumbDemo';
import { ButtonDemo } from '@/components/ButtonDemo';
import { ButtonGroupDemo } from '@/components/ButtonGroupDemo';
import { CalendarDemo } from '@/components/CalendarDemo';
import { CardDemo } from '@/components/CardDemo';
import { CarouselDemo } from '@/components/CarouselDemo';
import { ChartDemo } from '@/components/ChartDemo';
import { CheckboxDemo } from '@/components/CheckboxDemo';
import { ChipDemo } from '@/components/ChipDemo';
import { ComboboxDemo } from '@/components/ComboboxDemo';
import { DataTableDemo } from '@/components/DataTableDemo';
import { DatePickerDemo } from '@/components/DatePickerDemo';
import { DialogDemo } from '@/components/DialogDemo';
import { DropdownMenuDemo } from '@/components/DropdownMenuDemo';
import { EmptyDemo } from '@/components/EmptyDemo';
import { FilterDemo } from '@/components/FilterDemo';
import { FormDemo } from '@/components/FormDemo';
import { GenericComponentsDemo } from '@/components/GenericComponentsDemo';
import { LayoutsDemo } from '@/components/LayoutsDemo';
import { PaginationDemo } from '@/components/PaginationDemo';
import { PopoverDemo } from '@/components/PopoverDemo';
import { ProgressDemo } from '@/components/ProgressDemo';
import { RadioGroupDemo } from '@/components/RadioGroupDemo';
import { SecondaryMenuDemo } from '@/components/SecondaryMenuDemo';
import { SelectDemo } from '@/components/SelectDemo';
import { SeparatorDemo } from '@/components/SeparatorDemo';
import { SidebarDemo } from '@/components/SidebarDemo';
import { SonnerDemo } from '@/components/SonnerDemo';
import { SpinnerDemo } from '@/components/SpinnerDemo';
import { SwitchDemo } from '@/components/SwitchDemo';
import { TableDemo } from '@/components/TableDemo';
import { TabsDemo } from '@/components/TabsDemo';
import { TagDemo } from '@/components/TagDemo';
import { TextareaDemo } from '@/components/TextareaDemo';
import { TooltipDemo } from '@/components/TooltipDemo';
import { TreeDemo } from '@/components/TreeDemo';
import { WidgetDemo } from '@/components/WidgetDemo';
import { BasicInputDemo } from '@/components/input/BasicInputDemo';
import { InputSearchDemo } from '@/components/input/InputSearchDemo';

// Registry mapping each spec component `name` (from @spec-lab/ui-spec's
// spec-index) to the existing demo component that showcases it. This is the
// "full merge": the legacy component-library browser's demos are reused as-is
// and surfaced through the spec-driven Components catalog. Multi-component demos
// (layout blocks, layouts) are mapped to each spec entry they genuinely cover.
// A spec component absent from this map renders its metadata with "No demo yet".
export const componentDemos: Record<string, React.ComponentType> = {
  alert: AlertDemo,
  'app-shell': LayoutsDemo,
  'auth-layout': LayoutsDemo,
  breadcrumb: BreadcrumbDemo,
  button: ButtonDemo,
  'button-group': ButtonGroupDemo,
  calendar: CalendarDemo,
  card: CardDemo,
  'card-filter': FilterDemo,
  carousel: CarouselDemo,
  chart: ChartDemo,
  checkbox: CheckboxDemo,
  chip: ChipDemo,
  combobox: ComboboxDemo,
  'data-table': DataTableDemo,
  dialog: DialogDemo,
  'dropdown-menu': DropdownMenuDemo,
  empty: EmptyDemo,
  form: FormDemo,
  grid: GenericComponentsDemo,
  'input-date-picker': DatePickerDemo,
  'input-search': InputSearchDemo,
  'input-text': BasicInputDemo,
  'input-text-area': TextareaDemo,
  'page-content': GenericComponentsDemo,
  'page-header': GenericComponentsDemo,
  pagination: PaginationDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  radio: RadioGroupDemo,
  section: GenericComponentsDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  'sidebar-primary': SidebarDemo,
  'sidebar-secondary': SecondaryMenuDemo,
  spinner: SpinnerDemo,
  stack: GenericComponentsDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  tag: TagDemo,
  toast: SonnerDemo,
  tooltip: TooltipDemo,
  tree: TreeDemo,
  'widget-placeholder': WidgetDemo,
};

/** Whether a live demo exists for the given spec component `name`. */
export function hasDemo(name: string): boolean {
  return name in componentDemos;
}
