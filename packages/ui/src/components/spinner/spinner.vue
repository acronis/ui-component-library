<script>
  import './spinner.css';

  export default {
    name: 'AcvSpinner',
    props: {
      size: {
        type: String,
        default: '16'
      },
      color: {
        type: String,
        default: 'primary'
      }
    },
    data: () => ({
      sizes: {
        'small': 8,
        'medium': 16,
        'large': 24,
        'x-large': 32
      }
    }),
    computed: {
      computedSize() {
        return this.sizes[this.size] || this.size;
      },
      borderColor() {
        return `var(--acv-color-${this.color})`;
      }
    }
  };
</script>

<template>
  <span
    class="acv-spinner"
    :class="{
      [`size-${computedSize}`]: size,
      [`acv-border-${color}`]: color,
    }"
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

  &.size-16 {
    --acv-spinner-size: var(--acv-spinner-size-small);
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.size-24 {
    --acv-spinner-size: var(--acv-spinner-size-medium);
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.size-32 {
    --acv-spinner-size: var(--acv-spinner-size-large);
    border-width: 3px;
    animation: rotate .5s linear infinite;
  }

  &.size-48 {
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
