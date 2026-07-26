<script setup lang="ts">
  import type {
    AcvMapEvents,
    AcvMapProps,
    AcvMapSlots
  } from './map.ts';
  import './map.css';

  const { title, description } = defineProps<AcvMapProps>();

  defineEmits<AcvMapEvents>();
  defineSlots<AcvMapSlots>();
</script>

<template>
  <div class="acv-map">
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
  .acv-map {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-map-color);
  }
</style>
