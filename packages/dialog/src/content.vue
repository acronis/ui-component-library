<template>
  <div
    tabindex="-1"
    class="el-dialog__container">
    <template v-if="hasHeader">
      <div class="el-dialog__header">
        <slot name="title">
          <span class="el-dialog__title qa_title" :title="title">
            {{ title }}
          </span>
        </slot>
        <template v-if="showClose">
          <el-button
            type="ghost"
            class="el-dialog__close-button qa-dialog-close-button"
            aria-label="Close"
            @click="handleClose"
          >
            <el-icon name="i-times--24"/>
          </el-button>
        </template>
      </div>
    </template>
    <el-container>
      <template v-if="hasAside">
        <el-aside>
          <el-scrollbar
            class="el-dialog__aside"
            @scroll="updatePopper"
          >
            <slot name="aside">
            </slot>
          </el-scrollbar>
        </el-aside>
      </template>
      <el-main :color="color">
        <template v-if="isCleanVariant && showClose">
          <el-button
            type="ghost"
            class="el-dialog__close-button qa-dialog-close-button"
            aria-label="Close"
            @click="handleClose">
            <el-icon name="i-times--24"/>
          </el-button>
        </template>
        <div class="el-dialog__flex-wrapper el-dialog__flex-wrapper--content">
          <div class="el-dialog__body">
            <template v-if="hasBodyHeader">
              <slot name="body-header">

              </slot>
            </template>
            <template v-if="withScrollbar">
              <el-scrollbar
                class="el-dialog__content-scrollbar"
                wrapClass="el-dialog__content-scrollbar-wrap"
                @scroll="updatePopper"
                @overflow-update="updateFadeEdges"
              >
                <template v-if="isCleanVariant">
                  <div class="el-dialog__flex-wrapper el-dialog__flex-wrapper--content">
                    <template v-if="variant === 'clean-basic'">
                      <slot/>
                    </template>
                    <template v-else>
                      <div
                        :class="{
                          'el-dialog-content__clean-content': true,
                          'is-fade-edges': fadeEdges
                        }"
                      >
                        <slot/>
                      </div>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <slot></slot>
                </template>
              </el-scrollbar>
            </template>
            <template v-if="hasBodyFooter">
              <slot name="body-footer">

              </slot>
            </template>
          </div>
        </div>
        <template v-if="hasFooter">
          <div class="el-dialog__footer">
            <div class="el-dialog__footer-aside">
              <slot name="footer-aside">
                <span class="el-text el-text--body-24">
                  <slot name="footer-text">

                  </slot>
                </span>
              </slot>
            </div>
            <div class="el-dialog__footer-actions">
              <slot name="footer"></slot>
            </div>
          </div>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import ElMain from 'packages/main';
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import ElContainer from 'packages/container';
  import ElAside from 'packages/aside';
  import ElScrollbar from 'packages/scrollbar';
  import eventBus from '@/utils/eventBus';

  export default {
    name: 'ElDialogContent',
    components: {
      ElMain,
      ElContainer,
      ElIcon,
      ElButton,
      ElAside,
      ElScrollbar
    },
    props: {
      // same as in parent dialog
      color: String,
      showClose: Boolean,
      withScrollbar: {
        type: Boolean,
        default: true
      },
      title: String,
      variant: String
    },
    emits: ['close'],
    data() {
      return {
        fadeEdges: false // for clean variant
      };
    },
    computed: {
      isCleanVariant() {
        return ['clean', 'clean-basic'].includes(this.variant);
      },
      hasHeader() {
        return !this.isCleanVariant && (this.$slots.title || this.title);
      },
      hasAside() {
        return !this.isCleanVariant && this.$slots.aside;
      },
      hasFooter() {
        return !this.isCleanVariant && this.$slots.footer;
      },
      hasBodyFooter() {
        return !this.isCleanVariant && this.$slots['body-footer'];
      },
      hasBodyHeader() {
        return this.$slots['body-header'];
      }
    },

    mounted() {
      this.contentWrapper = this.$el.querySelector('.el-dialog__content-scrollbar-wrap');
      this.contentWrapper?.setAttribute('tabindex', '-1');
      this.$el.addEventListener('keydown', this.handleArrowKey);
    },

    beforeUnmount() {
      this.$el.removeEventListener('keydown', this.handleArrowKey);
    },

    methods: {
      updatePopper() {
        eventBus.$emit('el.select.dropdown.updatePopper');
        eventBus.$emit('el.dropdown.menu.updatePopper');
      },

      updateFadeEdges(isHeightOverflow) {
        this.fadeEdges = isHeightOverflow;
      },

      handleClose() {
        this.$emit('close');
      },
      handleArrowKey(event) {
        if (
          (event.keyCode === 38 || event.keyCode === 40)
          && document.activeElement !== this.contentWrapper) {
          this.$el.querySelector('.el-dialog__content-scrollbar-wrap').focus();
        }
      }
    }
  }
</script>