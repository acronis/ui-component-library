import { version } from '../../../ui/package.json';
import { components } from './components';
import { enExamples } from './examples';
import { enGuides } from './guides';
import { styleguide } from './styleguide.ts';
import { enTheme } from './theme';

// eslint-disable-next-line node/prefer-global/process
const isProd = process.env.NODE_ENV === 'production';

export const nav = [
  { text: 'Guide', items: [...enGuides, ...styleguide] },
  { text: 'Components', items: components },
  { text: 'Theme', items: enTheme },
  { text: 'Examples', items: enExamples, devOnly: true },
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
].filter(c => (isProd && !c.devOnly) || !isProd);
