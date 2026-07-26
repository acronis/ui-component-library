import type { Plugin } from 'vue';
import { useNotify } from './useNotify.ts';

export * from './notification.ts';

const AcvNotifyPlugin: Plugin = {
  install: (app, options) => {
    const notify = useNotify(options);
    app.config.globalProperties.$notify = notify;
    app.provide('$notify', notify);
  }
};

export { AcvNotifyPlugin, useNotify };

export { default as AcvNotification } from './notification.vue';
