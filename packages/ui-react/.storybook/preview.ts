// @ts-expect-error -- Storybook types use package.json "exports" which require moduleResolution "bundler"
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
// Storybook-only: makes autodocs story surfaces follow `[data-theme]`. Without it
// a dark-mode docs page paints light component text on Storybook's white preview
// box. See the file for why it themes the story surfaces and not the docs page.
import './storybook-docs.css';
import {
  applyBrand,
  applyColorMode,
  applyLocaleAndDirection,
  BRAND_ITEMS,
  type Brand,
  type ColorMode,
  type Direction,
  type Locale,
} from './globals';

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Token brand',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        // Generated from `BRANDS`, so the toolbar cannot offer fewer brands than
        // the token bundle ships. The hand-written list this replaced had drifted
        // to 9 of 21 — `apps/demo` offered all of them, so the same kit looked
        // like it had two different brand sets depending on where you opened it.
        items: BRAND_ITEMS,
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: 'Light or dark mode',
      toolbar: {
        title: 'Mode',
        icon: 'sun',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          // Removes `[data-theme]` entirely so the tokens' `color-scheme: light
          // dark` defers to YOUR OS setting — the state a consumer who ships the
          // bundle and sets nothing actually gets. Flip your system appearance to
          // see it change; nothing in Storybook will.
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction',
      toolbar: {
        title: 'Direction',
        icon: 'mirror',
        items: [
          { value: 'auto', title: 'Auto (from locale)' },
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Document language',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'Deutsch' },
          { value: 'fr', title: 'Français' },
          { value: 'ja', title: '日本語' },
          { value: 'ar', title: 'العربية (RTL)' },
          { value: 'he', title: 'עברית (RTL)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'acronis',
    colorMode: 'light',
    direction: 'auto',
    locale: 'en',
  },
  decorators: [
    (Story, context) => {
      applyBrand((context.globals.brand as Brand) || 'acronis');
      applyColorMode((context.globals.colorMode as ColorMode) || 'light');
      applyLocaleAndDirection(
        (context.globals.locale as Locale) || 'en',
        (context.globals.direction as Direction) || 'auto'
      );
      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
