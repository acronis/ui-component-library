<template>
  <div class="el-widget-wrapper__empty">
    <el-icon name="i-empty-widget--32" size="64" color="brand-light"></el-icon>
    <div class="el-text el-text--body-24 el-text--color-fixed-primary mt-24">
      {{ emptyText }}
    </div>
  </div>
</template>

<script>
import ElIcon from 'packages/icon';

const DEF_EMPTY_TEXT = 'No data to show';

export default {
  name: 'ElWidgetEmpty',

  components: {
    ElIcon
  },

  data() {
    return {
      emptyText: DEF_EMPTY_TEXT
    };
  }
};
</script>
