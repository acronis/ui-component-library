<template>
  <div
    v-show="visible"
    class="el-alert-widget qa-alert-widget"
  >
    <el-alert
      v-bind="alertProps"
      hide-close
    >
      <template #title>
        <div class="el-alert-widget__title el-display--flex">
          <div class="el-alert-widget--header-title qa-alert-widget-header">
            <slot name="header-title">
              {{ headerTitle }}
            </slot>
          </div>
          <div :class="headerActionsClass">
            <slot
              name="header-actions"
              :close="close"
            >
              <div>
                <el-button
                  type="ghost"
                  icon="i-times--16"
                  @click.stop="close"
                />
              </div>
            </slot>
          </div>
        </div>
        <div class="el-text--body-24 qa-alert-subtitle">
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </div>
      </template>
      <template #description>
        <div class="el-alert-widget--description qa-alert-description">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </template>
      <template
        v-if="hasFooterActions"
        #actions
      >
        <div
          class="el-alert-widget--footer-actions__left qa-alert-footer-actions"
        >
          <slot name="footer-actions-left" />
        </div>
        <div
          class="el-alert-widget--footer-actions__right qa-alert-footer-actions-right"
        >
          <slot name="footer-actions-right" />
        </div>
      </template>
    </el-alert>
  </div>
</template>
<script>
import ElAlert from 'packages/alert';
import ElButton from 'packages/button';

  const TYPES_MAP = [
    'info',
    'success',
    'warning',
    'critical',
    'error',
    'unknown'
  ];

  const ALERT_WIDGET_PROPS = [
      'headerActionsRight',
      'headerTitle'
  ];

export default {
    name: 'ElAlertWidget',

    components: {
      ElAlert,
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
        validator: (value) => TYPES_MAP.includes(value)
      },
      border: {
        type: [Boolean, Object],
        default: () => ({})
      },
      card: {
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
      headerActionsRight: {
        type: Boolean,
        default: true
      },
      headerTitle: {
        type: String,
        default: ''
      },
      subtitle: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      visible: true
    }),
    computed: {
        alertProps() {
            const filteredProps = {};
            return Object.keys(this.$props)
                .filter((key) => !ALERT_WIDGET_PROPS.includes(key))
                .reduce((prevKey, key) => {
                    filteredProps[key] = this.$props[key];
                    return filteredProps;
                }, filteredProps);
        },
        headerActionsClass() {
            return 'el-display--flex el-alert-widget--header-actions'
            + ` el-alert-widget--header-actions__${this.headerActionsRight ? 'right' : 'left'}`;
        },
        hasFooterActions() {
          return this.hasFooterActionsLeft() || this.hasFooterActionsRight();
        },
        hasMultialignFooterActions() {
            return this.hasFooterActionsLeft() && this.hasFooterActionsRight();
        },
        footerActionsContainerClass() {
          let containerActionsAlignment = 'right';
          if (this.hasMultialignFooterActions) {
            containerActionsAlignment = 'left-right';
          } else if (this.hasFooterActionsLeft()) {
            containerActionsAlignment = 'left';
          }
          return 'el-display--flex el-alert-widget--footer-actions'
            + ` el-alert-widget--footer-actions--container__${containerActionsAlignment}`;
        }
    },
    methods: {
      close() {
        this.visible = false;
        this.$emit('close');
      },
      hasFooterActionsRight() {
          return !!this.$slots['footer-actions-right'];
      },
      hasFooterActionsLeft() {
          return !!this.$slots['footer-actions-left'];
      }
    }
};
</script>
