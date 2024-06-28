<script setup lang="ts">
  import type {
    AcvFlowChartEvents,
    AcvFlowChartProps,
    AcvFlowChartSlots
  } from './flowChart.ts';
  import './flowChart.css';

  const { title, description } = defineProps<AcvFlowChartProps>();

  defineEmits<AcvFlowChartEvents>();
  defineSlots<AcvFlowChartSlots>();
</script>

<template>
  <div class="acv-flow-chart">
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-flow-chart {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-flow-chart-color);
  }
</style>
