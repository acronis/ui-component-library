<script setup lang="ts">
  import { computed } from 'vue';
  import type { ColumnEvents, ColumnProps, ColumnSlots } from './column.ts';
  import './column.css';

  const {
    colSpan,
    rowSpan,
    rowIndex,
    colIndex,
    span,
    offset,
    pull,
    push,
    xs,
    sm,
    md,
    lg,
    xl,
  } = withDefaults(defineProps<ColumnProps>(), {
    span: 24,
    rowIndex: 1,
    rowSpan: 1,
    colIndex: 1,
    colSpan: 1,
    tag: 'div',
  });
  defineEmits<ColumnEvents>();
  defineSlots<ColumnSlots>();

  const colClasses = computed(() => {
    return {
      'acv-column': true,
      [`acv-grid--col-span-${colSpan}`]: colSpan,
      [`acv-grid--row-span-${rowSpan}`]: rowSpan,
      [`acv-grid--row-start-${rowIndex}`]: rowIndex,
      [`acv-grid--col-start-${colIndex}`]: colIndex,
      [`acv-column-span-${span}`]: span || span === 0,
      [`acv-column-offset-${offset}`]: offset || offset === 0,
      [`acv-column-pull-${pull}`]: pull || pull === 0,
      [`acv-column-push-${push}`]: push || push === 0,
      [`acv-column-push-xs-${xs}`]: xs,
      [`acv-column-push-xs-${sm}`]: sm,
      [`acv-column-push-xs-${md}`]: md,
      [`acv-column-push-xs-${lg}`]: lg,
      [`acv-column-push-xs-${xl}`]: xl,
      // ...(typeof xs === 'object' && { [`acv-col-push-xs-${xs.span}`]: xs.span }),
      // ...(typeof xs === 'object' && { [`acv-col-push-xs-${xs.offset}`]: xs.offset }),
    };
  });
</script>

<template>
  <div :class="colClasses">
    <slot />
  </div>
</template>

<style scoped>
  .acv-column {
    position: relative;
    display: var(--acv-column-display);
    max-width: 100%;

    > .acv-row {
      width: 100%;
    }
  }

  .acv-column--flex {
    display: flex;
    flex-direction: column;
  }

  .acv-column--start {
    justify-content: flex-start;
  }

  .acv-column--end {
    justify-content: flex-end;
  }

  .acv-column--center {
    justify-content: center;
  }

  .acv-column--space-around {
    justify-content: space-around;
  }

  .acv-column--space-between {
    justify-content: space-between;
  }

  .acv-column--space-evenly {
    justify-content: space-evenly;
  }

  .acv-column--top {
    align-items: flex-start;
  }

  .acv-column--middle {
    align-items: center;
  }

  .acv-column--bottom {
    align-items: flex-end;
  }

  .acv-column--0 {
    display: none;
    flex: 0 0 0%;
    max-width: 0%;
  }

  .acv-column--offset-0 {
    margin-inline-start: 0%;
  }

  .acv-column--pull-0 {
    inset-inline-end: 0%;
  }

  .acv-column--push-0 {
    inset-inline-start: 0%;
  }

  .acv-column--order-0 {
    order: 0;
  }

  .acv-column--1 {
    display: var(--acv-column-display);
    flex: 0 0 4.1667%;
    max-width: 4.1667%;
  }

  .acv-column--offset-1 {
    margin-inline-start: 4.1667%;
  }

  .acv-column--pull-1 {
    inset-inline-end: 4.1667%;
  }

  .acv-column--push-1 {
    inset-inline-start: 4.1667%;
  }

  .acv-column--order-1 {
    order: 1;
  }

  .acv-column--2 {
    display: var(--acv-column-display);
    flex: 0 0 8.3333%;
    max-width: 8.3333%;
  }

  .acv-column--offset-2 {
    margin-inline-start: 8.3333%;
  }

  .acv-column--pull-2 {
    inset-inline-end: 8.3333%;
  }

  .acv-column--push-2 {
    inset-inline-start: 8.3333%;
  }

  .acv-column--order-2 {
    order: 2;
  }

  .acv-column--3 {
    display: var(--acv-column-display);
    flex: 0 0 12.5%;
    max-width: 12.5%;
  }

  .acv-column--offset-3 {
    margin-inline-start: 12.5%;
  }

  .acv-column--pull-3 {
    inset-inline-end: 12.5%;
  }

  .acv-column--push-3 {
    inset-inline-start: 12.5%;
  }

  .acv-column--order-3 {
    order: 3;
  }

  .acv-column--4 {
    display: var(--acv-column-display);
    flex: 0 0 16.6667%;
    max-width: 16.6667%;
  }

  .acv-column--offset-4 {
    margin-inline-start: 16.6667%;
  }

  .acv-column--pull-4 {
    inset-inline-end: 16.6667%;
  }

  .acv-column--push-4 {
    inset-inline-start: 16.6667%;
  }

  .acv-column--order-4 {
    order: 4;
  }

  .acv-column--5 {
    display: var(--acv-column-display);
    flex: 0 0 20.8333%;
    max-width: 20.8333%;
  }

  .acv-column--offset-5 {
    margin-inline-start: 20.8333%;
  }

  .acv-column--pull-5 {
    inset-inline-end: 20.8333%;
  }

  .acv-column--push-5 {
    inset-inline-start: 20.8333%;
  }

  .acv-column--order-5 {
    order: 5;
  }

  .acv-column--6 {
    display: var(--acv-column-display);
    flex: 0 0 25%;
    max-width: 25%;
  }

  .acv-column--offset-6 {
    margin-inline-start: 25%;
  }

  .acv-column--pull-6 {
    inset-inline-end: 25%;
  }

  .acv-column--push-6 {
    inset-inline-start: 25%;
  }

  .acv-column--order-6 {
    order: 6;
  }

  .acv-column--7 {
    display: var(--acv-column-display);
    flex: 0 0 29.1667%;
    max-width: 29.1667%;
  }

  .acv-column--offset-7 {
    margin-inline-start: 29.1667%;
  }

  .acv-column--pull-7 {
    inset-inline-end: 29.1667%;
  }

  .acv-column--push-7 {
    inset-inline-start: 29.1667%;
  }

  .acv-column--order-7 {
    order: 7;
  }

  .acv-column--8 {
    display: var(--acv-column-display);
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }

  .acv-column--offset-8 {
    margin-inline-start: 33.3333%;
  }

  .acv-column--pull-8 {
    inset-inline-end: 33.3333%;
  }

  .acv-column--push-8 {
    inset-inline-start: 33.3333%;
  }

  .acv-column--order-8 {
    order: 8;
  }

  .acv-column--9 {
    display: var(--acv-column-display);
    flex: 0 0 37.5%;
    max-width: 37.5%;
  }

  .acv-column--offset-9 {
    margin-inline-start: 37.5%;
  }

  .acv-column--pull-9 {
    inset-inline-end: 37.5%;
  }

  .acv-column--push-9 {
    inset-inline-start: 37.5%;
  }

  .acv-column--order-9 {
    order: 9;
  }

  .acv-column--10 {
    display: var(--acv-column-display);
    flex: 0 0 41.6667%;
    max-width: 41.6667%;
  }

  .acv-column--offset-10 {
    margin-inline-start: 41.6667%;
  }

  .acv-column--pull-10 {
    inset-inline-end: 41.6667%;
  }

  .acv-column--push-10 {
    inset-inline-start: 41.6667%;
  }

  .acv-column--order-10 {
    order: 10;
  }

  .acv-column--11 {
    display: var(--acv-column-display);
    flex: 0 0 45.8333%;
    max-width: 45.8333%;
  }

  .acv-column--offset-11 {
    margin-inline-start: 45.8333%;
  }

  .acv-column--pull-11 {
    inset-inline-end: 45.8333%;
  }

  .acv-column--push-11 {
    inset-inline-start: 45.8333%;
  }

  .acv-column--order-11 {
    order: 11;
  }

  .acv-column--12 {
    display: var(--acv-column-display);
    flex: 0 0 50%;
    max-width: 50%;
  }

  .acv-column--offset-12 {
    margin-inline-start: 50%;
  }

  .acv-column--pull-12 {
    inset-inline-end: 50%;
  }

  .acv-column--push-12 {
    inset-inline-start: 50%;
  }

  .acv-column--order-12 {
    order: 12;
  }

  .acv-column--13 {
    display: var(--acv-column-display);
    flex: 0 0 54.1667%;
    max-width: 54.1667%;
  }

  .acv-column--offset-13 {
    margin-inline-start: 54.1667%;
  }

  .acv-column--pull-13 {
    inset-inline-end: 54.1667%;
  }

  .acv-column--push-13 {
    inset-inline-start: 54.1667%;
  }

  .acv-column--order-13 {
    order: 13;
  }

  .acv-column--14 {
    display: var(--acv-column-display);
    flex: 0 0 58.3333%;
    max-width: 58.3333%;
  }

  .acv-column--offset-14 {
    margin-inline-start: 58.3333%;
  }

  .acv-column--pull-14 {
    inset-inline-end: 58.3333%;
  }

  .acv-column--push-14 {
    inset-inline-start: 58.3333%;
  }

  .acv-column--order-14 {
    order: 14;
  }

  .acv-column--15 {
    display: var(--acv-column-display);
    flex: 0 0 62.5%;
    max-width: 62.5%;
  }

  .acv-column--offset-15 {
    margin-inline-start: 62.5%;
  }

  .acv-column--pull-15 {
    inset-inline-end: 62.5%;
  }

  .acv-column--push-15 {
    inset-inline-start: 62.5%;
  }

  .acv-column--order-15 {
    order: 15;
  }

  .acv-column--16 {
    display: var(--acv-column-display);
    flex: 0 0 66.6667%;
    max-width: 66.6667%;
  }

  .acv-column--offset-16 {
    margin-inline-start: 66.6667%;
  }

  .acv-column--pull-16 {
    inset-inline-end: 66.6667%;
  }

  .acv-column--push-16 {
    inset-inline-start: 66.6667%;
  }

  .acv-column--order-16 {
    order: 16;
  }

  .acv-column--17 {
    display: var(--acv-column-display);
    flex: 0 0 70.8333%;
    max-width: 70.8333%;
  }

  .acv-column--offset-17 {
    margin-inline-start: 70.8333%;
  }

  .acv-column--pull-17 {
    inset-inline-end: 70.8333%;
  }

  .acv-column--push-17 {
    inset-inline-start: 70.8333%;
  }

  .acv-column--order-17 {
    order: 17;
  }

  .acv-column--18 {
    display: var(--acv-column-display);
    flex: 0 0 75%;
    max-width: 75%;
  }

  .acv-column--offset-18 {
    margin-inline-start: 75%;
  }

  .acv-column--pull-18 {
    inset-inline-end: 75%;
  }

  .acv-column--push-18 {
    inset-inline-start: 75%;
  }

  .acv-column--order-18 {
    order: 18;
  }

  .acv-column--19 {
    display: var(--acv-column-display);
    flex: 0 0 79.1667%;
    max-width: 79.1667%;
  }

  .acv-column--offset-19 {
    margin-inline-start: 79.1667%;
  }

  .acv-column--pull-19 {
    inset-inline-end: 79.1667%;
  }

  .acv-column--push-19 {
    inset-inline-start: 79.1667%;
  }

  .acv-column--order-19 {
    order: 19;
  }

  .acv-column--20 {
    display: var(--acv-column-display);
    flex: 0 0 83.3333%;
    max-width: 83.3333%;
  }

  .acv-column--offset-20 {
    margin-inline-start: 83.3333%;
  }

  .acv-column--pull-20 {
    inset-inline-end: 83.3333%;
  }

  .acv-column--push-20 {
    inset-inline-start: 83.3333%;
  }

  .acv-column--order-20 {
    order: 20;
  }

  .acv-column--21 {
    display: var(--acv-column-display);
    flex: 0 0 87.5%;
    max-width: 87.5%;
  }

  .acv-column--offset-21 {
    margin-inline-start: 87.5%;
  }

  .acv-column--pull-21 {
    inset-inline-end: 87.5%;
  }

  .acv-column--push-21 {
    inset-inline-start: 87.5%;
  }

  .acv-column--order-21 {
    order: 21;
  }

  .acv-column--22 {
    display: var(--acv-column-display);
    flex: 0 0 91.6667%;
    max-width: 91.6667%;
  }

  .acv-column--offset-22 {
    margin-inline-start: 91.6667%;
  }

  .acv-column--pull-22 {
    inset-inline-end: 91.6667%;
  }

  .acv-column--push-22 {
    inset-inline-start: 91.6667%;
  }

  .acv-column--order-22 {
    order: 22;
  }

  .acv-column--23 {
    display: var(--acv-column-display);
    flex: 0 0 95.8333%;
    max-width: 95.8333%;
  }

  .acv-column--offset-23 {
    margin-inline-start: 95.8333%;
  }

  .acv-column--pull-23 {
    inset-inline-end: 95.8333%;
  }

  .acv-column--push-23 {
    inset-inline-start: 95.8333%;
  }

  .acv-column--order-23 {
    order: 23;
  }

  .acv-column--24 {
    display: var(--acv-column-display);
    flex: 0 0 100%;
    max-width: 100%;
  }

  .acv-column--offset-24 {
    margin-inline-start: 100%;
  }

  .acv-column--pull-24 {
    inset-inline-end: 100%;
  }

  .acv-column--push-24 {
    inset-inline-start: 100%;
  }

  .acv-column--order-24 {
    order: 24;
  }

  .acv-col-0 {
    display: none;
  }

  @media (--small-viewport) {
    .acv-col-sm-0 {
      display: none;
    }

    .acv-col-sm-1,
    .acv-col-sm-offset-1,
    .acv-col-sm-pull-1,
    .acv-col-sm-push-1
    {
      --acv-col-width: calc(((1 / 24) * 100) * 1%);
    }

    .acv-col-sm-2,
    .acv-col-sm-offset-2,
    .acv-col-sm-pull-2,
    .acv-col-sm-push-2
    {
      --acv-col-width: calc(((1 / 24) * 2 * 100) * 1%);
    }
  }
</style>
