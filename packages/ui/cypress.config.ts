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
    setupNodeEvents(on) {
      // implement node event listeners here
      // Normalize Chrome rendering between local and CI to avoid snapshot size drift
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.family === 'chromium') {
          launchOptions.args = launchOptions.args || [];
          // Ensure consistent DPR and window size
          launchOptions.args.push('--force-device-scale-factor=1');
          launchOptions.args.push('--window-size=1000,600');
          // Reduce rendering variance in CI and hide scrollbars
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--hide-scrollbars');
        }
        return launchOptions;
      });

      addMatchImageSnapshotPlugin(on);
    },
    excludeSpecPattern: [
      '**/__snapshots__/*',
      '**/__image_snapshots__/*'
    ]
  }
});
