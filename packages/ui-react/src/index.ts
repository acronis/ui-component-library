export { cn } from './lib/utils';
// Cross-cutting library utilities (Track 1). Kept as one contiguous block so
// component barrels below stay easy to extend without conflict.
export {
  ROOT_FONT_SIZE_PX,
  BREAKPOINT_LG,
  BREAKPOINT_XL,
  BREAKPOINT_2XL,
  BREAKPOINT_3XL,
  BREAKPOINT_4XL,
  getViewportWidth,
} from './lib/breakpoints';
export {
  PortalContainerProvider,
  usePortalContainer,
  type PortalContainerProviderProps,
} from './lib/portal-container';
export * from './components/ui/accordion';
export * from './components/ui/alert';
export * from './components/ui/alert-dialog';
export * from './components/ui/app-shell';
export * from './components/ui/aspect-ratio';
export * from './components/ui/auth-layout';
export * from './components/ui/avatar';
export * from './components/ui/bar-chart';
export * from './components/ui/breadcrumb';
export * from './components/ui/button';
export * from './components/ui/button-group';
export * from './components/ui/button-menu';
export * from './components/ui/button-menu-dropdown';
export * from './components/ui/calendar';
export * from './components/ui/card';
export * from './components/ui/card-filter';
export * from './components/ui/card-grid';
export * from './components/ui/carousel';
export * from './components/ui/chart';
export * from './components/ui/chart-state';
export * from './components/ui/checkbox';
export * from './components/ui/checkbox-group';
export * from './components/ui/chip';
export * from './components/ui/collapsible';
export * from './components/ui/combobox';
export * from './components/ui/autocomplete';
export * from './components/ui/command';
export * from './components/ui/confirm-dialog';
export * from './components/ui/data-grid';
export * from './components/ui/data-table';
export * from './components/ui/description-list';
export * from './components/ui/detail-list';
export * from './components/ui/dialog';
export * from './components/ui/drawer';
export * from './components/ui/dropdown-menu';
export * from './components/ui/empty';
export * from './components/ui/field';
export * from './components/ui/filter';
export * from './components/ui/fitted-actions';
export * from './components/ui/grid';
export * from './components/ui/form';
export * from './components/ui/form-layout';
export * from './components/ui/radio';
export * from './components/ui/input';
export * from './components/ui/input-date-picker';
export * from './components/ui/input-search';
export * from './components/ui/input-select';
export * from './components/ui/input-text';
export * from './components/ui/input-text-area';
export * from './components/ui/label';
export * from './components/ui/line-chart';
export * from './components/ui/link';
export * from './components/ui/menu';
export * from './components/ui/meter';
export * from './components/ui/navigation-menu';
export * from './components/ui/number-field';
export * from './components/ui/otp-field';
export * from './components/ui/page-content';
export * from './components/ui/page-header';
export * from './components/ui/pagination';
export * from './components/ui/popover';
export * from './components/ui/progress';
export * from './components/ui/progress-circle';
export * from './components/ui/scroll-area';
export * from './components/ui/search-global';
// `Input` / `Search` / `Textarea` are aliases of the full-field components
// `InputText` / `InputSearch` / `InputTextArea`. The bare input/search boxes are
// internal primitives (`InputBox` / `SearchBox`), consumed by those fields and
// not exported.
export {
  InputText as Input,
  type InputTextProps as InputProps,
} from './components/ui/input-text';
export {
  InputSearch as Search,
  type InputSearchProps as SearchProps,
} from './components/ui/input-search';
export {
  InputTextArea as Textarea,
  type InputTextAreaProps as TextareaProps,
} from './components/ui/input-text-area';
export * from './components/ui/section';
export * from './components/ui/select';
export * from './components/ui/separator';
export * from './components/ui/sheet';
export * from './components/ui/skeleton';
export * from './components/ui/slider';
export * from './components/ui/spinner';
export * from './components/ui/stack';
export * from './components/ui/stat-row';
export * from './components/ui/resizable';
export * from './components/ui/sidebar-primary';
export * from './components/ui/sidebar-secondary';
export * from './components/ui/button-icon';
export * from './components/ui/button-icon-menu';
export * from './components/ui/switch';
export * from './components/ui/table';
export * from './components/ui/tabs';
export * from './components/ui/toast';
// `Notification` / `notification` alias the toast surface — the Figma design of
// this component is named "Notification", and toasts are this kit's notification
// pattern. `Notification` renders the region (= `Toaster`); `notification(...)`
// triggers one (= `toast`, with `.success`/`.error`/… helpers). No separate
// component.
export {
  Toaster as Notification,
  toast as notification,
  type ToasterProps as NotificationProps,
} from './components/ui/toast';
export * from './components/ui/toggle-group';
export * from './components/ui/toolbar';
export * from './components/ui/tooltip';
export * from './components/ui/tour';
export * from './components/ui/tree';
export * from './components/ui/truncated-text';
export * from './components/ui/tag';
// `Badge` is an alias of `Tag`. The legacy generic shadcn Badge is replaced by
// the design-system-native Tag (its own `--ui-tag-*` token tier, icon slot, and
// sizes); Tag's variants are exactly Badge's status set. No separate component.
export { Tag as Badge, type TagProps as BadgeProps } from './components/ui/tag';
export * from './components/ui/widget';
export * from './components/ui/widget-alert';
export * from './components/ui/widget-placeholder';
export * from './components/ui/widget-progress-chunks';
export * from './components/ui/widget-progress-tiers';
export * from './components/ui/widget-protection-status';
export * from './components/ui/widget-protection-summary';
export * from './components/ui/widget-table-data';
export * from './components/ui/widget-text';
