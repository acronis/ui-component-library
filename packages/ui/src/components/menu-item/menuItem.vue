<script setup lang="ts">
  import type {
    AcvMenuItemEvents,
    AcvMenuItemProps,
    AcvMenuItemSlots
  } from './menuItem.ts';
  import './menuItem.css';

  const { title, description } = defineProps<AcvMenuItemProps>();

  defineEmits<AcvMenuItemEvents>();
  defineSlots<AcvMenuItemSlots>();
</script>

<template>
  <div class="acv-menu-item">
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
  .acv-menu-item {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-menu-item-color);
  }
</style>
