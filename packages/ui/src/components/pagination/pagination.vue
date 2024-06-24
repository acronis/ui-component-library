<script setup lang="ts">
  import type {
    AcvPaginationEvents,
    AcvPaginationProps,
    AcvPaginationSlots
  } from './pagination.ts';
  import './pagination.css';

  const { title, description } = defineProps<AcvPaginationProps>();

  defineEmits<AcvPaginationEvents>();
  defineSlots<AcvPaginationSlots>();
</script>

<template>
  <div class="acv-pagination">
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
  .acv-pagination {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-pagination-color);
  }
</style>
