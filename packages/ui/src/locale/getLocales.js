import locales from './locales';

export function getLocales(hasTestLocale = false) {
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
