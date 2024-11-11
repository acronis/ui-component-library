import { components } from './components';
import { composables } from './composables';
import { directives } from './directives';
import { enExamples } from './examples';
import { enGuides } from './guides';
import { styleguide } from './styleguide.ts';
import { enTheme } from './theme';

export const sidebar = {
  '/guide': [
    {
      text: 'Developer Guide',
      items: enGuides,
    },
  ],
  '/components': components,
  '/directives': directives,
  '/composables': composables,
  '/styleguide': styleguide,
  '/examples': enExamples,
  '/theming': enTheme,
};
