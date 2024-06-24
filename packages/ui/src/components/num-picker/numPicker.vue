<script setup lang="ts">
  import type {
    AcvNumPickerEvents,
    AcvNumPickerProps,
    AcvNumPickerSlots
  } from './numPicker.ts';
  import './numPicker.css';

  const { title, description } = defineProps<AcvNumPickerProps>();

  defineEmits<AcvNumPickerEvents>();
  defineSlots<AcvNumPickerSlots>();
</script>

<template>
  <div class="acv-num-picker">
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
  .acv-num-picker {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-num-picker-color);
  }
</style>
