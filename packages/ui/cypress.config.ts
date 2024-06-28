import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on: unknown) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(<Cypress.PluginEvents>on);
    },
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: false,
    viewportHeight: 768,
    viewportWidth: 1024,
    setupNodeEvents(on: unknown) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(<Cypress.PluginEvents>on);
    },
  },
});
