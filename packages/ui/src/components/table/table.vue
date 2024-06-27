<script setup lang="ts">
  import type { TableProps } from './table.ts';
  import './table.css';

  const { title, description } = defineProps<TableProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-table">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-table {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-table-color);
  }
</style>
