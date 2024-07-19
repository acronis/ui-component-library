<script>
  export default {
    name: 'AcvSpinner',
    props: {
      size: {
        type: String,
        default: '16'
      },
      color: {
        type: String,
        default: 'brand-primary'
      }
    },
    data: () => ({
      sizes: {
        sm: 16,
        md: 24,
        lg: 32,
        xlg: 48
      }
    }),
    computed: {
      computedSize() {
        return this.sizes[this.size] || this.size;
      }
    }
  };
</script>

<template>
  <span
    class="acv-spinner"
    :class="{
      [`size-${computedSize}`]: size,
      [`color-${color}`]: color,
    }"
  />
</template>

<style scoped>
.acv-spinner {
  display: inline-block;
  vertical-align: middle;
  border-style: solid;
  border-top-color: transparent !important;
  border-radius: var(--acv-radius-circle);

  &.color-primary {
    border-color: var(--acv-color-primary);
  }

  &.color-secondary {
    border-color: var(--acv-color-secondary);
  }

  &.color-white {
    border-color: var(--acv-color-white);
  }

  &.size-16 {
    width: 16px;
    height: 16px;
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.size-24 {
    width: 24px;
    height: 24px;
    border-width: 2px;
    animation: rotate .4s linear infinite;
  }

  &.size-32 {
    width: 32px;
    height: 32px;
    border-width: 3px;
    animation: rotate .5s linear infinite;
  }

  &.size-48 {
    width: 48px;
    height: 48px;
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
