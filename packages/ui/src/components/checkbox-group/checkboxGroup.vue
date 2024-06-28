<script setup lang="ts">
  import type {
    AcvCheckboxGroupEvents,
    AcvCheckboxGroupProps,
    AcvCheckboxGroupSlots
  } from './checkboxGroup.ts';
  import './checkboxGroup.css';

  const { title, description } = defineProps<AcvCheckboxGroupProps>();

  defineEmits<AcvCheckboxGroupEvents>();
  defineSlots<AcvCheckboxGroupSlots>();
</script>

<template>
  <div class="acv-checkbox-group">
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
  .acv-checkbox-group {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-checkbox-group-color);
  }
</style>
