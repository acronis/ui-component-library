<script setup lang="ts">
  import type {
    AcvDatePickerEvents,
    AcvDatePickerProps,
    AcvDatePickerSlots
  } from '@/components/__todo__/date-picker/datePicker.ts';
  import '@/components/__todo__/date-picker/datePicker.css';

  const { title, description } = defineProps<AcvDatePickerProps>();

  defineEmits<AcvDatePickerEvents>();
  defineSlots<AcvDatePickerSlots>();
</script>

<template>
  <div class="acv-date-picker">
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
  .acv-date-picker {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-date-picker-color);
  }
</style>
