import antfu from '@antfu/eslint-config';

const codeExtensions = ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs'];

export default antfu(
  {
    perfectionist: true,
    import: true,
    vue: {
      overrides: {
        'style/indent': 'off',
        'vue/html-indent': ['error', 2, {
          alignAttributesVertically: false,
        }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/script-indent': ['error', 2, {
          baseIndent: 1,
          switchCase: 1,
        }],
      },
    },
    typescript: {
      overrides: {
        'ts/no-shadow': 'warn',
        'ts/no-explicit-any': 'off',
        'ts/ban-ts-comment': 'off',
        'ts/camelcase': 'off',
        'ts/no-empty-function': 'off',
        'ts/no-unused-vars': 'off', // https://stackoverflow.com/a/63767419
        'ts/no-var-requires': 'off',
      },
    },
    ignores: ['node_modules', 'reports', 'coverage', 'dist', '**/tsconfig.json'],
    formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
      // css: true,
      html: true,
      markdown: 'prettier',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/attributes-order': ['error', {
        order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', ['UNIQUE', 'SLOT'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'],
        alphabetical: false,
      }],
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
      // 'curly': ['error', 'multi-line', 'consistent'], // temporary workaround of the issue with indent in <script>
      'style/semi': ['error', 'always'],
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'unused-imports/no-unused-imports': 0,
    },
  },
);
