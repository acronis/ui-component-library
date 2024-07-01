<script setup lang="ts">
  import type {
    AcvRadioEvents,
    AcvRadioProps,
    AcvRadioSlots
  } from './radio.ts';
  import './radio.css';

  const { title, description } = defineProps<AcvRadioProps>();

  defineEmits<AcvRadioEvents>();
  defineSlots<AcvRadioSlots>();
</script>

<template>
  <div class="acv-radio">
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
  .acv-radio {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-radio-color);
  }
</style>
