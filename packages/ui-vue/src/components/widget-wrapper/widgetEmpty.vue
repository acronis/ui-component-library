<script>
  import AcvIcon from '@/components/icon/icon.vue';

  const DEF_EMPTY_TEXT = 'No data to show';

  export default {
    name: 'AcvWidgetEmpty',

    components: {
      AcvIcon
    },

    data() {
      return {
        emptyText: DEF_EMPTY_TEXT
      };
    }
  };
</script>

<template>
  <div class="acv-widget-wrapper__empty">
    <AcvIcon
      name="empty-widget--32"
      size="64"
      color="brand-light"
    />
    <div class="acv-text acv-text--body-24 acv-text--color-fixed-primary mt-24">
      {{ emptyText }}
    </div>
  </div>
</template>
