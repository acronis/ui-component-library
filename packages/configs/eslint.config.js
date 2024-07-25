import antfu from '@antfu/eslint-config';

const codeExtensions = ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs'];

export default antfu(
  {
    stylistic: true,
    perfectionist: true,
    import: true,
    typescript: true,
    vue: true,
    ignores: ['node_modules', 'reports', 'coverage', 'dist', '**/tsconfig.json'],
    formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
      // css: true,
      html: true,
      markdown: 'prettier',
    }
  },
  {
    files: ['**/*.vue'],
    rules: {
      'style/indent': 'off',
      'vue/html-indent': ['error', 2, {
        alignAttributesVertically: false,
      }],
      'vue/operator-linebreak': ['error', 'before'],
      'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
      'vue/max-attributes-per-line': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/attributes-order': 'error',
      'vue/mustache-interpolation-spacing': 'error',
    },
  },
  {
    files: ['**/*.vue', ...codeExtensions],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration > TSEnumMember > Literal',
          message: 'Use a string union type instead.',
        },
        {
          selector: 'TSEnumDeclaration',
          message: 'Verify enums don\'t contain StringLiteral values',
        },
      ],
      'style/comma-dangle': 'off',
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: [
            '**/bin/**',
            '**/.docgen/**',
            '**/.vitepress/**',
            '**/*.stories.*',
            '**/*.spec.*',
            '**/*.test.js',
            '**/*.test.ts',
            'svgo.config.ts',
            'vite.demo.config.ts',
            'vite.config.ts',
          ],
          optionalDependencies: true,
          peerDependencies: true,
          packageDir: './',
        },
      ],
      // TODO: remove this rule
      'no-console': 'off',
      'no-else-return': ['error', { allowElseIf: true }],
      'no-restricted-globals': [2, 'event'],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false, // allow: const bar = array[0]
            object: true, // disallow: const bar = array.bar
          },
          AssignmentExpression: {
            array: false, // allow: bar = array[0]
            object: false, // allow: bar = array.bar
          },
        },
        {
          enforceForRenamedProperties: false, // allow bar = foo.baz
        },
      ],
      'style/semi': ['error', 'always'],
      // 'import/order': 'off', // handled by perfectionist
      // 'sort-imports': 'off', // handled by perfectionist
      // 'perfectionist/sort-imports': 'error',
      // 'perfectionist/sort-named-imports': 'error',
      // 'perfectionist/sort-exports': 'error',
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'unused-imports/no-unused-imports': 0,
    }
  }
);
