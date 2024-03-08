import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface PieChartSlots {
  /** 	Content of summary (displayed in the center of the pie chart) */
  summary: VNode[],

  [key: string]: VNode[]
}

/** Pie Chart Item */
export interface PieChartItem {
  /* Type of data */
  dataType: 'size' | 'default'

  /* Name of item */
  name: string

  /* Labels */
  labels: string[]

  /* Data points */
  points: number[]
}

/** Pie Chart Component */
export declare class ElPieChart extends UIKitComponent {
  /* Array of colors in hex values. Colors will be repeated in sequence if there are more data points than colors. */
  colors: string[]

  /* Pie Chart data. Negative values for points are not accepted. */
  data: PieChartItem

  /* Toggles visibility of legend */
  legend: boolean

  /* 	Number of digits to be shown after decimal point */
  precision: number

  /* Toggles visibility of summary */
  summary: boolean

  $slots: PieChartSlots
}
