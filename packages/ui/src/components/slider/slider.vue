<script setup lang="ts">
  import type {
    AcvSliderEvents,
    AcvSliderProps,
    AcvSliderSlots
  } from './slider.ts';
  import './slider.css';

  const { title, description } = defineProps<AcvSliderProps>();

  defineEmits<AcvSliderEvents>();
  defineSlots<AcvSliderSlots>();
</script>

<template>
  <div class="acv-slider">
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
  .acv-slider {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-slider-color);
  }
</style>
