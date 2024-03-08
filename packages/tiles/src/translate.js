export function translate(text, i18n) {
  if (!i18n || typeof text === 'string') {
    return text;
  }

  if (text?.date !== undefined) {
    return i18n.d(text.date, text.key);
  }

  if (text?.value !== undefined) {
    return i18n.n(text.value, text.key);
  }

  if (text?.options) {
    Object.keys(text.options).forEach((key) => {
      if (typeof text.options?.[key] === 'object') {
        text.options[key] = translate(text.options?.[key], i18n);
      }
    });
    if (text?.count !== undefined) {
      return i18n.tc(text.key, text.count, text.options);
    }
    return i18n.t(text.key, text.options);
  }

  return i18n.t(text?.key);
}
