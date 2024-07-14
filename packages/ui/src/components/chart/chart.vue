<script setup lang="ts">
  import './chart.css';
  import type { AcvChartProps } from './chart.ts';

  const { title, description } = defineProps<AcvChartProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-chart">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-chart {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-chart-color);
  }
</style>
