import { enComponents } from './components';
import { enTheme } from './theme';
import { enGuides } from './guides';
import { enExamples } from './examples';
import { directives } from './directives';
import { composables } from './composables';
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
  '/examples': enExamples,
  '/theming': enTheme,
};
