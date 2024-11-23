import type { AcvNotificationPlugin, AcvNotificationProps } from './notification.ts';
import { createComponent } from '@/components/notification/utils.ts';
import eventBus from '@/utils/eventBus';
import { AcvNotificationType } from './notification.ts';
import ElNotify from './notify.vue';

export function useNotify(globalProps: Partial<AcvNotificationProps> = {}): AcvNotificationPlugin {
  return {
    open(options?: Partial<AcvNotificationProps> | string) {
      let message: string | null = null;
      if (typeof options === 'string')
        message = options;

      const defaultProps = {
        message
      };

      const propsData = Object.assign({}, defaultProps, globalProps, options);

      const instance = createComponent(ElNotify, propsData, document.body);

      return {
        dismiss: instance?.exposed?.dismiss
      };
    },
    clear() {
      eventBus.$emit('notify-clear');
    },
    success(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: AcvNotificationType.SUCCESS
      }, options));
    },
    error(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: 'error'
      }, options));
    },
    info(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: 'info'
      }, options));
    },
    warning(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: 'warning'
      }, options));
    },
    progress(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: 'progress'
      }, options));
    },
    default(message, options = {}) {
      return this.open(Object.assign({}, {
        message,
        type: 'default'
      }, options));
    }
  };
}
