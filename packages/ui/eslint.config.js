import config from '@acronis-platform/configs/eslint.config.js';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';
import pluginCypress from 'eslint-plugin-cypress/flat';

export default config.append(
  pluginVueA11y.configs['flat/recommended'],
  pluginCypress.configs.recommended,
  {
    rules: {
      'vuejs-accessibility/label-has-for': 'off',
      'vuejs-accessibility/form-control-has-label': 'off',
      'vuejs-accessibility/no-static-element-interactions': 'off',
      'vuejs-accessibility/mouse-events-have-key-events': 'off',
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/interactive-supports-focus': 'warn'
    }
  }
);
