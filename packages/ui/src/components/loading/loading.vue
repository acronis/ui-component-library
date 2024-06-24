<script setup lang="ts">
  import type {
    AcvLoadingEvents,
    AcvLoadingProps,
    AcvLoadingSlots
  } from './loading.ts';
  import './loading.css';

  const { title, description } = defineProps<AcvLoadingProps>();

  defineEmits<AcvLoadingEvents>();
  defineSlots<AcvLoadingSlots>();
</script>

<template>
  <div class="acv-loading">
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
  .acv-loading {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-loading-color);
  }
</style>
