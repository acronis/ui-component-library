import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

export type ColorScheme = 'light' | 'dark';
export const ACV_THEME_LC_KEY = 'acv-color-scheme';

export function useColorScheme() {
  const mode = useColorMode({
    attribute: 'class',
    storageKey: ACV_THEME_LC_KEY,
    modes: {
      light: 'acv-color-scheme-light',
      dark: 'acv-color-scheme-dark',
    },
  });
  const colorScheme = computed(() => mode.value);
  const isDark = computed(() => colorScheme.value === 'dark');

  function setColorScheme(colorSchemeId: ColorScheme) {
    mode.value = colorSchemeId;
  }

  return {
    colorScheme,
    isDark,
    setColorScheme,
  };
}
