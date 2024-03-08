<template>
  <div
    class="form-error"
    :class="{ 'is-large': size === 'large' }"
  >
    <el-icon
      v-if="showIcon"
      class="form-error__icon"
      name="i-times-circle--16"
    />
    <slot />
  </div>
</template>

<script>
import ElIcon from 'packages/icon';

export default {
  name: 'ElFormError',

  componentName: 'ElFormError',

  components: {
    ElIcon
  },

  props: {
    showIcon: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    }
  }
};
</script>
