<script setup lang="ts">
  import { computed } from 'vue';
  import type { AcvContainerProps, AcvContainerSlots } from './container.ts';
  import { useBreakpoints } from '@/composables/useBreakpoints.ts';
  import { isBaseColor, isColor, parseStringColor } from '@/utils/color.ts';
  import './container.css';

  const props = withDefaults(defineProps<AcvContainerProps>(), {
    direction: 'vertical',
    color: 'white',
  });
  defineSlots<AcvContainerSlots>();

  const { responsiveClassNames } = useBreakpoints('acv-container', props);

  const containerClasses = computed(() => {
    return {
      'acv-container': true,
      [`acv-container--${props.direction}`]: props.direction,
      [`acv-bg-${props.color}`]: isBaseColor(props.color),
      ...responsiveClassNames.value.reduce((acc, className) => {
        acc[className] = true;
        return acc;
      }, {})
    };
  });
  const backgroundColor = computed(() => (
    props.color && isColor(props.color)
      ? parseStringColor(props.color)
      : null
  ));
</script>

<template>
  <section :class="containerClasses">
    <slot />
  </section>
</template>

<style scoped lang="scss">
  $container-widths: (
      xs: 640px,
      sm: 768px,
      md: 1024px,
      lg: 1280px,
      xl: 1440px,
      xxl: 1920px
  ) !default;

  .acv-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    max-width: var(--acv-container-max-width);
    background-color: v-bind(backgroundColor);
    contain: layout;
    container-name: acv-container;
    container-type: inline-size;

    &.acv-container--vertical {
      flex-direction: column;
    }
  }

  @each $breakpoint, $container-width in $container-widths {
    @container style(--is-#{$breakpoint}-viewport: true) {
      :root {
        --acv-container-max-width: #{$container-width};
      }
    }
  }

  @container (max-width: 500px) {
    span {
      background-color: var(--acv-color-highlight) !important;
    }
  }
</style>
