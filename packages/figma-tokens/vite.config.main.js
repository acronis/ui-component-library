import {
  getViteConfig,
  resolve,
} from './tools/vite.config';

/**
 * Returns config for plugin "main" building
 *
 * @type {import('vite').UserConfigFnObject}
 */
export default getViteConfig({
  main: resolve('src/main.ts'),
});
