<script setup lang="ts">
  import type {
    AcvComboboxEvents,
    AcvComboboxProps,
    AcvComboboxSlots
  } from './combobox.ts';
  import './combobox.css';

  const { title, description } = defineProps<AcvComboboxProps>();

  defineEmits<AcvComboboxEvents>();
  defineSlots<AcvComboboxSlots>();
</script>

<template>
  <div class="acv-combobox">
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
  .acv-combobox {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-combobox-color);
  }
</style>
