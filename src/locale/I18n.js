import deepmerge from 'deepmerge';

import defaultLang from '@/locale/lang/en-US';

import Format from './format';

const format = Format();
let lang = defaultLang;
let merged = false;

// TODO vue 3 Fix i18n handler(use vue-i18n)
let i18nHandler = function (app) { // eslint-disable-line consistent-return
  const vuei18n = Object.getPrototypeOf(this || app).$t;
  if (typeof vuei18n === 'function' && !!app.locale) {
    if (!merged) {
      merged = true;
      app.locale(
        app.config.lang,
        deepmerge(lang, app.locale(app.config.lang) || {}, { clone: true })
      );
    }
    return vuei18n.apply(this, arguments); // eslint-disable-line prefer-rest-params
  }
};

export const i18n = function (fn) {
  i18nHandler = fn || i18nHandler;
};

export const t = function (path, options) {
  let value = i18nHandler.apply(this, arguments); // eslint-disable-line prefer-rest-params
  if (value !== null && value !== undefined) return value;

  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    /* istanbul ignore if */
    if (!value) return '';
    if (i === j - 1) return format(value, options);
    current = value;
  }

  return '';
};

export const setLocaleMessages = function (l) {
  lang = l || lang;
  lang = deepmerge(defaultLang, lang, { clone: true });
};
