<script setup lang="ts">
  import './list.css';
  import type { AcvListProps } from './list.ts';

  const { title, description } = defineProps<AcvListProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-list">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-list {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-list-color);
  }
</style>
