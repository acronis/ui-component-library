<template>
  <span
    class="el-spinner"
    :class="{
      [`el-spinner--size-${computedSize}`]: size,
      [`el-spinner--color-${color}`]: color
    }"
  />
</template>

<script>
export default {
  name: 'ElSpinner',
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
