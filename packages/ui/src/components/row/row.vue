<script setup lang="ts">
  import { computed, provide, reactive, toRef } from 'vue';
  import type { RowInjection, RowProps, RowSlots } from './row.ts';
  import { ROW_KEY } from './row.ts';
  import './row.css';

  const {
    tag,
    justify,
    align,
    columnFlex,
    gap
  } = withDefaults(defineProps<RowProps>(), {
    justify: 'start',
    gap: 0,
    align: 'top',
    tag: 'div',
    columnFlex: false
  });

  defineSlots<RowSlots>();
  const rowClasses = computed(() => {
    return {
      'acv-row': true,
      [`acv-row--${justify}`]: justify !== 'start',
      [`acv-row--${align}`]: align !== 'top',
    };
  });

  const rowStyles = computed(() => {
    if (!gap) {
      return null;
    }

    if (typeof gap === 'number') {
      return {
        '--acv-row-h-gap': `${gap}px`
      };
    }

    if (Array.isArray(gap)) {
      const [horizontal, vertical] = gap;

      return {
        '--acv-row-h-gap': `${horizontal}px`,
        '--acv-row-v-gap': `${vertical}px`
      };
    }

    return null;
  });

  const flex = computed(() => {
    if (columnFlex === true) {
      return {
        justify: 'start',
        align: 'top'
      };
    }
    else if (columnFlex) {
      return {
        justify: 'start',
        align: 'top',
        ...columnFlex
      };
    }

    return false;
  });

  provide(
    ROW_KEY,
    reactive({
      flex,
      gap: toRef(gap)
    }) as RowInjection
  );
</script>

<template>
  <component
    :is="tag"
    :class="rowClasses"
    :style="rowStyles"
  >
    <slot />
  </component>
</template>

<style scoped>
  .acv-row {
      position: relative;
      display: flex;
      flex-flow: row wrap;
      gap: var(--acv-row-v-gap) var(--acv-row-h-gap);

      /* TODO replace with row-gap */
      margin-inline: calc(-0.5 * var(--acv-row-h-gap)) calc(-0.5 * var(--acv-row-h-gap));

      &.acv-row--start {
        justify-content: flex-start;
      }

      &.acv-row--end {
        justify-content: flex-end;
      }

      &.acv-row--center {
        justify-content: center;
      }

      &.acv-row--space-around {
        justify-content: space-around;
      }

      &.acv-row--space-between {
        justify-content: space-between;
      }

      &.acv-row--space-evenly {
        justify-content: space-evenly;
      }

      &.acv-row--top {
        align-items: flex-start;
      }

      &.acv-row--middle {
        align-items: center;
      }

      &.acv-row--bottom {
        align-items: flex-end;
      }
  }
</style>
