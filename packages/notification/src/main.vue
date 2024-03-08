<template>
  <transition name="el-notification-fade">
    <div
      v-show="display"
      class="el-notification"
      :title="hoverHint"
      :style="positionStyle"
      :class="[
        customClass,
        horizontalClass,
        type ? `el-notification--${type}` : '',
        {'is-closable': showClose}
      ]"
      role="alert"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
    >
      <div class="el-notification__container">
        <div
          v-if="isIconShown"
          class="el-notification__icon"
          :class="{
            iconClass,
            'el-notification__icon--align-message':hasMessage,
            'el-notification__icon--align-title':hasTitle
          }"
        >
          <el-spinner
            v-if="type === 'progress'"
            size="sm"
          />
          <el-icon
            v-else
            :name="iconName"
            size="16"
          />
        </div>
        <div class="el-notification__content">
          <slot>
            <div
              v-if="title"
              class="el-notification__title"
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
                class="el-notification__message"
              >
                {{ message }}
              </div>
            </template>
          </slot>
        </div>
      </div>
      <div
        v-if="showClose"
        class="el-notification__close"
        tabindex="0"
        @click.stop="close"
        @keydown.enter="close"
      >
        <el-icon name="i-times--16" />
      </div>
    </div>
  </transition>
</template>

<script>
  import ElIcon from 'packages/icon';
  import ElSpinner from 'packages/spinner';

  const TYPES_MAP = {
    info: 'clr-info--16',
    success: 'clr-success--16',
    warning: 'clr-warning--16',
    critical: 'clr-critical--16',
    error: 'clr-danger--16'
  };

  export default {
    name: 'ElNotificationComponent',

    componentName: 'ElNotificationComponent',

    components: {
      ElIcon,
      ElSpinner
    },

    props: {
      visible: Boolean,
      type: String,
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
      onClick: {
        type: Function,
        default: () => {}
      },
      position: {
        type: String,
        default: 'bottom-right',
        validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].indexOf(value) > -1
      },
      duration: {
        type: Number,
        default: 4500
      },
      showHoverHint: {
        type: Boolean,
        default: false
      }
    },

    data: () => ({
      keepAlive: true,
      display: false,
      closed: false,
      timer: null,
      title: '',
      message: '',
      dangerouslyUseHTMLString: false,
      verticalOffset: 0
    }),

    computed: {
      iconName() {
        return this.type ? TYPES_MAP[this.type] : '';
      },

      horizontalClass() {
        return this.position.split('-')[1];
      },

      verticalProperty() {
        return this.position.split('-')[0];
      },

      positionStyle() {
        return {
          [this.verticalProperty]: `${this.verticalOffset}px`
        };
      },

      isComponent() {
        return this.message instanceof Function;
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

    watch: {
      visible(newVal) {
        if (newVal) {
          this.show();
        } else {
          this.hide();
        }
      },

      closed(newVal) {
        this.$emit('update:visible', !newVal);
        if (!this.keepAlive) {
          //          this.$el.addEventListener('transitionend', this.destroyElement);
          this.destroyElement();
        }
      }
    },

    mounted() {
      this.visible && this.show();
      if (this.duration > 0 && !this.closed) {
        this.timer = setTimeout(() => {
          this.close();
        }, this.duration);
      }
      document.addEventListener('keydown', this.keydown);
    },

    beforeUnmount() {
      document.removeEventListener('keydown', this.keydown);
    },

    methods: {
      destroyElement() {
        //        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        const el = this.$el;
        if (el.remove) {
          // everyone else except IE
          // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
          el.remove();
        } else if (el.parentNode && el.parentNode.removeChild) {
          // IE
          el.parentNode.removeChild(el);
        }
      },

      show() {
        this.display = true;
        this.closed = false;

        this.id = this.$notify.getId();
        this.$notify.position(this);
        this.$notify.register(this);

        if (this.duration > 0) {
          this.timer = setTimeout(() => { this.hide(); }, this.duration);
        }
      },

      hide() {
        this.display = false;
        this.$notify.close(this.id, () => !this.closed && this.onClose());
      },

      click() {
        this.onClick();
      },

      close() {
        this.closed = true;
        this.onClose();
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      },

      keydown(e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          this.clearTimer();
        } else if (e.keyCode === 27) {
          if (!this.closed) {
            this.close();
          }
        } else {
          this.startTimer();
        }
      }
    }
  };
</script>
