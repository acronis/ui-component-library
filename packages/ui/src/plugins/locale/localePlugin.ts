import type { App } from 'vue';
import { inject } from 'vue';
import { merge } from 'lodash-es';

export const LOCALE_PLUGIN_INJECTION_KEY = Symbol('ACV_LOCALE_INJECTION_KEY');

export function injectStrict<T>(key: typeof LOCALE_PLUGIN_INJECTION_KEY, fallback?: T) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.toString()}`);
  }

  return resolved;
}

// export function injectLocale() {
//   const controllers = injectStrict('locale') as IProvider;
//   return controllers.localeController;
// }

export const ACV_LOCALE = {
  en: 'en_US',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  pt: 'pt',
  zh: 'zh'
} as const;

export type AcvLocale = typeof ACV_LOCALE[keyof typeof ACV_LOCALE];

interface LocalePluginOptions {
  defaultLocale: AcvLocale
  locale: AcvLocale
  messages: Record<string, Record<string, string>>
}

export default {
  install: (app: App, options: LocalePluginOptions) => {
    const defaultLocale = options?.defaultLocale || options?.locale;
    if (!defaultLocale) {
      throw new Error('Could not resolve defaultLocale');
    }
    const defaultLocalMessages = options?.messages || {};

    app.provide(LOCALE_PLUGIN_INJECTION_KEY, {
      availableLocales: Object.keys(defaultLocalMessages),
      defaultLocale,
      selectedLocale: defaultLocale,
      messages: {
        ...merge(defaultLocalMessages, options?.messages)
      }
    });
  }
};
