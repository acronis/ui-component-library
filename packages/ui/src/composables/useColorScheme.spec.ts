import { ACV_THEME_LC_KEY, useColorScheme } from '@/composables/useColorScheme';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

describe('useColorScheme', () => {
  it('returns default color scheme', () => {
    const { colorScheme } = useColorScheme();
    expect(colorScheme.value).toEqual('light');
  });

  it('returns dark mode status correctly', () => {
    localStorage.setItem(ACV_THEME_LC_KEY, 'dark');
    const { isDark } = useColorScheme();
    expect(isDark.value).toEqual(true);
  });

  it('sets color scheme correctly', async () => {
    const { setColorScheme, colorScheme } = useColorScheme();
    setColorScheme('light');
    expect(colorScheme.value).toEqual('light');
    await nextTick();
    expect(localStorage.getItem(ACV_THEME_LC_KEY)).toEqual('light');
  });

  it('does not change color scheme if the same is set', () => {
    const { setColorScheme, colorScheme } = useColorScheme();
    setColorScheme('light');
    const initialColorScheme = colorScheme.value;
    setColorScheme('light');
    expect(colorScheme.value).toEqual(initialColorScheme);
  });
});
