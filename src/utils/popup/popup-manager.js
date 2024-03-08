/* eslint-disable no-use-before-define */

import { addClass, removeClass } from '@/utils/dom';

let hasModal = false;

const getModal = function () {
  let { modalDom } = PopupManager;
  if (modalDom) {
    hasModal = true;
  } else {
    hasModal = false;
    modalDom = document.createElement('div');
    PopupManager.modalDom = modalDom;

    modalDom.addEventListener('touchmove', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    modalDom.addEventListener('click', () => {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick();
    });
  }

  return modalDom; // eslint-disable-line consistent-return
};

const instances = {};

const PopupManager = {
  baseZIndex: 2000,
  zIndex: 2000,

  modalFade: true,

  getInstance(id) {
    return instances[id];
  },

  register(id, instance) {
    /* istanbul ignore else */
    if (id && instance) {
      instances[id] = instance;
    }
  },

  deregister(id) {
    /* istanbul ignore else */
    if (id) {
      instances[id] = null;
      delete instances[id];
    }
  },

  nextZIndex() {
    return PopupManager.zIndex++;
  },

  resetZIndex() {
    /**
     * Popup manager shared by popover, dialog and other elements
     * like cascader, select options, dropdown etc...
     * reset z index is required for dialog to close the modal
     * Dialog requires to set zIndex for modal and backdrops
     * so reset should require to reset z index - 2
     */
    this.zIndex -= 2;
  },

  modalStack: [],

  doOnModalClick() {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    /* istanbul ignore if */
    if (!topItem) return;

    const instance = PopupManager.getInstance(topItem.id);
    /* istanbul ignore else */
    if (instance && instance.closeOnClickModal) {
      instance.close();
    }
  },

  openModal(id, zIndex, dom, modalClass, modalFade) {
    if (!id || zIndex === undefined) return;
    this.modalFade = modalFade;

    const modalStack = this.modalStack; // eslint-disable-line prefer-destructuring

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    addClass(modalDom, 'v-modal');
    if (this.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter');
    }
    if (modalClass) {
      const classArr = modalClass.trim().split(/\s+/);
      classArr.forEach((item) => addClass(modalDom, item));
    }
    removeClass(modalDom, 'v-modal-enter');

    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = '';

    this.modalStack.push({ id, zIndex, modalClass });
  },

  closeModal(id) {
    const modalStack = this.modalStack; // eslint-disable-line prefer-destructuring
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      if (topItem.id === id) {
        if (topItem.modalClass) {
          const classArr = topItem.modalClass.trim().split(/\s+/);
          classArr.forEach((item) => removeClass(modalDom, item));
        }

        modalStack.pop();
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
      if (modalStack.length > 0) {
        this.zIndex = modalStack[modalStack.length - 1].zIndex + 1;
      }
    }

    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave');
      }
      if (modalStack.length === 0) {
        if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
        modalDom.style.display = 'none';
        PopupManager.modalDom = undefined;
      }
      removeClass(modalDom, 'v-modal-leave');

      this.resetZIndex();
    }
  }
};

const getTopPopup = function () {
  if (PopupManager.modalStack.length > 0) {
    const topPopup = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topPopup) return;

    return PopupManager.getInstance(topPopup.id); // eslint-disable-line consistent-return
  }
};

if (typeof window !== 'undefined') {
  // handle `esc` key when the popup is shown
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup();

      if (topPopup?.closeOnPressEscape) {
        topPopup.handleClose // eslint-disable-line no-nested-ternary
          ? topPopup.handleClose()
          : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close());
      }
    }
  });
}

export default PopupManager;
