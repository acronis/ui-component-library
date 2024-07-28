<script setup lang="ts">
  import { computed } from 'vue';
  import { isBaseColor } from '../../utils/color.ts';
  import type { AcvAsideProps } from './aside.ts';

  import './aside.css';

  const { width, color } = defineProps<AcvAsideProps>();

  // const { isColorModifier } = useColor(['primary']);

  const widthPx = computed(() => width ? `${width}px` : '');
  const backgroundColor = computed(() => (
    color && isBaseColor(color)
      ? `var(--acv-color-${color})`
      : ''
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
