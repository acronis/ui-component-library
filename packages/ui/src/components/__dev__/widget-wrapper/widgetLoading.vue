<script>
  import Loading from '@/directives/loading';

  const DEF_LOADING_TEXT = 'Data is loading...';

  export default {
    name: 'AcvWidgetLoading',
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

<template>
  <div class="acv-widget-wrapper__view">
    <div class="acv-widget-wrapper__empty">
      <div
        v-loading="{ size: 'large', modelValue: true }"
      />
      <div class="acv-text acv-text--body-24 acv-text--color-fixed-primary mt-24">
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>
