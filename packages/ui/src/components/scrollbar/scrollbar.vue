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

<style scoped>
.acv-scrollbar {
  position: relative;
  container-type: inline-size;
}
</style>
