import type { Locale } from './types';
import locales from './locales.json';

function getLocaleByCode(code) {
  return locales[code];
}

function getLocaleByName(name) {
  const code = Object.keys(locales).find(key => locales[key].name === name);
  return code ? locales[code] : undefined;
}

export function getLocale(code: string): Locale | undefined {
  return getLocaleByCode(code) || getLocaleByName(code);
}
