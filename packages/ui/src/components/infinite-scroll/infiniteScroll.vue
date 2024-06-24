<script setup lang="ts">
  import type {
    AcvInfiniteScrollEvents,
    AcvInfiniteScrollProps,
    AcvInfiniteScrollSlots
  } from './infiniteScroll.ts';
  import './infiniteScroll.css';

  const { title, description } = defineProps<AcvInfiniteScrollProps>();

  defineEmits<AcvInfiniteScrollEvents>();
  defineSlots<AcvInfiniteScrollSlots>();
</script>

<template>
  <div class="acv-infinite-scroll">
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
  .acv-infinite-scroll {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-infinite-scroll-color);
  }
</style>
