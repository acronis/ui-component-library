import { enComponents } from './components';
import { enTheme } from './theme';
import { enGuides } from './guides';
import { enExamples } from './examples';
import { directives } from './directives';

export const sidebar = {
  '/guide': [
    {
      text: 'Developer Guide',
      items: enGuides,
    },
  ],
  '/components': enComponents,
  '/directives': directives,
  '/examples': enExamples,
  '/theming': enTheme,
};
