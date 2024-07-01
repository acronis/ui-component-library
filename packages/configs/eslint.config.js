import process from 'node:process';
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
      // markdown: 'prettier',
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
      'vue/script-indent': ['error', 2, {
        baseIndent: 1,
        switchCase: 1,
      }],
      'vue/attribute-hyphenation': 'off',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/html-quotes': ['error', 'double'],
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'error',
      'vue/attributes-order': ['error', {
        order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', ['UNIQUE', 'SLOT'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'],
        alphabetical: false,
      }],
      'vue/multiline-html-element-content-newline': ['error', {
        ignores: ['i18n', 'ui-tag'],
      }],
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/order-in-components': ['error', {
        order: ['el', 'name', 'parent', 'functional', ['delimiters', 'comments'], ['components', 'directives', 'filters'], 'extends', 'mixins', 'inheritAttrs', 'model', ['props', 'propsData'], 'data', ['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave'], 'LIFECYCLE_HOOKS', 'computed', 'watch', 'methods', ['template', 'render'], 'renderError'],
      }],
      'vue/prop-name-casing': 'error',
      'vue/require-default-prop': 'off',
      'vue/singleline-html-element-content-newline': 'error',
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
      'class-methods-use-this': 'off',
      'style/comma-dangle': 'off',
      'default-param-last': 'off',
      'func-names': 'off',
      // 'import/extensions': [
      //   'error',
      //   'ignorePackages',
      //   {
      //     '': 'never',
      //     'ts': 'never',
      //     'js': 'always',
      //     'd.ts': 'always',
      //     'vue': 'always',
      //   }
      // ],
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-dynamic-require': 'off',
      'import/no-extraneous-dependencies': [
        'warn',
        {
          devDependencies: [
            '**/*.stories.*',
            '**/*.spec.*',
            '**/*.test.js',
            '**/*.test.ts',
            'vite.config.ts'
          ],
          optionalDependencies: true,
          peerDependencies: true,
          packageDir: './',
        },
      ],
      'import/named': ['error'],
      // TODO: remove this rule
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 'off',
      'no-else-return': ['error', { allowElseIf: true }],
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-restricted-globals': [2, 'event'],
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'object-shorthand': 'off',
      'prefer-arrow-callback': 'off',
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
      'prefer-promise-reject-errors': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],

      'camelcase': 'off',
      'curly': ['error', 'multi-line', 'consistent'], // temporary workaround of the issue with indent in <script>
      'style/semi': ['error', 'always'],
    },
  }
);
