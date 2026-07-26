import type { Decorator, Preview } from '@storybook/vue3';
import { useEffect, useGlobals } from '@storybook/preview-api';
import '../src/styles/reset.css';
import '../src/styles/themes/acronis/acronis.pcss';

export function withToggleDarkMode(StoryFn) {
  const [globals] = useGlobals();
  const darkMode = [true, 'true'].includes(globals.darkMode);

  useEffect(() => {
    if (darkMode) {
      global.document.documentElement.classList.add('acv-color-scheme-dark');
      global.document.documentElement.classList.remove('acv-color-scheme-light');
    }
    else {
      global.document.documentElement.classList.remove('acv-color-scheme-dark');
      global.document.documentElement.classList.add('acv-color-scheme-light');
    }
  }, [darkMode]);

  return StoryFn();
}

export const decorators: Decorator[] = [
  withToggleDarkMode
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    docs: {
      toc: true
    },
  },
  tags: ['autodocs'],
};

export default preview;
