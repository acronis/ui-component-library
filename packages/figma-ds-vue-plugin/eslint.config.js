import config from '@acronis-platform/configs/eslint.config.js';

export default config.append(
  {
    rules: {
      'vue/no-reserved-component-names': 'off',
    }
  }
);
