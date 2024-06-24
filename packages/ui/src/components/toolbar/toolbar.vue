<script setup lang="ts">
  import './toolbar.css';
  import type { ToolbarProps } from './toolbar.ts';

  const { title, description } = defineProps<ToolbarProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-toolbar">
    <slot>{{ title }}</slot>
    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-toolbar {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-toolbar-color);
  }
</style>
