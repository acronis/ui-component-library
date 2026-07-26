<script setup lang="ts">
  import type {
    AcvProgressEvents,
    AcvProgressProps,
    AcvProgressSlots
  } from './progress.ts';
  import './progress.css';

  const { title, description } = defineProps<AcvProgressProps>();

  defineEmits<AcvProgressEvents>();
  defineSlots<AcvProgressSlots>();
</script>

<template>
  <div class="acv-progress">
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
  .acv-progress {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-progress-color);
  }
</style>
