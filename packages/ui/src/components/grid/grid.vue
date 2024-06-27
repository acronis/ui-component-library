<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  import { computed, provide, reactive, toRef } from 'vue';
  import './grid.css';
  import type { GridProps } from './grid.ts';
  import { GRID_KEY } from './grid.ts';
  import { parseAutoLayout, parseSizeLayout } from './utils.ts';

  defineOptions({ name: 'Grid' });

  const props = withDefaults(defineProps<GridProps>(), {
    tag: 'div',
    gap: 0,
    rows: 'none',
    columns: 24,
    autoRows: 'auto',
    autoColumns: 'auto',
    dense: false,
    justify: 'start',
    align: 'stretch',
    cellFlex: false
  });
  const cellFlex = computed(() => {
    if (props.cellFlex === true) {
      return {
        justify: 'start',
        align: 'top'
      } as const;
    }
    else if (props.cellFlex) {
      return {
        justify: 'start',
        align: 'top',
        ...props.cellFlex
      } as const;
    }

    return false;
  });

  provide(GRID_KEY, reactive({ cellFlex, columns: toRef(props, 'columns') }));

  const gap = computed(() => {
    return props.gap ? `${props.gap}px` : '';
  });

  const gridClasses = computed(() => {
    return {
      'acv-grid': true,
      [`acv-grid--${props.justify}`]: props.justify,
      [`acv-grid--${props.align}`]: props.align !== 'stretch',
      [`acv-grid--${props.rows}`]: props.rows !== 'none',
      [`acv-grid--dense`]: props.dense
    };
  });

  const gridStyles = computed(() => {
    const style: CSSProperties = {};

    if (props.gap) {
      style.gap = Array.isArray(props.gap)
        ? `${props.gap[0]}px ${props.gap[1]}px`
        : `${props.gap}px`;
    }

    style.gridTemplateColumns = parseSizeLayout(props.columns);

    if (props.rows !== 'none') {
      style.gridTemplateRows = parseSizeLayout(props.rows);
    }

    if (props.autoRows !== 'auto') {
      style.gridAutoRows = parseAutoLayout(props.autoRows);
    }

    if (props.autoColumns !== 'auto') {
      style.gridAutoColumns = parseAutoLayout(props.autoColumns);
    }

    return style;
  });
</script>

<template>
  <component
    :is="props.tag"
    :class="gridClasses"
    :style="gridStyles"
  >
    <slot></slot>
  </component>
</template>

<style scoped>
  .acv-grid {
    display: grid;
    position: relative;
    grid-template-rows: auto;
    grid-template-columns: auto;
    gap: v-bind(gap);

    /*
    grid-template-columns: repeat(var(--acv-grid-columns), 1fr);
    */
    grid-column-gap: var(--acv-column-gap);
    grid-row-gap: var(--acv-row-gap, v-bind(gap));
    padding: var(--acv-grid-outer-padding);

    &.acv-grid--dense {
      grid-auto-flow: row dense;
    }

    &.acv-grid--start {
      justify-content: start;
    }

    &.acv-grid--end {
      justify-content: end;
    }

    &.acv-grid--center {
      justify-content: center;
    }

    &.acv-grid--space-around {
      justify-content: space-around;
    }

    &.acv-grid--space-between {
      justify-content: space-between;
    }

    &.acv-grid--space-evenly {
      justify-content: space-evenly;
    }

    &.acv-grid--top {
      align-items: start;
    }

    &.acv-grid--middle {
      align-items: center;
    }

    &.acv-grid--bottom {
      align-items: end;
    }
  }
</style>
