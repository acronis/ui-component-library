import { version } from '../../../ui/package.json';
import { enComponents } from './components';
import { enExamples } from './examples';
import { enTheme } from './theme';
import { enGuides } from './guides';
import { styleguide } from './styleguide.ts';

export const nav = [
  { text: 'Guide', items: [...enGuides, ...styleguide] },
  { text: 'Components', items: enComponents },
  { text: 'Theme', items: enTheme },
  { text: 'Examples', items: enExamples },
  {
    text: `v${version}`,
    items: [
      {
        text: 'Changelog',
        link: 'CHANGELOG'
      },
      {
        text: 'Contributing',
        link: 'CONTRIBUTING'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/acronis/ui-component-library/releases',
      },
    ]
  }
];
