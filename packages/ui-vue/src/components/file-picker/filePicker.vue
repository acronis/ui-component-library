<script setup lang="ts">
  import type {
    AcvFilePickerEvents,
    AcvFilePickerProps,
    AcvFilePickerSlots
  } from './filePicker.ts';
  import './filePicker.css';

  const { title, description } = defineProps<AcvFilePickerProps>();

  defineEmits<AcvFilePickerEvents>();
  defineSlots<AcvFilePickerSlots>();
</script>

<template>
  <div class="acv-file-picker">
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
  .acv-file-picker {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-file-picker-color);
  }
</style>
