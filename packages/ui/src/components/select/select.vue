<script setup lang="ts">
  import type {
    AcvSelectEvents,
    AcvSelectProps,
    AcvSelectSlots
  } from './select.ts';
  import './select.css';

  const { title, description } = defineProps<AcvSelectProps>();

  defineEmits<AcvSelectEvents>();
  defineSlots<AcvSelectSlots>();
</script>

<template>
  <div class="acv-select">
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
  .acv-select {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-select-color);
  }
</style>
