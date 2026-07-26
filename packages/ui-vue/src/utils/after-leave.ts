import { once as onceFn } from './dom.ts';
/**
 * Bind after-leave event for vue instance. Make sure after-leave is called in any browsers.
 *
 * @param {Vue} instance Vue instance.
 * @param {Function} callback callback of after-leave event
 * @param {number} speed the speed of transition, default value is 300ms
 * @param {boolean} once weather bind after-leave once. default value is false.
 */
export default function (instance, callback, speed = 300, once = false) {
  if (!instance || !callback)
    throw new Error('instance & callback is required');
  let called = false;
  const afterLeaveCallback = function () {
    if (called)
      return;
    called = true;
    if (callback) {
      // eslint-disable-next-line prefer-rest-params
      callback(...arguments);
    }
  };
  if (once) {
    onceFn(instance.element, 'after-leave', afterLeaveCallback);
    // instance.$once('after-leave', afterLeaveCallback);
  }
  else {
    instance.$on('after-leave', afterLeaveCallback);
  }
  setTimeout(() => {
    afterLeaveCallback();
  }, speed + 100);
}
