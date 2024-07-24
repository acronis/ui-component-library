module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    expect: true,
    page: true,
    browser: true,
    vi: true
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'eslint-plugin-import',
    'vue',
  ],
  rules: {
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        ts: 'never',
        js: 'never',
        'd.ts': 'always',
        vue: 'always'
      }
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1
      }
    ],
    semi: [
      'error',
      'always'
    ],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    indent: 'off',
    'vue/no-v-html': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'vue/comma-dangle': 'off',
  }
}
