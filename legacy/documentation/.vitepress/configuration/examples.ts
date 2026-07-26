import path from 'node:path';
import { getExampleDemos, getExampleDomains } from '../utils.ts';

const pages = getExampleDomains();

// eslint-disable-next-line node/prefer-global/process
const isDev = process.env.NODE_ENV !== 'production';

export const examples = isDev
  ? pages.map((page: string) => ({
    text: page.toUpperCase(),
    link: `/examples/${page}`,
    collapsed: true,
    items: getExampleDemos(page).map(demo => ({
      text: path.parse(demo).name,
      link: `/examples/${page}-${demo}`
    }))
  }))
  : [];
