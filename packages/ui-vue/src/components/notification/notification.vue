<script>
  import ElIcon from '@/components/icon/icon.vue';
  import ElSpinner from '@/components/spinner/spinner.vue';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import { defineComponent } from 'vue';
  import './notify.css';

  const TYPES_MAP = {
    info: 'IconInfo16',
    success: 'IconSuccess16',
    warning: 'IconWarning16',
    critical: 'IconCritical16',
    error: 'IconDanger16'
  };

  export default defineComponent({
    name: 'AcvNotification',

    components: {
      ElIcon,
      ElSpinner,
      IconClose16
    },

    props: {
      visible: Boolean,
      message: {
        type: [String, Object, Function]
      },
      title: {
        type: String
      },
      type: {
        type: String,
        default: 'info'
      },
      iconClass: String,
      customClass: String,
      showClose: {
        type: Boolean,
        default: true
      },
      onClose: {
        type: Function,
        default: () => {}
      },
      duration: {
        type: Number,
        default: 4500
      },
      showHoverHint: {
        type: Boolean,
        default: false
      },
    },
    emits: ['update:visible', 'close'],

    data: () => ({
      dangerouslyUseHTMLString: false,
    }),

    computed: {
      iconName() {
        return this.type ? TYPES_MAP[this.type] : '';
      },

      isComponent() {
        return this.message instanceof Object;
      },

      isIconShown() {
        return this.iconClass || this.iconName || this.type === 'progress';
      },

      hoverHint() {
        return this.showHoverHint ? this.title : null;
      },

      hasTitle() {
        return this.title && this.title.length > 0;
      },

      hasMessage() {
        return this.message && this.message.length > 0;
      }
    },

    methods: {
      close() {
        this.$emit('close');
      }
    }
  });
</script>

<template>
  <div
    v-show="visible"
    class="acv-notification"
    :title="hoverHint"
    :class="[
      customClass,
      type ? `acv-notification--${type}` : '',
      { 'is-closable': showClose },
    ]"
    role="alert"
  >
    <div class="acv-notification__container">
      <div
        v-if="isIconShown"
        class="acv-notification__icon"
        :class="{
          iconClass,
          'acv-notification__icon--align-message': hasMessage,
          'acv-notification__icon--align-title': hasTitle,
        }"
      >
        <ElSpinner
          v-if="type === 'progress'"
          size="small"
        />
        <ElIcon
          v-else
          :name="iconName"
          size="small"
        />
      </div>
      <div class="acv-notification__content">
        <slot name="content" />
        <slot>
          <div
            v-if="title"
            class="acv-notification__title"
          >
            {{ title }}
          </div>
          <component
            :is="message"
            v-if="isComponent"
          />
          <template v-else>
            <div
              v-if="dangerouslyUseHTMLString"
              v-html="message"
            />
            <div
              v-else
              class="acv-notification__message"
            >
              {{ message }}
            </div>
          </template>
        </slot>
      </div>
    </div>
    <div
      v-if="showClose"
      class="acv-notification__close"
      tabindex="0"
      @click.stop="close"
      @keydown.enter="close"
    >
      <IconClose16 />
    </div>
  </div>
</template>

<style scoped>
.acv-notification {
  box-sizing: border-box;
  font-family: var(--acv-font-family-default), sans-serif;
  display: flex;
  max-width: 344px;
  min-width: 296px;
  min-height: 56px;
  border: var(--acv-border-regular) solid var(--acv-color-status-info-border);
  border-radius: var(--acv-radius-large);
  background-color: var(--acv-color-status-info-background);
  box-shadow: var(--acv-shadow-medium);
  overflow: hidden;
  z-index: var(--acv-z-index-notifications);

  /* transition: opacity .3s, transform .3s, left .3s, right .3s, top .4s, bottom .3s; */

  .acv-notification__container {
    display: flex;
    flex: 1;
    min-width: 0;
    padding: 16px 24px;
  }

  .acv-notification__close {
    color: var(--acv-color-brand-primary);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    min-height: 100%;
    border-left: var(--acv-border-width-small) var(--acv-color-brand-tertiary);

    &:focus {
      outline: none;
      background-color: var(--acv-color-status-hover);
    }

    &:hover {
      background-color: var(--acv-color-status-hover);
      cursor: pointer;
    }

    &:active {
      background-color: var(--acv-color-status-active);
    }
  }

  .acv-notification__icon {
    font-size: var(--acv-font-size-fluid-0);
    display: flex;
    align-items: center;
    margin-right: 24px;

    &.acv-notification__icon--align-message {
      height: var(--acv-font-line-height-small);
    }

    &.acv-notification__icon--align-title {
      height: var(--acv-font-line-height-medium);
    }
  }

  .acv-notification__content {
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
  }

  .acv-notification__title {
    font-size: var(--acv-font-size-caption);
    font-weight: var(--acv-font-weight-strong);
    line-height: var(--acv-font-line-height-medium);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .acv-notification__message {
    font-size: var(--acv-font-size-caption);
    font-weight: var(--acv-font-weight-regular);
    line-height: var(--acv-font-line-height-small);
  }

  .acv-notification--progress {
    border: var(--acv-border-width-small) var(--acv-color-brand-primary);
    background-color: var(--acv-color-white);

    .acv-notification__close {
      &:hover {
        background-color: var(--acv-color-status-hover);
      }

      &:active {
        background-color: var(--acv-color-status-active);
      }
    }
  }

  .is-closable {
    min-width: 360px;
    max-width: 408px;
  }

  &.acv-notification--info {
    border: var(--acv-border-width-small) solid var(--acv-color-status-info-border);
    background-color: var(--acv-color-status-info-background);
    color: var(--acv-color-status-info-text);

    .acv-notification__icon {
      color: hsl(211deg 77% 56%);
    }

    .acv-notification__close {
      &:focus .el-button {
        outline: none;
        background-color: var(--acv-color-status-focus);
      }

      &:hover {
        background-color: var(--acv-color-status-hover);
      }

      &:active {
        background-color: var(--acv-color-status-active);
      }
    }
  }

  &.acv-notification--success {
    border: 1px solid var(--acv-color-status-success-border);
    background-color: var(--acv-color-status-success-background);
    color: var(--acv-color-status-success-text);
  }

  &.acv-notification--warning {
    border: 1px solid var(--acv-color-status-warning-border);
    background-color: var(--acv-color-status-warning-background);
    color: var(--acv-color-status-warning-text);
  }

  &.acv-notification--critical {
    border: 1px solid var(--acv-color-status-critical-border);
    background-color: var(--acv-color-status-critical-background);
    color: var(--acv-color-status-critical-text);
  }

  &.acv-notification--error {
    border: 1px solid var(--acv-color-status-danger-border);
    background-color: var(--acv-color-status-danger-background);
    color: var(--acv-color-status-danger-text);
  }

  &.acv-notification--progress {
    border: 1px solid var(--acv-color-status-info-border);
    background-color: var(--acv-color-status-info-background);
    color: var(--acv-color-status-info-text);
  }

  &.right {
    right: 16px;
  }

  &.left {
    left: 16px;
  }
}

.acv-notification-fade-enter {
  &.right {
    right: 0;
    transform: translateX(100%);
  }

  &.left {
    left: 0;
    transform: translateX(-100%);
  }
}

.acv-notification-fade-leave-active {
  opacity: 0;
}
</style>
