<script setup lang="ts">
  import { computed } from 'vue';
  import AcvButton from '../button/button.vue';
  import type { AcvCarouselProps, AcvCarouselSlots } from './carousel.ts';
  import './carousel.css';

  const { count, cycle } = withDefaults(defineProps<AcvCarouselProps>(), {
    cycle: false
  });

  defineSlots<AcvCarouselSlots>();
  const model = defineModel<number>({ default: 0 });

  const isFirst = computed(() => model.value === 0);
  const isLast = computed(() => model.value === (count - 1));
  const isFirstDisabled = computed(() => !cycle && isFirst.value);
  const isLastDisabled = computed(() => !cycle && isLast.value);

  function setActive(index: number) {
    model.value = index;
  }

  function prev() {
    setActive((model.value + count - 1) % count);
  }

  function next() {
    setActive((model.value + 1) % count);
  }
</script>

<template>
  <div class="acv-carousel">
    <slot
      name="prev"
      :prev="prev"
      :disabled="isFirstDisabled"
    >
      <AcvButton
        :disabled="isFirstDisabled"
        @click="prev"
      >
        Prev
      </AcvButton>
    </slot>
    <AcvButton
      v-for="(_, $index) in count"
      :key="$index"
      :disabled="$index === model"
      variant="ghost"
      @click="setActive($index)"
    >
      *
    </AcvButton>
    <slot
      name="next"
      :next="next"
      :disabled="isLastDisabled"
    >
      <AcvButton
        :disabled="isLastDisabled"
        @click="next"
      >
        Next
      </AcvButton>
    </slot>
  </div>
</template>

<style scoped>
  .acv-carousel {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-carousel-color);
  }
</style>
