<script>
  import { t } from '@/locale';
  import AcvDivider from '../divider/divider.vue';
  import AcvIcon from '../icon/icon.vue';

  export default {
    name: 'AcvWidgetWrapper',
    components: {
      AcvIcon,
      AcvDivider
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      subtitle: {
        type: String,
        default: ''
      },
      minHeight: {
        type: String,
        default: '264px'
      },
      noPadding: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        emptyText: t('acv.widgetwrapper.noDataMessage')
      };
    },
    computed: {
      hasFooterOrFooterAside() {
        return !!this.$slots.footer || !!this.$slots.footerAside;
      },
      hasTitleOrHeaderAside() {
        return !!this.title || !!this.$slots.headerAside;
      },
      hasSubtitle() {
        return !!this.subtitle;
      }
    }
  };
</script>

<template>
  <div
    class="acv-widget-wrapper"
    :class="{
      'acv-widget-wrapper--no-padding': noPadding,
    }"
    :style="{
      minHeight,
    }"
  >
    <div
      v-if="hasTitleOrHeaderAside"
      class="acv-widget-wrapper__title px-24 pt-12 pb-4"
    >
      <span class="acv-text acv-text--strong">{{ title }}</span>
      <span class="acv-widget-wrapper__header-aside">
        <slot name="header-aside" />
      </span>
    </div>
    <div
      v-if="hasSubtitle"
      class="acv-widget-wrapper__subtitle acv-text acv-text--body-24 px-24 pb-8"
    >
      {{ subtitle }}
    </div>
    <div
      class="acv-widget-wrapper__view"
      :class="{
        'px-24': !noPadding,
      }"
    >
      <slot>
        <div class="acv-widget-wrapper__empty">
          <AcvIcon
            name="dashboard-o--32"
            size="64"
            color="brand-light"
          />
          <div class="acv-text acv-text--body-24">
            {{ emptyText }}
          </div>
        </div>
      </slot>
    </div>
    <AcvDivider
      v-if="hasFooterOrFooterAside"
      color="brand-accent mt-8"
    />
    <div
      v-if="hasFooterOrFooterAside"
      class="acv-widget-wrapper__footer py-12 px-24"
    >
      <span>
        <slot name="footer" />
      </span>
      <span class="acv-widget-wrapper__footer-aside">
        <slot name="footer-aside" />
      </span>
    </div>
  </div>
</template>
