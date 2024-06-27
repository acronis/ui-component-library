<script setup lang="ts">
  import type {
    AcvMenuGroupEvents,
    AcvMenuGroupProps,
    AcvMenuGroupSlots
  } from './menuGroup.ts';
  import './menuGroup.css';

  const { title, description } = defineProps<AcvMenuGroupProps>();

  defineEmits<AcvMenuGroupEvents>();
  defineSlots<AcvMenuGroupSlots>();
</script>

<template>
  <div class="acv-menu-group">
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
  .acv-menu-group {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-menu-group-color);
  }
</style>
