/**
 * https://bugs.chromium.org/p/chromium/issues/detail?id=359691
 * Inaccurate properties value when browser not 100% zoom
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
 * Prevent usage of x and y which not supported in ClientRect API
 *
 * Round DOMRect API properties to the nearest integer
 */

if (typeof HTMLElement !== 'undefined') {
  HTMLElement.prototype.getBoundingClientRect = function () {
    const rect = Element.prototype.getBoundingClientRect.call(this);
    // Browser at default zoom
    if (window.devicePixelRatio === 1) {
      return rect;
    }
    const props = {};
    for (const prop in rect) { // eslint-disable-line no-restricted-syntax
      if (typeof rect[prop] === 'number') {
        props[prop] = Math.round(rect[prop]);
      }
    }
    // DOMRect for Chrome, FF, Safari
    // ClientRect for IE, Edge
    if ('DOMRect' in window) {
      rect.x = props.x;
      rect.y = props.y;
      rect.width = props.width;
      rect.height = props.height;
    } else {
      rect.bottom = props.bottom;
      rect.left = props.left;
      rect.right = props.right;
      rect.top = props.top;
    }
    return rect;
  };
}
