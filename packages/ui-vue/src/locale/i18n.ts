import type { LocaleMessages } from './types';
// import defaultLang from '@/locale/lang/en-US';
// import messages from '@intlify/unplugin-vue-i18n/messages';
// import deepmerge from 'deepmerge';
import { getCurrentInstance } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import messages from './lang/en-US';

export const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  legacy: false,
  messages: {
    'en-US': messages
  }
});

export function useLocale(lang: string) {
  const instance: any = getCurrentInstance();
  const { app = {} } = instance?.appContext || {};

  app.use(i18n);

  const { t, locale } = useI18n({
    locale: lang
  });

  return {
    locale,
    messages: i18n.global.messages,
    t
  };
}

export function t(message, ..._args) {
  return message;
}

export function setLocale(locale) {
  i18n.global.locale.value = locale;
}

export function setLocaleMessages(locale, messages: LocaleMessages): void {
  i18n.global.setLocaleMessage(locale, messages);
  // lang = messages || lang;
  // lang = deepmerge(defaultLang, lang, { clone: true });
}
