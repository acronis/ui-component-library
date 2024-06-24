<script setup lang="ts">
  import type {
    AcvRadioButtonEvents,
    AcvRadioButtonProps,
    AcvRadioButtonSlots
  } from './radioButton.ts';
  import './radioButton.css';

  const { title, description } = defineProps<AcvRadioButtonProps>();

  defineEmits<AcvRadioButtonEvents>();
  defineSlots<AcvRadioButtonSlots>();
</script>

<template>
  <div class="acv-radio-button">
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
  .acv-radio-button {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-radio-button-color);
  }
</style>
