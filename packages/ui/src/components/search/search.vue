<script setup lang="ts">
  import type {
    AcvSearchEvents,
    AcvSearchProps,
    AcvSearchSlots
  } from './search.ts';
  import './search.css';

  const { title, description } = defineProps<AcvSearchProps>();

  defineEmits<AcvSearchEvents>();
  defineSlots<AcvSearchSlots>();
</script>

<template>
  <div class="acv-search">
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
  .acv-search {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-search-color);
  }
</style>
