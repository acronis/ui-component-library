<template>
  <transition
    name="el-alert-fade"
  >
    <div
      v-show="visible"
      class="el-alert"
      :class="alertClasses"
      role="alert"
    >
      <template v-if="isAdvancedMode">
        <div class="el-alert-advance__wrapper">
          <div class="el-alert__container">
            <div
              v-if="showIcon"
              class="el-alert__icon"
            >
              <el-icon
                :name="iconName"
                size="16"
              />
            </div>
            <div class="el-alert__content">
              <!-- @slot Default slot to render title and description -->
              <slot>
                <div class="el-alert__title">
                  <!-- @slot Slot to render title -->
                  <slot name="title">
                    {{ title }}
                  </slot>
                </div>
                <div class="el-alert__description el-text el-text--body-24">
                  <!-- @slot Slot to render description -->
                  <slot name="description">
                    {{ description }}
                  </slot>
                </div>
              </slot>
            </div>
          </div>
          <div class="el-alert__container">
            <div
              :class="{'el-alert-advance__pseudo-icon': showIcon}"
              class="el-alert__content"
            >
              <div
                v-if="isSubtitle"
                class="el-text el-alert-advance__subtitle"
              >
                <slot name="subtitle">
                  {{ subtitle }}
                </slot>
              </div>
              <div
                v-if="isContent"
                :class="[{'mt-8': isSubtitle}, `el-alert-advance__content-block--${contentBlockType}`]"
                class="el-alert__content el-alert-advance__content-block"
              >
                <div class="el-alert-advance__content-block__text">
                  <slot name="content">
                    <div class="el-alert__title">
                      {{ content.title }}
                    </div>
                    <div
                      v-for="(text, index) in content.texts"
                      :key="index"
                      :class="[{'mt-8': (index === 0 && content.title) || index}]"
                      class="el-text el-text--body-24 el-alert__subtitle"
                    >
                      {{ text }}
                    </div>
                  </slot>
                </div>
              </div>
              <div
                v-if="$slots.actions"
                class="el-alert__actions"
              >
                <slot name="actions" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="$slots['actions-right']"
          class="el-alert__actions-right"
        >
          <slot name="actions-right" />
        </div>
        <div
          v-if="!hideClose && !$slots['actions-right']"
          class="el-alert__close"
          @click.stop="close"
        >
          <el-button type="icon">
            <el-icon name="i-times--16" />
          </el-button>
        </div>
      </template>
      <template v-else>
        <div class="el-alert__container">
          <div
            v-if="showIcon"
            class="el-alert__icon"
          >
            <el-icon
              :name="iconName"
              size="16"
            />
          </div>
          <div class="el-alert__content">
            <slot>
              <div class="el-alert__title">
                <slot name="title">
                  {{ title }}
                </slot>
              </div>
              <div class="el-alert__description el-text el-text--body-24">
                <slot name="description">
                  {{ description }}
                </slot>
              </div>
            </slot>
            <div
              v-if="$slots.actions"
              class="el-alert__actions"
            >
              <slot name="actions" />
            </div>
          </div>
        </div>
        <div
          v-if="$slots['actions-right']"
          class="el-alert__actions-right"
        >
          <slot name="actions-right" />
        </div>
        <div
          v-if="!hideClose && !$slots['actions-right']"
          class="el-alert__close"
          @click.stop="close"
        >
          <el-button type="icon">
            <el-icon name="i-times--16" />
          </el-button>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import { AlertIconTypes, AlertType } from './AlertTypes.ts';

  /**
   * ElAlert Component description
   */
   export default {
  name: 'ElAlert',

  components: {
    ElIcon,
    ElButton
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => Object.values(AlertType).indexOf(value) !== -1
    },
    border: {
      type: [Boolean, Object],
      default: () => ({})
    },
    borderTop: {
      type: Boolean,
      default: false
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    card: {
      type: Boolean,
      default: false
    },
    ribbon: {
      type: Boolean,
      default: false
    },
    /**
       * @deprecated behaviour will be revised
       */
    advanced: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    transparent: {
      type: Boolean,
      default: false
    },
    hideClose: {
      type: Boolean,
      default: false
    },
    /**
       * @deprecated will be removed
       */
    subtitle: {
      type: String,
      default: ''
    },
    content: {
      type: Object,
      default: () => ({})
    },
    contentBlockType: {
      type: String,
      default: AlertType.SUCCESS,
      validator: (value) => Object.values(AlertType).indexOf(value) !== -1
    },
    icon: {
      type: String,
      default: ''
    }
  },

  emits: ['close'],

  data() {
    return {
      visible: true
    };
  },

  computed: {
    alertClasses() {
      const {
        type, transparent, cBorder, card, ribbon, isAdvancedMode
      } = this;

      return [
        `el-alert--${type}`,
        { 'el-alert--transparent': transparent },
        { 'el-alert--with-top-border': cBorder.top && !cBorder.bottom },
        { 'el-alert--with-bottom-border': cBorder.bottom && !cBorder.top },
        { 'el-alert--with-top-bottom-borders': cBorder.top && cBorder.bottom },
        { 'el-alert--with-card': card },
        { 'el-alert--ribbon': ribbon },
        { 'el-alert-advance': isAdvancedMode }
      ];
    },
    iconName() {
      return this.icon || AlertIconTypes[this.type];
    },
    isContent() {
      return (this.content.title?.length > 0)
          || (this.content.texts?.length > 0)
          || !!(this.$slots?.content);
    },
    isSubtitle() {
      return this.subtitle.length > 0 || !!(this.$slots?.subtitle);
    },
    hasTitle() {
      return (this.title?.length > 0) || !!(this.$slots?.title);
    },
    isAdvancedMode() {
      return this.isSubtitle || this.isContent || this.advanced;
    },
    cBorder() {
      if (typeof this.border === 'boolean' && !this.borderTop && !this.borderBottom) {
        return { top: true, bottom: true };
      }

      if (this.borderTop || this.borderBottom) {
        return { top: this.borderTop, bottom: this.borderBottom };
      }

      return this.border;
    }
  },

  created() {
    if (process.env.NODE_ENV !== 'production') {
      (this.subtitle || this.$slots?.subtitle) && console.warn('[UI Kit Warn][Alert] Subtitle is deprecated. Please use description body.');
      (this.border?.top || this.border?.bottom) && console.warn('[UI Kit Warn][Alert] Border object is deprecated. Please use borderTop and borderBottom properties.');
      this.advanced && console.warn('[UI Kit Warn][Alert] Advanced is deprecated.');
    }
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit('close');
    }
  }
};
</script>
