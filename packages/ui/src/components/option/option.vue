<script setup lang="ts">
  import type {
    AcvOptionEvents,
    AcvOptionProps,
    AcvOptionSlots
  } from './option.ts';
  import './option.css';

  const { title, description } = defineProps<AcvOptionProps>();

  defineEmits<AcvOptionEvents>();
  defineSlots<AcvOptionSlots>();
</script>

<template>
  <div class="acv-option">
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
  .acv-option {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-option-color);
  }
</style>
