export const inBrowser = typeof window !== 'undefined';
export const UA = inBrowser && window.navigator.userAgent.toLowerCase();
export const isIE = UA && /msie|trident/.test(UA);
export const isEdge = UA && UA.indexOf('edge/') > 0;

// eslint-disable-next-line import/no-mutable-exports
export let supportsPassive = false;
if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', ({
      // eslint-disable-next-line getter-return
      get() {
        supportsPassive = true;
      }
    }));
    window.addEventListener('test-passive', null, opts);
  } catch (e) {} // eslint-disable-line no-empty
}
