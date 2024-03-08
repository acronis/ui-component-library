import { defineComponent } from 'vue';

import { PopupManager } from '@/utils/popup';
import { isVNode } from '@/utils/vdom';

import Main from './main.vue';

const NotificationConstructor = defineComponent({ extends: defineComponent({ ...Main }) });

const instances = [];
let seed = 1;

const Notification = function (options = {}) {
  const instance = Notification.create(options);
  Notification.position(instance, options.offset);
  Notification.register(instance);

  return instance.vm;
};

Notification.getId = function () {
  return `notification_${seed++}`;
};

Notification.create = function (options) {
  const id = Notification.getId();
  const {
    title,
    message,
    dangerouslyUseHTMLString,
    ...props
  } = options;
  const instance = new NotificationConstructor({
    data: {
      title,
      message,
      dangerouslyUseHTMLString
    }
  });

  Object.keys(props).forEach((key) => {
    instance.$props[key] = props[key];
  });

  instance.id = id;
  instance.$props.onClose = () => Notification.close(id, options.onClose);
  instance.vm = instance.mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.keepAlive = false;
  instance.vm.display = true;
  instance.$el = instance.vm.$el;
  instance.$el.zIndex = PopupManager.nextZIndex();

  return instance;
};

Notification.register = function (instance) {
  instances.push(instance);
};

Notification.position = function (instance, offset = 0) {
  let verticalOffset = offset;

  instances.filter((item) => item.position === instance.position).forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset + 16;
};

Notification.close = function (id, userOnClose) {
  let index = -1;
  const len = instances.length;
  const instance = instances.filter((inst, i) => {
    if (inst.id === id) {
      index = i;
      return true;
    }
    return false;
  })[0];
  if (!instance) return;

  if (typeof userOnClose === 'function') {
    userOnClose(instance);
  }
  instances.splice(index, 1);

  if (len <= 1) return;
  const { position } = instance;
  const removedHeight = instance.$el.offsetHeight;
  for (let i = index; i < len - 1; i++) {
    if (instances[i].position === position) {
      const vertical = parseInt(instances[i].$el.style[instance.verticalProperty], 10);
      instances[i].$el.style[instance.verticalProperty] = `${vertical - removedHeight - 16}px`;
    }
  }
};

Notification.closeAll = function () {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

['info', 'success', 'warning', 'critical', 'error', 'progress'].forEach((type) => {
  Notification[type] = (options) => {
    let internalOptions = options;

    if (typeof options === 'string' || isVNode(options)) {
      internalOptions = {
        message: options
      };
    }

    internalOptions.type = type;

    return Notification(internalOptions);
  };
});

export default Notification;
