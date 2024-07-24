import type { ExtractPropTypes, PropType } from 'vue';
import type { ConfigurableProps, UikitProps } from '../../utils/props.ts';
import { buildProps } from '../../utils/props.ts';
import type { Expand } from '../../types/generic.ts';

export const ALERT_VARIANT = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
  error: 'error',
  unknown: 'unknown',
} as const;

export type AcvAlertVariant = typeof ALERT_VARIANT[keyof typeof ALERT_VARIANT];

export const AcvAlertIconTypes = {
  [ALERT_VARIANT.info]: 'clr-info--16',
  [ALERT_VARIANT.success]: 'clr-success--16',
  [ALERT_VARIANT.warning]: 'clr-warning--16',
  [ALERT_VARIANT.critical]: 'clr-critical--16',
  [ALERT_VARIANT.error]: 'clr-danger--16',
  [ALERT_VARIANT.unknown]: 'clr-unknown--16'
};

export interface AcvAlertProps {
  /** Descriptive text. Can also be passed with the default slot */
  description?: string

  /** Displays border */
  showBorder?: boolean

  /**
   * Is close icon visible
   */
  showClose?: boolean

  /** If a variant icon is displayed */
  showIcon?: boolean

  /** Title, can also be passed with the slot */
  title?: string

  /** Subtitle, can also be passed with the slot    */
  subtitle?: string

  /** Alert variant */
  color?: AcvAlertVariant
}

export const alertProps: Expand<UikitProps<{ inherit: { default: null, type: BooleanConstructor } } & {
  showClose: BooleanConstructor
  subtitle: StringConstructor
  variant: PropType<AcvAlertVariant>
  description: { type: StringConstructor, required: boolean }
  title: StringConstructor
  showBorder: BooleanConstructor
  showIcon: BooleanConstructor
}>> = buildProps(
  {
    /** Descriptive text. Can also be passed with the default slot */
    description: String,

    /** Displays border */
    showBorder: Boolean,

    /**
     * Is close icon visible
     */
    showClose: Boolean,

    /** If a variant icon is displayed */
    showIcon: Boolean,

    /** Title, can also be passed with the slot */
    title: String,

    /** Subtitle, can also be passed with the slot    */
    subtitle: String,

    /** Alert variant */
    variant: String as PropType<AcvAlertVariant>
  }
);

export interface AcvAlertEvents {
  /**
   * Emitted when the close button is clicked.
   */
  (e: 'close'): void
}

// export type AcvAlertProps = ExtractPropTypes<typeof alertProps>;

export type AlertConfigurableProps = ConfigurableProps<ExtractPropTypes<typeof alertProps>>;

export interface AcvAlertSlots {
  /**
   * Custom content
   */
  default?: void

  /**
   * Title
   * @binding {string} title - content of the title
   */
  title?: string | (() => NonNullable<unknown>)

  /**
   * Subtitle
   * @binding {string} subtitle - content of the subtitle
   */
  description?: string | (() => NonNullable<unknown>)

  /**
   * Content for the AcvAlert icon
   */
  icon?: (() => NonNullable<unknown>)

  /**
   * Content for the actions
   */
  actions?: void

  /**
   * Content for the right block
   */
  right?: () => NonNullable<unknown>
}
