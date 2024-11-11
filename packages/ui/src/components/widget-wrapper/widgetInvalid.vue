<script>
  import AcvIcon from '../icon/icon.vue';

  const DEF_INVALID_TEXT = 'An error occurred while loading content';

  export default {
    name: 'AcvWidgetInvalid',

    components: {
      AcvIcon
    },

    data() {
      return {
        invalidText: DEF_INVALID_TEXT
      };
    }
  };
</script>

<template>
  <div class="acv-widget-wrapper__empty">
    <AcvIcon
      name="times-circle--16"
      color="brand-light"
      size="64"
    />
    <div class="acv-text acv-text--body-24 acv-text--color-fixed-primary mt-24">
      {{ invalidText }}
    </div>
  </div>
</template>
