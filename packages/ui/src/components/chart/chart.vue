<script setup lang="ts">
  import Chart from 'chart.js/auto';
  import { nextTick, onMounted, onUnmounted, ref, shallowRef, toRaw, watch } from 'vue';
  import { toValue } from '@vueuse/core';
  import type { AcvChartProps } from './chart.ts';
  import { DESTROY_DELAY } from './chart.ts';
  import './chart.css';
  import { cloneData, cloneProxy, setDatasets, setLabels, setOptions } from './utils.ts';

  const props = withDefaults(defineProps<AcvChartProps>(), {
    type: 'bar',
    datasetIdKey: 'id'
  });

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const chartRef = shallowRef<Chart | null>(null);

  function renderChart() {
    if (!canvasRef.value)
      return;

    const { type, data, options, plugins, datasetIdKey } = props;
    const clonedData = cloneData(data, datasetIdKey);
    const proxiedData = cloneProxy(clonedData, data);

    chartRef.value = new Chart(canvasRef.value, {
      type,
      data: proxiedData,
      options: { ...options },
      plugins
    });
  }

  function destroyChart() {
    const chart = toRaw(chartRef.value);

    if (chart) {
      if (DESTROY_DELAY > 0) {
        setTimeout(() => {
          chart.destroy();
          chartRef.value = null;
        }, DESTROY_DELAY);
      }
      else {
        chart.destroy();
        chartRef.value = null;
      }
    }
  }

  function update(chart: Chart) {
    chart.update(props.updateMode);
  }

  onMounted(renderChart);

  onUnmounted(destroyChart);

  watch(
    [() => props.options, () => props.data],
    (
      [nextOptionsProxy, nextDataProxy],
      [prevOptionsProxy, prevDataProxy]
    ) => {
      const chart = toRaw(chartRef.value);

      if (!chart) {
        return;
      }

      let shouldUpdate = false;

      if (nextOptionsProxy) {
        const nextOptions = toValue(nextOptionsProxy);
        const prevOptions = toValue(prevOptionsProxy);

        if (nextOptions && nextOptions !== prevOptions) {
          setOptions(chart, nextOptions);
          shouldUpdate = true;
        }
      }

      if (nextDataProxy) {
        const nextLabels = toValue(nextDataProxy.labels);
        const prevLabels = toValue(prevDataProxy.labels);
        const nextDatasets = toValue(nextDataProxy.datasets);
        const prevDatasets = toValue(prevDataProxy.datasets);

        if (nextLabels !== prevLabels) {
          setLabels(chart.config.data, nextLabels);
          shouldUpdate = true;
        }

        if (nextDatasets && nextDatasets !== prevDatasets) {
          setDatasets(chart.config.data, nextDatasets, props.datasetIdKey);
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        nextTick(() => {
          update(chart);
        });
      }
    },
    { deep: true }
  );
</script>

<template>
  <canvas
    ref="canvasRef"
    role="img"
    class="acv-chart"
  >
    <slot />
  </canvas>
</template>

<style scoped>
  .acv-chart {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-chart-color);
  }
</style>
