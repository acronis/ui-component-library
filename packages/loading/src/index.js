import { createApp, nextTick } from 'vue';

import afterLeave from '@/utils/after-leave';
import { addClass, removeClass, getStyle } from '@/utils/dom';
import merge from '@/utils/merge';

import loadingVue from './loading.vue';

const LoadingConstructor = createApp(loadingVue);

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
};

LoadingConstructor.originalPosition = '';
LoadingConstructor.originalOverflow = '';

LoadingConstructor.close = function () {
  afterLeave(this, () => {
    const target = this.fullscreen || this.body
      ? document.body
      : this.target;
    removeClass(target, 'el-loading-parent--relative');
    removeClass(target, 'el-loading-parent--hidden');
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$destroy();
  }, 300);
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  const maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    ['top', 'left'].forEach((property) => {
      const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = `${options.target.getBoundingClientRect()[property]
        + document.body[scroll]
        + document.documentElement[scroll]
      }px`;
    });
    ['height', 'width'].forEach((property) => {
      maskStyle[property] = `${options.target.getBoundingClientRect()[property]}px`;
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
  }
  Object.keys(maskStyle).forEach((property) => {
    instance.$el.style[property] = maskStyle[property];
  });
};

const Loading = (options = {}) => {
  const internalOptions = merge({}, defaults, options);
  if (typeof options.target === 'string') {
    internalOptions.target = document.querySelector(options.target);
  }
  internalOptions.target = internalOptions.target || document.body;
  if (internalOptions.target !== document.body) {
    internalOptions.fullscreen = false;
  } else {
    internalOptions.body = true;
  }

  const parent = internalOptions.body ? document.body : internalOptions.target;
  const instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: internalOptions
  });

  addStyle(internalOptions, parent, instance);
  if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
    addClass(parent, 'el-loading-parent--relative');
  }
  if (internalOptions.fullscreen && internalOptions.lock) {
    addClass(parent, 'el-loading-parent--hidden');
  }
  parent.appendChild(instance.$el);
  nextTick(() => {
    instance.visible = true;
  });
  return instance;
};

export default Loading;
