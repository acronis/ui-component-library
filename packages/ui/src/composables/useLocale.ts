import { injectStrict, LOCALE_PLUGIN_INJECTION_KEY } from '../plugins/locale/localePlugin.ts';

interface InjectedLocale {
  availableLocales: string[]
  defaultLocale: string
  selectedLocale: string
  changeLocale: (locale: string) => void
  messages: Record<string, Record<string, string>>
}

/**
 * A composable function to manage the locale of the application.
 * TODO: remove this function and use the `plugin` composable instead.
 */
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
