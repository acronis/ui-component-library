const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

const trim = function (string) {
  return (string || '').replace(/^\s+|\s+$/g, '');
};

const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, (_, _separator, letter, offset) => {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

export const on = (function () {
  return function (element, event, handler) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false);
    }
  };
}());

export const off = (function () {
  return function (element, event, handler) {
    if (element && event) {
      element.removeEventListener(event, handler, false);
    }
  };
}());

export function once(el, event, fn) {
  const listener = (...args) => {
    fn?.apply(el, args);
    off(el, event, listener);
  };
  on(el, event, listener);
}

export function hasClass(el, cls) {
  if (!el || !cls)
    return false;
  if (cls.includes(' '))
    throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  }
  return (` ${el.className} `).includes(` ${cls} `);
}

export function addClass(el, cls) {
  if (!el)
    return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName)
      continue;

    if (el.classList) {
      el.classList.add(clsName);
    }
    else if (hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

export function removeClass(el, cls) {
  if (!el || !cls)
    return;
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName)
      continue;

    if (el.classList) {
      el.classList.remove(clsName);
    }
    else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

export const getStyle = function (element, styleName) {
  if (!element || !styleName)
    return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    const computed = document.defaultView?.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed?.[styleName] : null;
  }
  catch {
    return element.style[styleName];
  }
};

/**
 * return scrollable parent element.
 * @param {Element} el    Current element.
 * @param {string}  axis  x or y. Leave it as undefined for both x and y.
 */
export function getScrollParent(el, axis) {
  const overflowKey = axis ? `overflow-${axis}` : 'overflow';
  while (el) {
    el = el.parentElement;

    if (el) {
      switch (window.getComputedStyle(el)[overflowKey]) {
        case 'auto':
        case 'scroll':
        case 'overlay':
          return el;
        default:
      }
    }
  }
  return window;
}
