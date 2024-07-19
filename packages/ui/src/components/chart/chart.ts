import type { ChartData, ChartOptions, ChartType, Plugin, UpdateMode } from 'chart.js';

export const DESTROY_DELAY = 0;
export interface AcvChartProps {
  /**
   * Type of the Chart.Js chart
   */
  type: ChartType

  /**
   * The data object that is passed into the Chart.js chart
   * @see https://www.chartjs.org/docs/latest/getting-started/
   */
  data: ChartData

  /**
   * The options object that is passed into the Chart.js chart
   * @see https://www.chartjs.org/docs/latest/general/options.html
   * @defaultValue {}
   */
  options?: ChartOptions

  /**
   * Plugins for the chart
   * @see https://www.chartjs.org/docs/latest/developers/plugins.html
   * @defaultValue []
   */
  plugins?: Plugin[]

  /**
   * Update mode for the chart
   * @default undefined
   * @see https://www.chartjs.org/docs/latest/developers/api.html#update
   * @values 'resize', 'reset', 'none', 'hide', 'show', 'default', 'active'
   */
  updateMode?: UpdateMode

  /**
   * Key name to identify dataset
   * @default 'label'
   */
  datasetIdKey?: string
}
