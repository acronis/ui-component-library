<script setup lang="ts">
  import type {
    AcvCarouselItemProps,
    AcvCarouselItemSlots
  } from '@/components/__dev__/carousel-item/carouselItem.ts';
  import {
    CAROUSEL_INJECTION_KEY
  } from '@/components/__dev__/carousel/carousel.ts';
  import { isDefined } from '@vueuse/core';
  import { computed, getCurrentInstance, inject, onMounted, onUnmounted } from 'vue';
  import '@/components/__dev__/carousel-item/carouselItem.css';

  const props = defineProps<AcvCarouselItemProps>();

  defineSlots<AcvCarouselItemSlots>();

  const carouselInjection = inject(CAROUSEL_INJECTION_KEY);

  if (!carouselInjection) {
    throw new Error('Carousel must be provided');
  }

  const name = computed(() => props.name || getCurrentInstance()?.uid);
  const isActive = computed(() => carouselInjection.model.value === name.value);

  onMounted(() => {
    if (isDefined(name.value)) {
      carouselInjection.register(name.value);
    }
  });

  onUnmounted(() => {
    if (isDefined(name.value)) {
      carouselInjection.unregister(name.value);
    }
  });
</script>

<template>
  <div
    v-if="isActive"
    class="acv-carousel-item"
  >
    <slot />
  </div>
</template>

<style scoped>
  .acv-carousel-item {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-carousel-item-color);
  }
</style>
