<script setup lang="ts">
  import type { AcvMainEvents, AcvMainProps, AcvMainSlots } from './main.ts';
  import { computed } from 'vue';
  import { isColor } from '../../utils/color.ts';
  import './main.css';

  const { color } = defineProps<AcvMainProps>();
  defineEmits<AcvMainEvents>();

  defineSlots<AcvMainSlots>();

  // const { isColorModifier } = useColor(['nav-primary']);

  const mainClasses = computed(() => {
    return {
      'acv-main': true,
      [`acv-main--color-${color}`]: color && isColor(color),
    };
  });
  const backgroundColor = computed(() => (
    color && !isColor(color)
      ? `var(--acv-color-${color})`
      : null
  ));
</script>

<template>
  <main :class="mainClasses">
    <slot />
  </main>
</template>

<style scoped>
  .acv-main {
    display: block;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    scrollbar-width: none;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-main-color);
    background-color: v-bind(backgroundColor);

    ::-webkit-scrollbar {
      display: none;
    }
  }
</style>
