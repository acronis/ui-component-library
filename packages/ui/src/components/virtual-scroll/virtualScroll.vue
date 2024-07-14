<script setup lang="ts">
  import './virtualScroll.css';
  import type { AcvVirtualScrollProps } from './virtualScroll.ts';

  const { title, description } = defineProps<AcvVirtualScrollProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-virtual-scroll">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-virtual-scroll {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-virtual-scroll-color);
  }
</style>
