<script setup lang="ts">
  import type { AcvCarouselEvents, AcvCarouselProps, AcvCarouselSlots } from './carousel.ts';
  import './carousel.css';

  const { title, description } = defineProps<AcvCarouselProps>();

  defineEmits<AcvCarouselEvents>();
  defineSlots<AcvCarouselSlots>();
</script>

<template>
  <div class="acv-carousel">
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
.acv-carousel {
  font-weight: var(--acv-font-weight-strong);
  color: var(--acv-carousel-color);
}
</style>
