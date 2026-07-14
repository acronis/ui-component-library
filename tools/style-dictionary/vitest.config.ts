import { createRequire } from 'node:module';

import { configDefaults, defineConfig } from 'vitest/config';

// The asset-pipeline tests (`src/assets/**`) need `@constructor-lab/design-assets`, an
// optional peer that may be absent from the workspace. When it can't be resolved,
// exclude those tests so the token suite still runs green. The token build/tests
// never touch design-assets.
const require = createRequire(import.meta.url);
const designAssetsAvailable = (() => {
  try {
    require.resolve('@constructor-lab/design-assets/package.json');
    return true;
  } catch {
    return false;
  }
})();

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      ...(designAssetsAvailable ? [] : ['src/assets/**']),
    ],
  },
});
