import { globSync } from 'glob';
import { getExampleDomains } from '../.vitepress/utils';

export default {
  async paths() {
    const pages = getExampleDomains();

    return pages
      .map((pkg = 'test') => {
        const demos = pkg !== '.DS_Store'
          ? globSync(`../examples/demos/${pkg}/**/*.vue`)
          : [];

        return {
          params: {
            pkg,
            demos
          }
        };
      });
  }
};
