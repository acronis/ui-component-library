// @ts-expect-error -- Storybook types use package.json "exports" which require moduleResolution "bundler"
import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import {
  applyBrand,
  applyColorMode,
  applyLocaleAndDirection,
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
        items: [
          { value: 'acronis', title: 'Default' },
          { value: 'brown', title: 'Brown' },
          { value: 'dark-gray', title: 'Dark Gray' },
          { value: 'deep-purple', title: 'Deep Purple' },
          { value: 'deep-sky-itkontoret', title: 'Deep Sky (ITKontoret)' },
          { value: 'green-also-choise-df', title: 'Green (Also Choise DF)' },
          { value: 'blue-yellow-uss-signal', title: 'Blue-Yellow USS Signal' },
          { value: 'virtuozzo', title: 'Virtuozzo' },
          { value: 'yellow-1c', title: 'Yellow 1C' },
        ],
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
