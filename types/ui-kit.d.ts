import Vue from 'vue'
import { UIKitComponent, UIKitComponentSize, UIKitHorizontalAlignment } from './component'

import { ElAbout } from './widgets/about-window'
import { ElAlert } from './alert'
import { ElAside } from './aside'
import { ElAutocomplete } from './autocomplete'
import { ElBreadcrumb } from './breadcrumb'
import { ElBreadcrumbItem } from './breadcrumb-item'
import { ElButton } from './button'
import { ElCard } from './card'
import { ElCarousel } from './carousel'
import { ElCarouselItem } from './carousel-item'
import { ElCascader } from './cascader'
import { ElCheckbox } from './checkbox'
import { ElCheckboxButton } from './checkbox-button'
import { ElCheckboxGroup } from './checkbox-group'
import { ElChip } from './chip'
import { ElCol } from './col'
import { ElCollapse } from './collapse'
import { ElCollapseItem } from './collapse-item'
import { ElCombobox } from './combobox'
import { ElContainer } from './container'
import { ElDatePicker } from './date-picker'
import { ElDetails } from './widgets/details';
import { ElDetailsTable } from './widgets/details-table';
import { ElDetailsView } from './widgets/details-view';
import { ElDialog } from './dialog'
import { ElDivider } from './divider'
import { ElDropdown } from './dropdown'
import { ElDropdownItem } from './dropdown-item'
import { ElDropdownMenu } from './dropdown-menu'
import { ElFileBrowser } from './file-browser'
import { ELFilePicker } from './file-picker'
import { ElFilter } from './filter'
import { ElFooter } from './footer'
import { ElForm } from './form'
import { ElFormError } from './form-error'
import { ElFormItem } from './form-item'
import { ElHeader } from './widgets/header'
import { ElHeaderMenu } from './widgets/header-menu'
import { ElHeaderSearch } from './widgets/header-search'
import { ElIcon } from './icon'
import { ElInput } from './input'
import { ElLink } from './link'
import { ElLineChart } from './widgets/line-chart';
import { ElLiveTracker } from './widgets/live-tracker';
import { ElLoading } from './loading'
import { ElLoadingComplex } from './widgets/loading-complex';
import { ElMain } from './main'
import { ElMap } from './map'
import { ElMenu } from './menu'
import { ElMenuGroup } from './menu-group'
import { ElMenuItem } from './menu-item'
import { ElMultiSearch } from './multi-search'
import { ElNotification } from './notification'
import { ElNumPicker } from './num-picker'
import { ElOption } from './option'
import { ElOptionGroup } from './option-group'
import { ElPagination } from './pagination'
import { ElPieChart } from './widgets/pie-chart'
import { ElPopover } from './popover'
import { ElProgress } from './progress'
import { ElProgressRadial } from './widgets/progress-radial'
import { ElRadio } from './radio'
import { ElRadioButton } from './radio-button'
import { ElRadioGroup } from './radio-group'
import { ElRow } from './row'
import { ElScriptEditor } from './script-editor'
import { ElSearch } from './search'
import { ElSelect } from './select'
import { ElSidebarLayout } from './widgets/sidebar-layout'
import { ElSidebarPanel } from './widgets/sidebar-panel'
import { ElSlider } from './slider'
import { ElSplitButton } from './split-button'
import { ElStackedAreaChart } from './widgets/stacked-area-chart';
import { ElStep } from './step'
import { ElStepper } from './stepper'
import { ElStepperItem } from './stepper-item'
import { ElSteps } from './steps'
import { ElSubmenu } from './submenu'
import { ElSwitch } from './switch'
import { ElTable } from './table'
import { ElTableActionItem } from './table-action-item'
import { ElTableActionsColumn } from './table-actions-column'
import { ElTableColumn } from './table-column'
import { ElTableRowsGroup } from './table-rows-group'
import { ElTableWidget } from './widgets/table-widget'
import { ElTabPane } from './tab-pane'
import { ElTabs } from './tabs'
import { ElTag } from './tag'
import { ElTiles } from './tiles'
import { ElTd } from './table-data-cell'
import { ElTimePicker } from './time-picker'
import { ElToolbar } from './widgets/toolbar'
import { ElToolbarAction } from './widgets/toolbar-action'
import { ElToolbarContainer } from './widgets/toolbar-container'
import { ElToolbarSearch } from './widgets/toolbar-search'
import { ElTooltip } from './tooltip'
import { ElTree } from './tree'
import { ElUpload } from './upload'
import { ElWhatIsNew } from './widgets/what-is-new'
import { ElWidgetWrapper } from './widgets/widget-wrapper'
import { ElRibbon } from './alert-ribbon'

export interface InstallationOptions {
    locale: any,
    i18n: any,
    size: string
}

/** The version of ui-kit */
export const version: string

/**
 * Install all ui-kit components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(UIKit)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void

type TranslationMessages = {
  [key: string]: TranslationMessages | string;
}

export function locale (lang: TranslationMessages): void

/** UIKit component common definition */
export type Component = UIKitComponent

/** Component size definition for button, input, etc */
export type ComponentSize = UIKitComponentSize

/** Horizontal alignment */
export type HorizontalAlignment = UIKitHorizontalAlignment

/** Show animation while loading data */
export const Loading: ElLoading

/** Displays a global notification message at the upper right corner of the page */
export const Notification: ElNotification

// TS cannot merge imported class with namespace, so declare subclasses instead

/** About Widget */
export class About extends ElAbout {}

/** Alert Component */
export class Alert extends ElAlert {}

/** Aside Component */
export class Aside extends ElAside {}

/** Autocomplete Component */
export class Autocomplete extends ElAutocomplete {}

/** Breadcrumb Component */
export class Breadcrumb extends ElBreadcrumb {}

/** Breadcrumb Item Component */
export class BreadcrumbItem extends ElBreadcrumbItem {}

/** Button Component */
export class Button extends ElButton {}

/** Split Button Component */
export class SplitButton extends ElSplitButton {}

/** Card Component */
export class Card extends ElCard {}

/** Carousel Component */
export class Carousel extends ElCarousel {}

/** CarouselItem Component */
export class CarouselItem extends ElCarouselItem {}

/** Cascader Component */
export class Cascader extends ElCascader {}

/** Checkbox Component */
export class Checkbox extends ElCheckbox {}

/** Checkbox Button Component */
export class CheckboxButton extends ElCheckboxButton {}

/** Checkbox Group Component */
export class CheckboxGroup extends ElCheckboxGroup {}

/** Chip Component */
export class Chip extends ElChip {}

/** Colunm Layout Component */
export class Col extends ElCol {}

/** Collapse Component */
export class Collapse extends ElCollapse {}

/** Collapse Item Component */
export class CollapseItem extends ElCollapseItem {}

/** Combobox Component */
export class Combobox extends ElCombobox {}

/** Container Component */
export class Container extends ElContainer {}

/** Date Picker Component */
export class DatePicker extends ElDatePicker {}

/** Details widget */
export class Details extends ElDetails {}

/** Details widget view */
export class DetailsView extends ElDetailsView {}

/** Details widget table */
export class DetailsTable extends ElDetailsTable {}

/** Dialog Component */
export class Dialog extends ElDialog {}

/** Divider Component */
export class Divider extends ElDivider {}

/** Dropdown Component */
export class Dropdown extends ElDropdown {}

/** Dropdown Item Component */
export class DropdownItem extends ElDropdownItem {}

/** Dropdown Menu Component */
export class DropdownMenu extends ElDropdownMenu {}

/** File Browser Component */
export class FileBrowser extends ElFileBrowser {}

/** Filter Component */
export class Filter extends ElFilter {}

/** Footer Component */
export class Footer extends ElFooter {}

/** Form Component */
export class Form extends ElForm {}

/** Form Error Component */
export class FormError extends ElFormError {}

/** Form Item Component */
export class FormItem extends ElFormItem {}

/** Header Component */
export class Header extends ElHeader {}

/** Header Menu Widget */
export class HeaderMenu extends ElHeaderMenu {}

/** Header Search Widget */
export class HeaderSearch extends ElHeaderSearch {}

/** Icon Component */
export class Icon extends ElIcon {}

/** Input Component */
export class Input extends ElInput {}

/** Input File Component */
export class FilePicker extends ELFilePicker {}

/** Input Number Component */
export class InputNumber extends ElNumPicker {}

/** Link component */
export class Link extends ElLink {}

/** Line Chart component */
export class LineChart extends ElLineChart {}

/** LiveTracker Component */
export class LiveTracker extends ElLiveTracker {}

/** LoadingComplex Component */
export class LoadingComplex extends ElLoadingComplex {}

/** Main Component */
export class Main extends ElMain {}

/** Map Component */
export class Map extends ElMap {}

/** Menu that provides navigation for your website */
export class Menu extends ElMenu {}

/** Menu Item Component */
export class MenuItem extends ElMenuItem {}

/** Menu Group Component */
export class MenuGroup extends ElMenuGroup {}

/** Dropdown Select Option Component */
export class Option extends ElOption {}

/** Dropdown Select Option Group Component */
export class OptionGroup extends ElOptionGroup {}

/** Pagination Component */
export class Pagination extends ElPagination {}

/** PieChart Component */
export class PieChart extends ElPieChart {}

/** Popover Component */
export class Popover extends ElPopover {}

/** Progress Component */
export class Progress extends ElProgress {}

/** Progress Radial Component */
export class ProgressRadial extends ElProgressRadial {}

/** Radio Component */
export class Radio extends ElRadio {}

/** Radio Button Component */
export class RadioButton extends ElRadioButton {}

/** Radio Group Component */
export class RadioGroup extends ElRadioGroup {}

/** Row Layout Component */
export class Row extends ElRow {}

/** Script Editor Component */
export class ScriptEditor extends ElScriptEditor {}

/** Tag Component */
export class Search extends ElSearch {}

/** Dropdown Select Component */
export class Select extends ElSelect {}

/** Sidebar Layout Component */
export class SidebarLayout extends ElSidebarLayout {}

/** Sidebar Panel Component */
export class SidebarPanel extends ElSidebarPanel {}

/** Slider Component */
export class Slider extends ElSlider {}

/** Pie Chart Component */
export class StackedAreaChart extends ElStackedAreaChart {}

/** Step Component */
export class Step extends ElStep {}

/** Steps Component */
export class Steps extends ElSteps {}

/** Stepper Component */
export class Stepper extends ElStepper {}

/** Stepper Item Component */
export class StepperItem extends ElStepperItem {}

/** Submenu Component */
export class Submenu extends ElSubmenu {}

/** Switch Component */
export class Switch extends ElSwitch {}

/** Table Component */
export class Table extends ElTable {}

/** Table Column Component */
export class TableColumn extends ElTableColumn {}

/** Table Rows Group Component */
export class TableRowsGroup extends ElTableRowsGroup {}

/** Table Actions Column Component */
export class TableActionsColumn extends ElTableActionsColumn {}

/** Table Action Item Component */
export class TableActionItem extends ElTableActionItem {}

/** Table Data Cell Component */
export class TableDataCell extends ElTd {}

/** TableWidget Component */
export class TableWidget extends ElTableWidget {}

/** Tabs Component */
export class Tabs extends ElTabs {}

/** Tab Pane Component */
export class TabPane extends ElTabPane {}

/** Tag Component */
export class Tag extends ElTag {}

/** Tiles Component */
export class Tiles extends ElTiles {}

/** Tag Component */
export class TimePicker extends ElTimePicker {}

/** Tooltip Component */
export class Toolbar extends ElToolbar {}

/** Tooltip Action Component */
export class ToolbarAction extends ElToolbarAction {}

/** Tooltip Component */
export class ToolbarContainer extends ElToolbarContainer {}

/** Tooltip Component */
export class ToolbarSearch extends ElToolbarSearch {}

/** MultiSearch Component */
export class MultiSearch extends ElMultiSearch {}

/** Tooltip Component */
export class Tooltip extends ElTooltip {}

/** Tree Component */
export class Tree extends ElTree {}

/** Upload Component */
export class Upload extends ElUpload {}

/** WhatIsNew Component */
export class WhatIsNew extends ElWhatIsNew {}

/** WidgetWrapper Component */
export class WidgetWrapper extends ElWidgetWrapper {}

export class Ribbon extends ElRibbon {}

export {
  Locale,
  LocaleMessages,
  getLocale,
  getLocales,
  setLocaleMessages
} from './locale';
