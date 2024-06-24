<script setup lang="ts">
  import type {
    AcvDrawerEvents,
    AcvDrawerProps,
    AcvDrawerSlots
  } from './drawer.ts';
  import './drawer.css';

  const { title, description } = defineProps<AcvDrawerProps>();

  defineEmits<AcvDrawerEvents>();
  defineSlots<AcvDrawerSlots>();
</script>

<template>
  <div class="acv-drawer">
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
  .acv-drawer {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-drawer-color);
  }
</style>
