<script setup lang="ts">
  import './scrollbar.css';
  import { ref } from 'vue';
  import type { AcvScrollbarEmits, AcvScrollbarProps } from './scrollbar.ts';
  import { usePerfectScrollbar } from './usePerfectScrollbar.ts';

  /**
   * A scrollbar is a UI component that allows users to scroll through content
   * that overflows its container, providing a visual indication of the current scroll position.
   *
   * @displayName Scrollbar component
   */
  defineOptions({
    name: 'AcvScrollbar'
  });

  const props = withDefaults(defineProps<AcvScrollbarProps>(), {
    tag: 'div',
    options: () => ({}),
  });

  const emit = defineEmits<AcvScrollbarEmits>();
  const scrollbar = ref<HTMLElement | null>(null);

  usePerfectScrollbar(props, emit, scrollbar);
</script>

<template>
  <component
    :is="tag"
    ref="scrollbar"
    class="acv-scrollbar"
  >
    <slot />
  </component>
</template>

<style>
/*
 * Container style
 */
.ps {
  overflow: hidden !important;
  overflow-anchor: none;
  -ms-overflow-style: none;
  touch-action: auto;
}

/*
 * Scrollbar rail styles
 */
.ps__rail-x {
  display: none;
  opacity: 0;
  transition: background-color .2s linear, opacity .2s linear;
  height: 10px;

  /* there must be 'bottom' or 'top' for ps__rail-x */
  bottom: 0;

  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-y {
  display: none;
  opacity: 0;
  transition: background-color .2s linear, opacity .2s linear;
  width: 10px;

  /* there must be 'right' or 'left' for ps__rail-y */
  right: 0;

  /* please don't change 'position' */
  position: absolute;
}

.ps--active-x > .ps__rail-x,
.ps--active-y > .ps__rail-y {
  display: block;
  background-color: var(--acv-scrollbar-track-color);
}

.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background-color: hsl(0deg 0% 98%);
  opacity: 0.9;
  width: 15px;
  height: 15px;
}

/*
 * Scrollbar thumb styles
 */
.ps__thumb-x {
  background-color: var(--acv-scrollbar-thumb-color);
  border-radius: 3px;
  transition: background-color .2s linear, height .2s ease-in-out;
  height: var(--acv-scrollbar-size);

  /* there must be 'bottom' for ps__thumb-x */
  bottom: 2px;

  /* please don't change 'position' */
  position: absolute;
}

.ps__thumb-y {
  background-color: var(--acv-scrollbar-thumb-color);
  border-radius: 3px;
  transition: background-color .2s linear, width .2s ease-in-out;
  width: var(--acv-scrollbar-size);

  /* there must be 'right' for ps__thumb-y */
  right: 2px;

  /* please don't change 'position' */
  position: absolute;
}

.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
  background-color: hsl(0deg 0% 60%);
  height: 11px;
  border-radius: 6px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  background-color: hsl(0deg 0% 60%);
  width: 11px;
  border-radius: 6px;
}

@container style(--acv-os-dark: true) {
  .ps {
    --acv-scrollbar-thumb-color: var(--acv-scrollbar-thumb-color-inverse);
    --acv-scrollbar-track-color: var(--acv-scrollbar-track-color-inverse);
  }
}
</style>

<style scoped>
.acv-scrollbar {
  position: relative;
  container-type: inline-size;
}
</style>
