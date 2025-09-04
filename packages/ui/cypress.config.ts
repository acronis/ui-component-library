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
          launchOptions.args.push('--high-dpi-support=1');
          launchOptions.args.push('--force-device-scale-factor=1');
          launchOptions.args.push('--window-size=1000,600');
          // Reduce rendering variance in CI and hide scrollbars
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--hide-scrollbars');
          // Normalize text rendering across OS/arch to reduce AA differences
          launchOptions.args.push('--disable-lcd-text');
          launchOptions.args.push('--font-render-hinting=none');
        }
        // Electron (Cypress default) also uses Chromium under the hood
        if (browser.name === 'electron') {
          launchOptions.args = launchOptions.args || [];
          launchOptions.args.push('--high-dpi-support=1');
          launchOptions.args.push('--force-device-scale-factor=1');
          launchOptions.args.push('--window-size=1000,600');
          launchOptions.args.push('--hide-scrollbars');
          launchOptions.args.push('--disable-lcd-text');
          launchOptions.args.push('--font-render-hinting=none');
        }
        // Firefox: control DPR via devPixelsPerPx preference
        if (browser.name === 'firefox') {
          // Ensure preferences object exists
          (launchOptions).preferences = (launchOptions).preferences || {};
          (launchOptions).preferences['layout.css.devPixelsPerPx'] = '1.0';
          (launchOptions).preferences['browser.tabs.drawInTitlebar'] = true;
          // Window size is controlled by Cypress viewport, but also pass args for completeness
          launchOptions.args = launchOptions.args || [];
          launchOptions.args.push('--width=1000');
          launchOptions.args.push('--height=600');
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
