<script setup lang="ts">
  import type { AcvCarouselProps, AcvCarouselSlots } from './carousel.ts';
  import { isDefined } from '@/utils/common.ts';
  import { IconArrowLeft16, IconArrowRight16 } from '@acronis-platform/icons/arrow';
  import { IconDot16 } from '@acronis-platform/icons/dot';
  import { computed, onMounted, provide, ref, toRefs, watch } from 'vue';
  import AcvButton from '../button/button.vue';
  import { CAROUSEL_INJECTION_KEY } from './carousel.ts';
  import './carousel.css';

  const props = withDefaults(defineProps<AcvCarouselProps>(), {
    cycle: false,
    autoplay: false,
    interval: 3_000,
  });

  defineSlots<AcvCarouselSlots>();

  const { cycle, autoplay, interval } = toRefs(props);

  let timeoutIndex: NodeJS.Timeout;

  const model = defineModel<string | number>();

  const values = ref<Array<string | number>>([]);

  const activeIndex = computed(() => model.value ? values.value.indexOf(model.value) : undefined);
  const isFirst = computed(() => activeIndex.value === 0);
  const isLast = computed(() => activeIndex.value === (values.value.length - 1));
  const isFirstDisabled = computed(() => !cycle.value && isFirst.value);
  const isLastDisabled = computed(() => !cycle.value && isLast.value);

  function register(name: string | number): void {
    values.value.push(name);
  }

  function unregister(name: string | number): void {
    const isActiveRemoved = model.value === name;
    values.value.splice(values.value.indexOf(name), 1);
    if (isActiveRemoved) {
      next();
    }
  }

  function setActive(name: string | number) {
    const index = values.value.indexOf(name);
    if (index === -1) {
      throw new Error(`Cannot set active name "${name}"`);
    }
    model.value = name;
  }

  function prev() {
    const count = values.value.length;
    if (isDefined(activeIndex.value) && (!isFirst.value || cycle.value)) {
      setActive(values.value[(activeIndex.value + count - 1) % count]);
    }
  }

  function next() {
    const count = values.value.length;
    if (isDefined(activeIndex.value) && (!isLast.value || cycle.value)) {
      setActive(values.value[(activeIndex.value + 1) % count]);
    }
  }

  function startAutoplay() {
    clearTimeout(timeoutIndex);

    timeoutIndex = setTimeout(() => {
      next();
      startAutoplay();
    }, interval.value);
  }

  function stopAutoplay() {
    clearTimeout(timeoutIndex);
  }

  onMounted(() => {
    if (!isDefined(model.value) && values.value.length > 0) {
      setActive(values.value[0]);
    }
  });

  watch([autoplay, interval], () => {
    if (autoplay.value) {
      startAutoplay();
    }
    else {
      stopAutoplay();
    }
  }, { immediate: true });

  provide(CAROUSEL_INJECTION_KEY, {
    model,
    register,
    unregister
  });
</script>

<template>
  <div class="acv-carousel">
    <div class="acv-carousel-content">
      <slot />
    </div>

    <div class="acv-carousel-nav">
      <slot
        name="prev"
        :prev="prev"
        :disabled="isFirstDisabled"
      >
        <AcvButton
          class="prev-button"
          :disabled="isFirstDisabled"
          :icon="IconArrowLeft16"
          variant="ghost"
          @click="prev"
        >
          Prev
        </AcvButton>
      </slot>
      <div class="inner">
        <AcvButton
          v-for="name in values"
          :key="name"
          :class="{
            'button-active': name === model,
            'button-available': name !== model,
          }"
          :selected="name === model"
          variant="ghost"
          :source="IconDot16"
          @click="setActive(name)"
        />
      </div>
      <slot
        name="next"
        :next="next"
        :disabled="isLastDisabled"
      >
        <AcvButton
          class="next-button"
          :append-icon="IconArrowRight16"
          :disabled="isLastDisabled"
          variant="ghost"
          @click="next"
        >
          Next
        </AcvButton>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  .acv-carousel-nav {
    display: flex;
    justify-content: space-between;

    .inner {
      margin-left: var(--acv-carousel-nav-content-gap);
      margin-right: var(--acv-carousel-nav-content-gap);

      /* TODO: fix button colors */
      .button-active {
        --_acv-button-color: var(--acv-carousel-nav-button-icon-color-active);
      }

      .button-available {
        --_acv-button-color: var(--acv-carousel-nav-button-icon-color-available);
      }
    }
  }
</style>
