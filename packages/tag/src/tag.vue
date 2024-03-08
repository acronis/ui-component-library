<template>
  <span
    class="el-tag"
    :class="{
      [`el-tag--${type}`]: type,
      'is-inverse': inverse,
      'is-small': small
    }"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <span class="el-tag__text">
      <slot />
    </span>
  </span>
</template>

<script>
import Emitter from '@/mixins/emitter';

  export default {
    name: 'ElTag',
    mixins: [Emitter],
    props: {
      type: {
        type: String,
        default: 'info'
      },
      small: {
        type: Boolean,
        default: false
      },
      inverse: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleMouseEnter(e) {
        this.$emit('mouseenter', e);
      },

      handleMouseLeave(e) {
        this.$emit('mouseleave', e);
      }
    }
  };
</script>
