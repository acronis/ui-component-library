// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintReact from '@eslint-react/eslint-plugin';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

import acronisPatterns from './tools/eslint-rules/index.js';

export default tseslint.config(
  // Base ESLint recommended rules
  js.configs.recommended, // TypeScript ESLint recommended rules
  ...tseslint.configs.recommended, // Vue 3 recommended rules
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '**/.storybook/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'vite.config.*.ts',
      '**/next-env.d.ts',
      // Next.js build output and Fumadocs generated source (apps/docs).
      '**/.next/**',
      '**/.source/**',
      // Generated, committed token artifacts (built by tools/style-dictionary).
      'packages/tokens/**',
    ],
  }, // General configuration for all files
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  }, // TypeScript files - additional rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowObjectTypes: 'always',
        },
      ],
    },
  },
  // React — @eslint-react. Replaces eslint-plugin-react, whose latest (7.37.5)
  // uses APIs removed in ESLint 10 (`context.getFilename`) and has no v10 release,
  // which was pinning eslint to 9.x. `recommended-typescript` is @eslint-react's
  // modern React rule set for TS projects (no type-checking required).
  {
    ...eslintReact.configs['recommended-typescript'],
    files: ['**/*.jsx', '**/*.tsx'],
  },
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // react-hooks 7's full recommended set — the React Compiler rules (refs,
      // purity, immutability, set-state-in-render, static-components, use-memo, …).
      // The codebase already complies with 14 of the 17; two are overridden below.
      ...pluginReactHooks.configs['recommended-latest'].rules,
      // `set-state-in-effect` is owned by @eslint-react (adopted with per-site
      // justifications); turn off the react-hooks duplicate to avoid double-reports.
      'react-hooks/set-state-in-effect': 'off',
      // Advisory "React Compiler will skip memoizing this" (TanStack Table/Virtual).
      // Informational, not a defect — and this repo doesn't run the React Compiler.
      'react-hooks/incompatible-library': 'off',

      // @eslint-react's recommended-typescript rules are adopted as-is, with three
      // deliberate exceptions (the code is compliant with the rest):
      '@eslint-react/no-forward-ref': 'off', // ui-react deliberately uses React.forwardRef
      '@eslint-react/rules-of-hooks': 'off', // covered by react-hooks/rules-of-hooks
      '@eslint-react/exhaustive-deps': 'off', // covered by react-hooks/exhaustive-deps
    },
  },
  storybook.configs['flat/recommended'],
  // Usage-pattern enforcement (local plugin). Scoped to application code, where
  // ad-hoc compositions tend to creep in; the library + its demos compose the
  // real components. Each rule encodes a `ui-spec/patterns/*` anti-pattern.
  {
    files: ['apps/**/*.{jsx,tsx}'],
    plugins: { 'acronis-patterns': acronisPatterns },
    rules: {
      'acronis-patterns/no-adhoc-sheet': 'error',
      // "prefer-*" composite rules are warn-first: they steer toward the
      // opinionated composites without blocking, with the ledger/overrides as
      // the pressure valve (proposal §6).
      'acronis-patterns/prefer-confirm-dialog': 'warn',
      'acronis-patterns/prefer-stat-row': 'warn',
    },
  }
);
