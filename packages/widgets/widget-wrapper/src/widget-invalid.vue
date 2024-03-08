<template>
  <div class="el-widget-wrapper__empty">
    <el-icon name="i-times-circle--16" color="brand-light" size="64"></el-icon>
    <div class="el-text el-text--body-24 el-text--color-fixed-primary mt-24">
      {{ invalidText }}
    </div>
  </div>
</template>

<script>
import ElIcon from 'packages/icon';

const DEF_INVALID_TEXT = 'An error occured while loading content';

export default {
  name: 'ElWidgetInvalid',

  components: {
    ElIcon
  },

  data() {
    return {
      invalidText: DEF_INVALID_TEXT
    };
  }
};
</script>
