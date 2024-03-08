/* eslint-disable no-underscore-dangle */
import merge from '@/utils/merge';
import PopupManager from '@/utils/popup/popup-manager';
import getScrollBarWidth from '../scrollbar-width';
import { getStyle } from '../dom';

let idSeed = 1;
let scrollBarWidth;

const getDOM = function (dom) {
  /* istanbul ignore if */
  if (dom.nodeType === 3) {
    dom = dom.nextElementSibling || dom.nextSibling; // eslint-disable-line no-param-reassign
    getDOM(dom);
  }
  return dom;
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    modal: {
      type: Boolean,
      default: false
    },
    modalFade: {
      type: Boolean,
      default: true
    },
    modalClass: {},
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this._popupId = `popup-${idSeed++}`;
    PopupManager.register(this._popupId, this);
  },

  beforeUnmount() {
    PopupManager.deregister(this._popupId);
    PopupManager.closeModal(this._popupId);
    if (this.modal && this.bodyOverflow !== null && this.bodyOverflow !== 'hidden') {
      document.body.style.overflow = this.bodyOverflow;
      document.body.style.paddingRight = this.bodyPaddingRight;
    }
    this.bodyOverflow = null;
    this.bodyPaddingRight = null;
  },

  data() {
    return {
      opened: false,
      bodyOverflow: null,
      bodyPaddingRight: null,
      rendered: false
    };
  },

  watch: {
    visible(val) {
      if (val) {
        /* istanbul ignore if */
        if (this._opening) return;
        if (!this.rendered) {
          this.rendered = true;
          this.$nextTick(() => {
            this.open();
          });
        } else {
          this.open();
        }
      } else {
        this.close();
      }
    }
  },

  methods: {
    open(options) {
      if (!this.rendered) {
        this.rendered = true;
      }

      const props = merge({}, this.$props || this, options);

      if (this._closeTimer) {
        clearTimeout(this._closeTimer);
        this._closeTimer = null;
      }
      clearTimeout(this._openTimer);

      const openDelay = Number(props.openDelay);
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null;
          this.doOpen(props);
        }, openDelay);
      } else {
        this.doOpen(props);
      }
    },

    doOpen(props) {
      /* istanbul ignore if */
      if (this.$isServer) return;
      if (this.willOpen && !this.willOpen()) return;
      if (this.opened) return;

      this._opening = true;

      const dom = getDOM(this.$el);

      const { modal, zIndex } = props;

      if (zIndex) {
        PopupManager.zIndex = zIndex;
      }

      if (modal) {
        /* istanbul ignore if */
        if (this._closing) {
          PopupManager.closeModal(this._popupId);
          this._closing = false;
        }
        PopupManager.openModal(
          this._popupId,
          PopupManager.nextZIndex(),
          this.modalAppendToBody ? undefined : dom,
          props.modalClass,
          props.modalFade
        );
        if (props.lockScroll) {
          if (!this.bodyOverflow) {
            this.bodyPaddingRight = document.body.style.paddingRight;
            this.bodyOverflow = document.body.style.overflow;
          }
          scrollBarWidth = getScrollBarWidth();
          const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
          const bodyOverflowY = getStyle(document.body, 'overflowY');
          /* istanbul ignore if */
          if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll')) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
          }
          document.body.style.overflow = 'hidden';
        }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute';
      }

      dom.style.zIndex = PopupManager.nextZIndex();
      this.opened = true;

      this.onOpen && this.onOpen();

      this.doAfterOpen();
    },

    doAfterOpen() {
      this._opening = false;
    },

    close() {
      if (this.willClose && !this.willClose()) return;

      if (this._openTimer !== null && this._openTimer !== undefined) {
        clearTimeout(this._openTimer);
        this._openTimer = null;
      }
      clearTimeout(this._closeTimer);

      const closeDelay = Number(this.closeDelay);

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null;
          this.doClose();
        }, closeDelay);
      } else {
        this.doClose();
      }
    },

    doClose() {
      this._closing = true;

      this.onClose && this.onClose();

      if (this.lockScroll) {
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow;
            document.body.style.paddingRight = this.bodyPaddingRight;
          }
          this.bodyOverflow = null;
          this.bodyPaddingRight = null;
        }, 200);
      }

      this.opened = false;

      this.doAfterClose();
    },

    doAfterClose() {
      PopupManager.closeModal(this._popupId);
      this._closing = false;
    }
  }
};

export { PopupManager };
