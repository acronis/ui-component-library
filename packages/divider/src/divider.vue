<template>
  <div
    class="el-divider"
    :class="{
      [`el-divider--color-${color}`]: color,
      'is-vertical': vertical
    }"
    :style="`height: ${height}px`"
  />
</template>

<script>
  import { isInteger } from '@/utils/util';

  export default {
    name: 'ElDivider',

    componentName: 'ElDivider',

    props: {
      color: {
        type: String,
        default: 'brand-lighter'
      },
      vertical: [Boolean, Number]
    },

    data() {
      return {
        height: isInteger(this.vertical) ? this.vertical : null
      };
    }
  };
</script>
