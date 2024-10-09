import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';
import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1000,
  viewportHeight: 600,
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on: unknown) {
      // implement node event listeners here
      addMatchImageSnapshotPlugin(<Cypress.PluginEvents>on);
    },
    excludeSpecPattern: [
      '**/__snapshots__/*',
      '**/__image_snapshots__/*'
    ]
  }
});
