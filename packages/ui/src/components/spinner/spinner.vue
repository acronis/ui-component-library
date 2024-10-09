<script setup lang="ts">
  import type { AcvSpinnerProps } from './spinner.ts';
  import { computed } from 'vue';

  import './spinner.css';

  /**
   * Spinner is a loading indicator that can be used to show the user that the application is loading.
   */
  defineOptions({
    name: 'AcvSpinner'
  });

  const props = withDefaults(defineProps<AcvSpinnerProps>(), {
    size: 'small',
    color: 'primary'
  });

  const computedSize = computed(() => {
    return props.size;
  });

  const borderColor = computed(() => {
    return `var(--acv-color-${props.color})`;
  });

  const spinnerClasses = computed(() => {
    return {
      [`${computedSize.value}`]: props.size,
      [`acv-border-${props.color}`]: props.color,
    };
  });
</script>

<template>
  <span
    class="acv-spinner"
    :class="spinnerClasses"
  />
</template>

<style scoped>
.acv-spinner {
  --acv-spinner-ring-color: hsla(from v-bind(borderColor) h s l / 0.2);
  display: inline-block;
  vertical-align: middle;
  border-style: solid;
  border-radius: var(--acv-radius-circle);
  border-color: v-bind(borderColor) var(--acv-spinner-ring-color) var(--acv-spinner-ring-color);
  width: var(--acv-spinner-size);
  height: var(--acv-spinner-size);

  &.small {
    --acv-spinner-size: var(--acv-spinner-size-small);
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.medium {
    --acv-spinner-size: var(--acv-spinner-size-medium);
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.large {
    --acv-spinner-size: var(--acv-spinner-size-large);
    border-width: 3px;
    animation: rotate .5s linear infinite;
  }

  &.x-large {
    --acv-spinner-size: var(--acv-spinner-size-x-large);
    border-width: 3px;
    animation: rotate .5s linear infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg) translateZ(0);
  }
}
</style>
