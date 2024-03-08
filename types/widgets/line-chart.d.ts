import { UIKitComponent } from '../component'
import { VNode } from 'vue'

/** Line Chart Item */
export interface LineChartItem {
  /* Type of data */
  dataType: 'size' | 'default'

  /* Data points */
  series: object[]

  /* X-axis labels */
  labels: Date[]
}

/** Line Chart Slots */
export interface LineChartSlots {
  /** Content of tooltip */
  tooltipbody: VNode[],

  [key: string]: VNode[]
}

/** Line Chart Component */
export declare class ElLineChart extends UIKitComponent {
  /* Toggles if chart is rendered as area chart */
  area: boolean

  /* 	Array of background colors. Colors will be repeated in sequence if there are more data points than colors. */
  bgColors: string[]

  /* Array of colors. Colors will be repeated in sequence if there are more data points than colors. */
  colors: string[]

  /* Line Chart data */
  data: LineChartItem

  /* Show data points on hover */
  dataPointOnHover: boolean

  /* Height of chart */
  height: string

  /* Toggles visibility of legend */
  legend: boolean

  /* 	Number of digits to be shown after decimal point */
  precision: number

  /* Toggles stepped nature of line */
  stepped: boolean

  /* 	Unit of time to be used in X axis */
  timeUnit: string

  /* Toggles visibility of tooltip */
  tooltip: boolean

  /* Format of time displayed in tooltip */
  tooltipTimeFormat: string

  /* Toggles if variable threshold values are passed */
  variableThreshold: boolean

  /* Width of chart. When not defined, chart will take width of parent container. */
  width: string

  /* Toggles visibility of X axis */
  xAxis: boolean

  /* Toggles visibility of vertical grid lines */
  xGrid: boolean

  /* Toggles visibility of Y axis */
  yAxis: boolean

  /* Upper limit for the number of ticks displayed on the Y axis */
  yAxisTicksUpperLimit: number

  /* Toggles visibility of horizontal grid lines */
  yGrid: boolean

  /* Toggles if values are to be rendered as percentages */
  yPercent: boolean

  $slots: LineChartSlots
}

