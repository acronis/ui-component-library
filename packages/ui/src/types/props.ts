import type {
  BlockquoteConfigurableProps,
  H1ConfigurableProps,
  H2ConfigurableProps,
  H3ConfigurableProps,
  H4ConfigurableProps,
  H5ConfigurableProps,
  H6ConfigurableProps,
  OLConfigurableProps,
  PConfigurableProps,
  StrongConfigurableProps,
  TextConfigurableProps,
  TitleConfigurableProps,
  ULConfigurableProps
} from '../components/typography/public.ts';
import type { AlertConfigurableProps } from '../index.ts';
import type { ColorBrand, ColorName, ColorState, ColorStatus } from '../utils/color.ts';

interface SuggestedDefault {
  size?: ComponentSize
  state?: ComponentState
  transfer?: boolean | string
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
}

export interface PropsOptions {
  default?: SuggestedDefault & Record<string, any>
  alert?: AlertConfigurableProps
  // autoComplete?: AutoCompleteConfigurableProps
  // breadcrumb?: BreadcrumbConfigurableProps
  // button?: ButtonConfigurableProps
  // buttonGroup?: ButtonGroupConfigurableProps
  // captcha?: CaptchaConfigurableProps
  // card?: CardConfigurableProps
  // carousel?: CarouselConfigurableProps
  // cascader?: CascaderConfigurableProps
  // cell?: CellConfigurableProps
  // checkbox?: CheckboxConfigurableProps
  // checkboxGroup?: CheckboxGroupConfigurableProps
  // collapse?: CollapseConfigurableProps
  // collapsePanel?: CollapsePanelConfigurableProps
  // collapseTransition?: CollapseTransitionConfigurableProps
  // column?: ColumnConfigurableProps
  // confirm?: ConfirmConfigurableProps
  // datePicker?: DatePickerConfigurableProps
  // divider?: DividerConfigurableProps
  // dropdown?: DropdownConfigurableProps
  // ellipsis?: EllipsisConfigurableProps
  // form?: FormConfigurableProps
  // formItem?: FormItemConfigurableProps
  // formReset?: FormResetConfigurableProps
  // formSubmit?: FormSubmitConfigurableProps
  // grid?: GridConfigurableProps
  // highlight?: HighlightConfigurableProps
  // icon?: IconConfigurableProps
  // input?: InputConfigurableProps
  // link?: LinkerConfigurableProps
  // mask?: MaskerConfigurableProps
  // menu?: MenuConfigurableProps
  // menuItem?: MenuItemConfigurableProps
  // modal?: ModalConfigurableProps
  // pagination?: PaginationConfigurableProps
  // radio?: RadioConfigurableProps
  // radioGroup?: RadioGroupConfigurableProps
  // resizeObserver?: ResizeObserverConfigurableProps
  // row?: RowConfigurableProps
  // scrollbar?: ScrollbarConfigurableProps
  // select?: SelectConfigurableProps
  // skeleton?: SkeletonConfigurableProps
  // switch?: SwitchConfigurableProps
  // tabNav?: TabNavConfigurableProps
  // table?: TableConfigurableProps
  // tableColumn?: TableColumnConfigurableProps
  // tableColumnGroup?: TableColumnGroupConfigurableProps
  // tableSummary?: TableSummaryConfigurableProps
  // tabs?: TabsConfigurableProps
  // tag?: TagConfigurableProps
  // textarea?: TextareaConfigurableProps
  // timePicker?: TimePickerConfigurableProps
  // tooltip?: TooltipConfigurableProps
  // tree?: TreeConfigurableProps
  // upload?: UploadConfigurableProps
  // virtualList?: VirtualListConfigurableProps
  title?: TitleConfigurableProps
  text?: TextConfigurableProps
  blockquote?: BlockquoteConfigurableProps
  ol?: OLConfigurableProps
  ul?: ULConfigurableProps
  h1?: H1ConfigurableProps
  h2?: H2ConfigurableProps
  h3?: H3ConfigurableProps
  h4?: H4ConfigurableProps
  h5?: H5ConfigurableProps
  h6?: H6ConfigurableProps
  p?: PConfigurableProps
  strong?: StrongConfigurableProps
}

export type IconProp = object | (() => NonNullable<unknown>) | string;
export type ColorProp =
  ColorBrand
  | ColorStatus
  | ColorName
  | ColorState;
export type ComponentSize = 'small' | 'medium' | 'large';
export type ComponentState = 'default' | 'success' | 'warning' | 'error' | 'critical' | 'info' | 'disabled';

export interface ColorProps {
  /**
   * Background color
   * @values transparent, primary, secondary, success, warning, danger, info, inverted
   */
  color?: ColorProp

  /**
   * Layer background color
   */
  backgroundColor?: ColorProp

  /**
   * Layer border color
   */
  borderColor?: ColorProp

  /**
   * Layer text color
   */
  textColor?: ColorProp
}
