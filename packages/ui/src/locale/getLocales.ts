import type { Locale } from '@/locale/types.ts';
import locales from './locales.json';

export function getLocales(hasTestLocale = false): Locale[] {
  const predicate = hasTestLocale ? () => true : code => code !== 'locale-test';

  return Object.keys(locales)
    .filter(predicate)
    .map(code => locales[code])
    .sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (b.title < a.title) {
        return 1;
      }
      return 0;
    });
}
