<script setup lang="ts">
  import type {
    AcvSpinnerEvents,
    AcvSpinnerProps,
    AcvSpinnerSlots
  } from './spinner.ts';
  import './spinner.css';

  const { title, description } = defineProps<AcvSpinnerProps>();

  defineEmits<AcvSpinnerEvents>();
  defineSlots<AcvSpinnerSlots>();
</script>

<template>
  <div class="acv-spinner">
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
  .acv-spinner {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-spinner-color);
  }
</style>
