<script setup lang="ts">
  import './stepper.css';
  import type { StepperProps } from './stepper.ts';

  const { title, description } = defineProps<StepperProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-stepper">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-stepper {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-stepper-color);
  }
</style>
