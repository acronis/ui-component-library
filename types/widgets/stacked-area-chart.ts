import { UIKitComponent } from '../component'

/** Stacked Area Chart Item */
export interface StackedAreaChartItem {
  /* Type of data */
  dataType: 'size' | 'default'

  /* Name of item */
  name: string

  /* Data points */
  series: object[]

  /* X-axis labels */
  labels: string[]
}

/** Stacked Area Chart Component */
export declare class ElStackedAreaChart extends UIKitComponent {
  /* Array of colors in hex values. Colors will be repeated in sequence if there are more data points than colors. */
  colors: string[]

  /* Stacked Area Chart data. Negative values for points are not accepted. */
  data: StackedAreaChartItem

  /* Height of chart */
  height: string

  /* Toggles visibility of legend */
  legend: boolean

  /* 	Number of digits to be shown after decimal point */
  precision: number

  /* Width of chart */
  width: string
}
