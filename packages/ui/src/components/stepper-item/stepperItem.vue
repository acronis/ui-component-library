<script setup lang="ts">
  import type {
    AcvStepperItemEvents,
    AcvStepperItemProps,
    AcvStepperItemSlots
  } from './stepperItem.ts';
  import './stepperItem.css';

  const { title, description } = defineProps<AcvStepperItemProps>();

  defineEmits<AcvStepperItemEvents>();
  defineSlots<AcvStepperItemSlots>();
</script>

<template>
  <div class="acv-stepper-item">
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
  .acv-stepper-item {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-stepper-item-color);
  }
</style>
