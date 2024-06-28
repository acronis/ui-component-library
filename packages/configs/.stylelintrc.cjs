module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    // 'stylelint-prettier/recommended',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-declaration-strict-value',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-color-format',
    'stylelint-high-performance-animation',
    'stylelint-no-indistinguishable-colors',
    'stylelint-selector-tag-no-without-class',
    'stylelint-value-no-unknown-custom-properties'
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        ignoreAtRules: ['mixin', 'import', 'else'],
        except: [
          'blockless-after-same-name-blockless',
          'first-nested',
        ],
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['at-root', 'function', 'if', 'use', 'each', 'include', 'mixin', 'return', 'define-mixin'],
      },
    ],
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['/grid/', '/flex/']
      }
    ],
    'length-zero-no-unit': [
      true, // write zero numbers without unit
      {
        ignore: ['custom-properties'],
      },
    ],
    'max-nesting-depth': [
      3, // max nesting depth -3, without pseudo-classes and mixins
      {
        ignore: ['pseudo-classes'],
        ignoreAtRules: ['mixin', 'keyframes'],
      },
    ],
    'order/order': [
      [
        'custom-properties',
        'dollar-variables',
        {
          type: 'at-rule',
          name: 'extend',
        },
        {
          type: 'at-rule',
          name: 'include',
          hasBlock: false,
        },
        'declarations',
        {
          type: 'at-rule',
          name: 'include',
          hasBlock: true,
        },
        'rules',
        'at-rules',
      ],
    ],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
      },
    ],
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'z-index', 'font-size', 'font-family'],
      {
        disableFix: true,
        ignoreKeywords: {
          '': ['inherit'],
          '/color/': ['currentColor', 'transparent', 'inherit'],
        },
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep']
      }
    ],

    'alpha-value-notation': 'number', // prefer 0.5 over 50% (eg. rgba(0, 0, 0, 0.5))
    'at-rule-no-vendor-prefix': true,
    'color-format/format': { format: 'hsl' },
    'color-function-notation': 'legacy', // legacy color notation (eg. use rgb(0, 0, 0) over rgb(0 0 0))
    'color-no-hex': true, // allow hex colors
    'color-hex-length': 'short', // prefer #fff over #ffffff
    'color-named': 'never',
    'comment-whitespace-inside': 'always', // always add whitespaces inside comment start/end (eg. /* whitespace before start and end of this comment */)
    'custom-property-empty-line-before': ['never'],
    'custom-property-pattern': null,
    'declaration-empty-line-before': ['never'],
    'font-family-name-quotes': 'always-unless-keyword', // expect quotes around every font family name that is not a keyword (eg. sans-serif).
    'font-weight-notation': 'numeric',
    'function-url-no-scheme-relative': true, // use explicit https
    'function-url-quotes': 'always',
    'import-notation': 'string', // @import url() notation without quotes in path
    'media-feature-name-no-unknown': true,
    'media-feature-name-no-vendor-prefix': true,
    'no-descending-specificity': null,
    'no-empty-source': null, // allow empty style tag
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-low-performance-animation-properties': null,
    'plugin/selector-tag-no-without-class': ['div'],
    'plugin/stylelint-no-indistinguishable-colors': true,
    'property-no-unknown': null,
    'property-no-vendor-prefix': true,
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': null, // for now don't strict class naming style
    'selector-max-compound-selectors': 5,
    'selector-max-specificity': '1,3,3', // id,class,type
    'selector-max-universal': 1,
    'selector-no-vendor-prefix': true,
    'selector-not-notation': 'complex', // prefer :not(a, div) {} over :not(a):not(div) {}
    'selector-pseudo-element-colon-notation': 'single', // prefer :before over ::before
    'shorthand-property-no-redundant-values': true, // eg. use 0 instead of 0px
    'value-keyword-case': null, // case for css keyword values, for now it's not specified
    'value-no-vendor-prefix': true,
  },
};
