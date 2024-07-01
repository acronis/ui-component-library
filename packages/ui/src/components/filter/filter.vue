<script setup lang="ts">
  import type {
    AcvFilterEvents,
    AcvFilterProps,
    AcvFilterSlots
  } from './filter.ts';
  import './filter.css';

  const { title, description } = defineProps<AcvFilterProps>();

  defineEmits<AcvFilterEvents>();
  defineSlots<AcvFilterSlots>();
</script>

<template>
  <div class="acv-filter">
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
  .acv-filter {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-filter-color);
  }
</style>
