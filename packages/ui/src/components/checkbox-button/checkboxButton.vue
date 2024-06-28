<script setup lang="ts">
  import type {
    AcvCheckboxButtonEvents,
    AcvCheckboxButtonProps,
    AcvCheckboxButtonSlots
  } from './checkboxButton.ts';
  import './checkboxButton.css';

  const { title, description } = defineProps<AcvCheckboxButtonProps>();

  defineEmits<AcvCheckboxButtonEvents>();
  defineSlots<AcvCheckboxButtonSlots>();
</script>

<template>
  <div class="acv-checkbox-button">
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
  .acv-checkbox-button {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-checkbox-button-color);
  }
</style>
