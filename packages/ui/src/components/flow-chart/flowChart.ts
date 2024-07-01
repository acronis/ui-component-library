export interface AcvFlowChartProps {
  /**
   * Title of the FlowChart
   */
  title?: string

  /**
   * Description of the FlowChart
   */
  description?: string
}

export interface AcvFlowChartEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFlowChartSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}
