<script setup lang="ts">
  import type {
    AcvInputNumberEvents,
    AcvInputNumberProps,
    AcvInputNumberSlots
  } from './inputNumber.ts';
  import './inputNumber.css';

  const { title, description } = defineProps<AcvInputNumberProps>();

  defineEmits<AcvInputNumberEvents>();
  defineSlots<AcvInputNumberSlots>();
</script>

<template>
  <div class="acv-input-number">
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
  .acv-input-number {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-input-number-color);
  }
</style>
