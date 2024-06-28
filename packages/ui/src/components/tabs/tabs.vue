<script setup lang="ts">
  import type {
    AcvTabsEvents,
    AcvTabsProps,
    AcvTabsSlots
  } from './tabs.ts';
  import './tabs.css';

  const { title, description } = defineProps<AcvTabsProps>();

  defineEmits<AcvTabsEvents>();
  defineSlots<AcvTabsSlots>();
</script>

<template>
  <div class="acv-tabs">
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
  .acv-tabs {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tabs-color);
  }
</style>
