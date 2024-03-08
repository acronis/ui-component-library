<template>
  <div
    class="el-widget-wrapper"
    :class="{
      'el-widget-wrapper--no-padding': noPadding
    }"
    :style="{
      minHeight: minHeight,
    }"
  >
    <div
      class="el-widget-wrapper__title px-24 pt-12 pb-4"
      v-if="hasTitleOrHeaderAside"
    >
      <span class="el-text el-text--strong">{{ title }}</span>
      <span class="el-widget-wrapper__header-aside">
        <slot name="header-aside" />
      </span>
    </div>
    <div v-if="hasSubtitle" class="el-widget-wrapper__subtitle el-text el-text--body-24 px-24 pb-8">
      {{ subtitle }}
    </div>
    <div
      class="el-widget-wrapper__view"
      :class="{
        'px-24': !noPadding
      }"
    >
      <slot>
        <div class="el-widget-wrapper__empty">
          <el-icon name="i-dashboard-o--32" size="64" color="brand-light" />
          <div class="el-text el-text--body-24">{{ emptyText }}</div>
        </div>
      </slot>
    </div>
    <el-divider color="brand-accent mt-8" v-if="hasFooterOrFooterAside" />
    <div class="el-widget-wrapper__footer py-12 px-24" v-if="hasFooterOrFooterAside">
      <span>
        <slot name="footer" />
      </span>
      <span class="el-widget-wrapper__footer-aside">
        <slot name="footer-aside" />
      </span>
    </div>
  </div>
</template>

<script>
import ElIcon from 'packages/icon';
import { t } from '@/locale';

export default {
  name: 'ElWidgetWrapper',
  components: {
    ElIcon
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
      emptyText: t('el.widgetwrapper.noDataMessage')
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
