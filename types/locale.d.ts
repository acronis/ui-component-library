export type Locale = {
  code: string,
  name: string,
  title: string
}
type LocaleMessages = Record<string, any>;
export function getLocale(code: string): Locale;
export function getLocales(): Locale[];
export function setLocaleMessages(messages: LocaleMessages): void;
