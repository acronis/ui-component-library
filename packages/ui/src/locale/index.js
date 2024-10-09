import * as langs from './lang/index';

export default function t(key, lang = 'en-US', count) {
  const language = lang.split('-').join('');
  const pluralRules = new Intl.PluralRules(lang, {
    type: 'cardinal'
  });
  if (langs[language] === undefined) {
    console.warn(`Locale: '${lang}' is missing, falling back to en-US`);
    if (key.endsWith('_plural')) {
      return langs.enUS[key][pluralRules.select(count)];
    }
    return langs.enUS[key];
  }

  if (langs[language][key] === undefined) {
    return key;
  }

  if (key.endsWith('_plural')) {
    return langs[language][key][pluralRules.select(count)];
  }

  return langs[language][key];
}

export { getFirstDayOfWeek } from './getFirstDayOfWeek';
export { getLocale } from './getLocale';
export { getLocales } from './getLocales';
export { i18n, setLocaleMessages, t } from './I18n';
