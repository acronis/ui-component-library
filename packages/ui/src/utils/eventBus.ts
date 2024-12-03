import emitter from 'tiny-emitter/instance';
import { onBeforeUnmount } from 'vue';

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
};

export function useEventBus() {
  const handlers: { event: string, handler: () => void }[] = [];

  onBeforeUnmount(() => {
    handlers.forEach(({ event, handler }) => {
      emitter.off(event, handler);
    });
  });

  return {
    on(event, handler) {
      handlers.push({ event, handler });
      emitter.on(event, handler);
    },
    emit(event, payload) {
      emitter.emit(event, payload);
    }
  };
}
