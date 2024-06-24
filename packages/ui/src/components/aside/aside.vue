<script setup lang="ts">
  import { computed } from 'vue';
  import './aside.css';
  import { isColor } from '../../utils/color.ts';
  import type { AsideProps } from './aside.ts';

  const { width, color } = defineProps<AsideProps>();

  // const { isColorModifier } = useColor(['primary']);

  const widthPx = computed(() => width ? `${width}px` : null);
  const backgroundColor = computed(() => (
    color && isColor(color)
      ? `var(--acv-color-${color})`
      : null
  ));
</script>

<template>
  <aside
    class="acv-aside"
    :class="{ [`acv-aside--color-${color}`]: !!backgroundColor }"
  >
    <slot />
  </aside>
</template>

<style scoped>
  .acv-aside {
    width: v-bind(widthPx);
    background-color: v-bind(backgroundColor);
    box-sizing: border-box;
  }
</style>
