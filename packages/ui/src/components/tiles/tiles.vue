<script setup lang="ts">
  import type {
    AcvTilesEvents,
    AcvTilesProps,
    AcvTilesSlots
  } from './tiles.ts';
  import './tiles.css';

  const { title, description } = defineProps<AcvTilesProps>();

  defineEmits<AcvTilesEvents>();
  defineSlots<AcvTilesSlots>();
</script>

<template>
  <div class="acv-tiles">
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
  .acv-tiles {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tiles-color);
  }
</style>
