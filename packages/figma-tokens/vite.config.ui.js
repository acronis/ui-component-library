import {
  getViteConfig,
  resolve,
} from './tools/vite.config';

/**
 * Returns config for plugin "ui" building
 *
 * @type {import('vite').UserConfigFnObject}
 */
export default getViteConfig({
  ui: resolve('src/ui.html'),
});
