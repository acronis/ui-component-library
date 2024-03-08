<template>
  <div class="el-widget-wrapper__view">
    <div class="el-widget-wrapper__empty">
      <div
        v-loading="true"
        el-loading-size="32"
      />
      <div class="el-text el-text--body-24 el-text--color-fixed-primary mt-24">
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'packages/loading/src/directive';

const DEF_LOADING_TEXT = 'Data is loading...';

export default {
  name: 'ElWidgetLoading',
  directives: {
    loading: Loading
  },
  data() {
    return {
      loadingText: DEF_LOADING_TEXT
    };
  }
};
</script>
