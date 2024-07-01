<script setup lang="ts">
  import type { CSSProperties, ComputedRef } from 'vue';
  import { computed, inject, reactive, watch } from 'vue';
  import { isDefined, useBreakpoints } from '@vueuse/core';
  import { has } from 'lodash-es';
  import { GRID_KEY } from '../grid/grid.ts';
  import type { ClassType } from '../../utils/props.ts';
  import type { CellProps } from './cell.ts';
  import { isPositionSet, parsePosition, queryBreakPointOptions } from './utils.ts';

  defineOptions({ name: 'Cell' });

  const props = withDefaults(defineProps<CellProps>(), {
    tag: 'div',
    top: 'auto',
    left: 'auto',
    width: null,
    height: 1,
    right: '',
    bottom: '',
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    xxl: null,
    useFlex: null
  });

  const gridState = inject(GRID_KEY, null);
  const layoutState = reactive({
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    width: props.width,
    height: props.height
  });
  const layoutKeys = Object.keys(layoutState);
  const defaultWidth = computed(() => {
    if (isDefined(props.width)) {
      return props.width;
    }

    return gridState?.columns && typeof gridState.columns === 'number' ? gridState.columns : 1;
  });

  const breakpoints = useBreakpoints({
    xs: 640,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1440,
    xxl: 1920,
  });
  const currentBreakPoint: ComputedRef<string | undefined> = breakpoints.active();

  watch(
    currentBreakPoint,
    (value: ComputedRef<string | undefined>) => {
      const matchSize = queryBreakPointOptions(value, props);

      if (matchSize) {
        if (typeof matchSize === 'number') {
          layoutKeys.forEach((key) => {
            layoutState[key] = props[key] as any;
          });

          layoutState.width = matchSize;
        }
        else {
          layoutKeys.forEach((key) => {
            layoutState[key] = has(matchSize, key) ? matchSize[key] : (props[key] as any);
          });

          layoutState.width = layoutState.width ?? defaultWidth.value;
        }
      }
      else {
        layoutKeys.forEach((key) => {
          layoutState[key] = props[key] as any;
        });

        layoutState.width = defaultWidth.value;
      }
    },
    { immediate: true }
  );

  const cellClasses = computed(() => {
    const cellFlex = props.useFlex !== false
      && (props.useFlex || gridState?.cellFlex) && {
        ...(gridState?.cellFlex || {}),
        ...(props.useFlex
          ? props.useFlex === true
            ? { justify: 'start', align: 'top' }
            : props.useFlex
          : {})
      };
    const className: ClassType = {
      'acv-cell': true,
      'acv-cell--inherit': gridState || props.inherit,
      'acv-cell--flex': cellFlex,
      ...(cellFlex && {
        [`acv-cell--${cellFlex.justify}`]: cellFlex?.justify,
        [`acv-cell--${cellFlex.align}`]: cellFlex?.align
      })
    };

    return className;
  });

  const cellStyles = computed(() => {
    const style: CSSProperties = {};

    const topSet = isPositionSet(layoutState.top);
    const rightSet = isPositionSet(layoutState.right);
    const bottomSet = isPositionSet(layoutState.bottom);
    const leftSet = isPositionSet(layoutState.left);

    if (topSet && bottomSet) {
      style.gridRowStart = parsePosition(layoutState.top);
      style.gridRowEnd = parsePosition(layoutState.bottom);
    }
    else if (topSet) {
      style.gridRowStart = parsePosition(layoutState.top);
      style.gridRowEnd = `span ${layoutState.height}`;
    }
    else if (bottomSet) {
      style.gridRowStart = `span ${layoutState.height}`;
      style.gridRowEnd = parsePosition(layoutState.bottom);
    }
    else {
      style.gridRowEnd = `span ${layoutState.height}`;
    }

    if (leftSet && rightSet) {
      style.gridColumnStart = parsePosition(layoutState.left);
      style.gridColumnEnd = parsePosition(layoutState.right);
    }
    else if (leftSet) {
      style.gridColumnStart = parsePosition(layoutState.left);
      style.gridColumnEnd = `span ${layoutState.width}`;
    }
    else if (rightSet) {
      style.gridColumnStart = `span ${layoutState.width}`;
      style.gridColumnEnd = parsePosition(layoutState.right);
    }
    else {
      style.gridColumnStart = `span ${layoutState.width}`;
    }

    return style;
  });
</script>

<template>
  <component
    :is="props.tag"
    :class="cellClasses"
    :style="cellStyles"
  >
    <slot />
  </component>
</template>

<style scoped>
.acv-cell {
  font-family: var(--acv-font-family-default);
  font-size: var(--acv-font-size-accent);
  font-variant-numeric: tabular-nums;
  line-height: var(--acv-font-line-height-medium);
  color: inherit;

  &,
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  &.acv-cell--flex {
    display: flex;
  }

  &.acv-cell--start {
    justify-content: flex-start;
  }

  &.acv-cell--end {
    justify-content: flex-end;
  }

  &.acv-cell--center {
    justify-content: center;
  }

  &.acv-cell--space-around {
    justify-content: space-around;
  }

  &.acv-cell--space-between {
    justify-content: space-between;
  }

  &.acv-cell--space-evenly {
    justify-content: space-evenly;
  }

  &.acv-cell--top {
    align-items: flex-start;
  }

  &.acv-cell--middle {
    align-items: center;
  }

  &.acv-cell--bottom {
    align-items: flex-end;
  }

  & > .acv-grid {
    width: 100%;
  }
}
</style>
