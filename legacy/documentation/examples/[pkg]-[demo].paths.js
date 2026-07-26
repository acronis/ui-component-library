import path from 'node:path';
import { getExampleDemos, getExampleDomains } from '../.vitepress/utils.js';

// eslint-disable-next-line node/prefer-global/process
const isProd = process.env.NODE_ENV === 'production';

export default {
  async paths() {
    if (isProd) {
      return [];
    }

    const pages = getExampleDomains();

    const paths = pages.reduce((res, page) => {
      if (page === '.DS_Store')
        return res;

      const demos = (page !== '.DS_Store')
        ? getExampleDemos(page)
        : [];

      const demoPages = demos.map(demo => ({
        pkg: page,
        demo,
        filePath: path.join(__dirname, '../examples/demos', page, demo),
      }));

      res.push(demoPages);

      return res;
    }, []);

    const demoPages = paths?.flat() || [];

    return demoPages
      .map(({ pkg, demo }) => {
        return {
          params: {
            name: path.parse(demo).name,
            pkg,
            demo
          },
          content: `<${path.parse(demo).name} />`,
        };
      });
  }
};
