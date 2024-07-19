import type { ChartComponent, ChartType, Plugin } from 'chart.js';
import {
  BarController,
  BubbleController,
  Chart as ChartJS,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController
} from 'chart.js';
import type { PropType } from 'vue';
import { defineComponent, h, shallowRef } from 'vue';
import type { AcvChartProps } from './chart.ts';
import AcvChart from './chart.vue';

export function createTypedChart(
  type: ChartType,
  registerables: ChartComponent | { [p: string]: ChartComponent } | Plugin[]
): any {
  ChartJS.register(registerables);

  return defineComponent({
    props: {
      data: { type: Object as PropType<AcvChartProps['data']>, required: true },
      options: { type: Object as PropType<AcvChartProps['options']>, required: true }
    },
    setup(props) {
      const chartRef = shallowRef<ChartJS | null>(null);

      return () => h(AcvChart, {
        ref: chartRef,
        type,
        data: props.data,
        options: props.options
      });
    }
  });
}

export const Bar = createTypedChart('bar', BarController);

export const Doughnut = createTypedChart('doughnut', DoughnutController);

export const Line = createTypedChart('line', LineController);

export const Pie = createTypedChart('pie', PieController);

export const PolarArea = createTypedChart('polarArea', PolarAreaController);

export const Radar = createTypedChart('radar', RadarController);

export const Bubble = createTypedChart('bubble', BubbleController);

export const Scatter = createTypedChart('scatter', ScatterController);
