<script setup lang="ts">
  import { computed } from 'vue';
  import { useBreakpoints } from '../../composables/useBreakpoints.ts';
  import { isBaseColor, isColor, parseStringColor } from '../../utils/color.ts';
  import type { AcvContainerProps, AcvContainerSlots } from './container.ts';
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

<style scoped>
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

  @container style(--is-xs-viewport: true) {
    :root {
      --acv-container-max-width: 640px;
    }
  }

  @container style(--is-sm-viewport: true) {
    :root {
      --acv-container-max-width: 768px;
    }
  }

  @container style(--is-md-viewport: true) {
    :root {
      --acv-container-max-width: 1024px;
    }
  }

  @container style(--is-lg-viewport: true) {
    :root {
      --acv-container-max-width: 1280px;
    }
  }

  @container style(--is-xl-viewport: true) {
    :root {
      --acv-container-max-width: 1440px;
    }
  }

  @container style(--is-xxl-viewport: true) {
    :root {
      --acv-container-max-width: 1920px;
    }
  }

  @container (max-width: 500px) {
    span {
      background-color: var(--acv-color-highlight) !important;
    }
  }
</style>
