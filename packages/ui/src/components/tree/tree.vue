<script setup lang="ts">
  import './tree.css';
  import type { AcvTreeProps } from './tree.ts';

  const { data, emptyText } = defineProps<AcvTreeProps>();

  defineEmits<{
    /**
     * Triggered when the node is expanded
     * @arg {string} payload - node
     */
    'node-expand': []
  }>();
</script>

<template>
  <div class="acv-tree">
    <slot>{{ data }}</slot>

    <slot name="description">
      {{ emptyText }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-tree {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tree-color);
  }
</style>
