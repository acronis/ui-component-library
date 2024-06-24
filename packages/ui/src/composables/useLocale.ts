import { LOCALE_PLUGIN_INJECTION_KEY, injectStrict } from '../plugins/locale/localePlugin.ts';

interface InjectedLocale {
  availableLocales: string[]
  defaultLocale: string
  selectedLocale: string
  changeLocale: (locale: string) => void
  messages: Record<string, Record<string, string>>
}

export function useLocale() {
  const {
    availableLocales,
    defaultLocale,
    selectedLocale,
    changeLocale,
    messages
  } = injectStrict<InjectedLocale>(LOCALE_PLUGIN_INJECTION_KEY);

  return {
    availableLocales,
    defaultLocale,
    selectedLocale,
    changeLocale,
    messages
  };
}
