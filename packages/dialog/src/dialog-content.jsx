import ElIcon from 'packages/icon';
import ElButton from 'packages/button';
import ElContainer from 'packages/container';
import ElMain from 'packages/main';
import ElAside from 'packages/aside';
import ElScrollbar from 'packages/scrollbar';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElDialogContent',

  components: {
    ElIcon,
    ElButton,
    ElScrollbar,
    ElContainer,
    ElMain,
    ElAside
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
      // this.broadcast('ElSelectDropdown', 'updatePopper');
      // this.broadcast('ElDropdownMenu', 'updatePopper');
    },

    updateFadeEdges(isHeightOverflow) {
      this.fadeEdges = isHeightOverflow;
    },

    handleClose() {
      this.$emit('close');
    },

    renderWithScrollbar(children) {
      return <el-scrollbar
        class="el-dialog__content-scrollbar"
        wrapClass="el-dialog__content-scrollbar-wrap"
        onScroll={this.updatePopper}
        on-overflow-update={this.updateFadeEdges}>
        {children}
      </el-scrollbar>;
    },

    renderWithFlexWrapper(children) {
      // for fixing IE flexbox layout with only min/max height set on container
      // can be removed if IE support no longer needed
      return <div class="el-dialog__flex-wrapper el-dialog__flex-wrapper--content">{children}</div>;
    },

    renderWithCleanContentWrapper(children) {
      if (this.variant === 'clean-basic') {
        return children;
      }
      // wrap element for clean variant
      return (
        <div
          class={{
            'el-dialog-content__clean-content': true,
            'is-fade-edges': this.fadeEdges
          }}>
            {children}
          </div>
      );
    },

    renderSlotWithDefaultChildren(slot, defaultChildren) {
      return this.$slots[slot] ? this.$slots[slot]() : defaultChildren();
    },

    renderCloseButton() {
      return (
        <el-button
          type="ghost"
          class="el-dialog__close-button qa-dialog-close-button"
          aria-label="Close"
          onClick={this.handleClose}>
          <el-icon name="i-times--24"/>
        </el-button>
      );
    },

    renderBody() {
      const defaultSlot = this.$slots.default?.();
      const children = this.isCleanVariant
        ? this.renderWithFlexWrapper(this.renderWithCleanContentWrapper(defaultSlot))
        : defaultSlot;

      return this.renderWithFlexWrapper((
        <div class="el-dialog__body">
          {this.hasBodyHeader && this.$slots['body-header']()}
          {this.withScrollbar ? this.renderWithScrollbar(children) : children}
          {this.hasBodyFooter && this.$slots['body-footer']()}
        </div>
      ));
    },

    renderAside() {
      return (
        <el-aside>
          <el-scrollbar
            class="el-dialog__aside"
            onScroll={this.updatePopper}>
            {this.$slots.aside && this.$slots.aside()}
          </el-scrollbar>
        </el-aside>
      );
    },

    renderHeader() {
      return (
        <div class="el-dialog__header">
          {this.renderSlotWithDefaultChildren('title', () => (
            <span class="el-dialog__title qa_title" title={this.title}>{ this.title }</span>
          ))}
          {this.showClose && this.renderCloseButton()}
        </div>
      );
    },

    renderFooter() {
      return (
        <div class="el-dialog__footer">
          <div class="el-dialog__footer-aside">
            {this.renderSlotWithDefaultChildren('footer-aside', () => (
              <span class="el-text el-text--body-24">
                {this.$slots['footer-text'] && this.$slots['footer-text']()}
              </span>
            ))}
          </div>
          <div class="el-dialog__footer-actions">
            {this.$slots.footer && this.$slots.footer()}
          </div>
        </div>
      );
    },

    handleArrowKey(event) {
      if (
        (event.keyCode === 38 || event.keyCode === 40)
        && document.activeElement !== this.contentWrapper) {
        this.$el.querySelector('.el-dialog__content-scrollbar-wrap').focus();
      }
    }
  },

  render() {
    return (
      <div
        tabindex="-1"
        class="el-dialog__container">
        {this.hasHeader && this.renderHeader()}
        <el-container>
          {this.hasAside && this.renderAside()}
          <el-main color={this.color}>
            {this.isCleanVariant && this.showClose && this.renderCloseButton()}
            {this.renderBody()}
            {this.hasFooter && this.renderFooter()}
          </el-main>
        </el-container>
      </div>
    );
  }
};
