import path from 'node:path';
import { globSync } from 'glob';
import { getExampleDomains } from '../.vitepress/utils.js';

export default {
  async paths() {
    const pages = getExampleDomains();

    const paths = pages.reduce((res, page) => {
      if (page === '.DS_Store')
        return res;

      const demos = (page !== '.DS_Store')
        ? globSync(`../examples/demos/${page}/**/*.vue`)
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
