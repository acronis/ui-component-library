type labelPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface AcvFormLabelProps {
  /**
   * Title of the FormLabel
   */
  label?: string

  /**
   * Description of the FormLabel
   */
  description?: string

  /**
   * Placement of the label
   * @values left, right, top, bottom
   * @defaultValue right
   */
  placement?: labelPlacement
}

export interface AcvFormLabelSlots {
  /**
   * The default slot content for form control element
   */
  default: void
  label: void
  description: void
}
