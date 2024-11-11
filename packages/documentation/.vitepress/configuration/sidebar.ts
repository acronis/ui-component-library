import { components } from './components';
import { composables } from './composables';
import { directives } from './directives';
import { examples } from './examples';
import { enGuides } from './guides';
import { styleguide } from './styleguide.ts';
import { theme } from './theme';

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
  '/examples': examples,
  '/theming': theme,
};
