<script setup lang="ts">
  import type {
    AcvTableColumnEvents,
    AcvTableColumnProps,
    AcvTableColumnSlots
  } from '@/components/__todo__/table-column/tableColumn.ts';
  import '@/components/__todo__/table-column/tableColumn.css';

  const { title, description } = defineProps<AcvTableColumnProps>();

  defineEmits<AcvTableColumnEvents>();
  defineSlots<AcvTableColumnSlots>();
</script>

<template>
  <div class="acv-table-column">
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
  .acv-table-column {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-table-column-color);
  }
</style>
