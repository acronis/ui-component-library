<script setup lang="ts">
  import type {
    AcvRadioGroupEvents,
    AcvRadioGroupProps,
    AcvRadioGroupSlots
  } from './radioGroup.ts';
  import './radioGroup.css';

  const { title, description } = defineProps<AcvRadioGroupProps>();

  defineEmits<AcvRadioGroupEvents>();
  defineSlots<AcvRadioGroupSlots>();
</script>

<template>
  <div class="acv-radio-group">
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
  .acv-radio-group {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-radio-group-color);
  }
</style>
