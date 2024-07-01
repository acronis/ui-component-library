<script setup lang="ts">
  import type {
    AcvOptionGroupEvents,
    AcvOptionGroupProps,
    AcvOptionGroupSlots
  } from './optionGroup.ts';
  import './optionGroup.css';

  const { title, description } = defineProps<AcvOptionGroupProps>();

  defineEmits<AcvOptionGroupEvents>();
  defineSlots<AcvOptionGroupSlots>();
</script>

<template>
  <div class="acv-option-group">
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
  .acv-option-group {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-option-group-color);
  }
</style>
