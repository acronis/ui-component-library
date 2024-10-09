import { enComponents } from './components';
import { composables } from './composables';
import { directives } from './directives';
import { enExamples } from './examples';
import { enGuides } from './guides';
import { styleguide } from './styleguide.ts';
import { enTheme } from './theme';
import { widgets } from './widgets';

export const sidebar = {
  '/guide': [
    {
      text: 'Developer Guide',
      items: enGuides,
    },
  ],
  '/components': enComponents,
  '/directives': directives,
  '/widgets': widgets,
  '/composables': composables,
  '/styleguide': styleguide,
  '/examples': enExamples,
  '/theming': enTheme,
};
