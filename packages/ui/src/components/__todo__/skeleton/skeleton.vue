<script setup lang="ts">
  import type { AcvSkeletonProps } from '@/components/__todo__/skeleton/skeleton.ts';
  import '@/components/__todo__/skeleton/skeleton.css';

  const { title, description } = defineProps<AcvSkeletonProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-skeleton">
    <slot>{{ title }}</slot>

    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-skeleton {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-skeleton-color);
  }
</style>
