import { getExampleDemos, getExampleDomains } from '../.vitepress/utils';

// eslint-disable-next-line node/prefer-global/process
const isProd = process.env.NODE_ENV === 'production';

export default {
  async paths() {
    if (isProd) {
      return [];
    }

    const pages = getExampleDomains();

    return pages
      .map((pkg = 'test') => {
        const demos = pkg !== '.DS_Store'
          ? getExampleDemos(pkg)
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
