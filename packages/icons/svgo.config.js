import addViewBox from 'svgo-add-viewbox';

export default {
  multipass: true,
  mergePaths: false,
  js2svg: {
    indent: 2,
    pretty: true
  },
  plugins: [
    // set of built-in plugins enabled by default
    {
      name: 'preset-default',
      params: {
        overrides: {
          // viewBox is required to resize SVGs with CSS.
          // @see https://github.com/svg/svgo/issues/1128
          removeViewBox: false
        }
      }
    },
    'collapseGroups',
    'convertShapeToPath',
    'moveElemsAttrsToGroup',

    // enable built-in plugins by name
    'prefixIds',

    'removeDimensions',

    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            preserveAspectRatio: 'xMidYMid meet',
          },
        ],
      }
    },

    // or by expanded notation which allows to configure plugin
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical'
      }
    },

    {
      name: 'removeAttrs',
      params: {
        attrs: [
          // 'path:fill',
          'path:fill-rule'
        ],
        elemSeparator: ':',
        preserveCurrentColor: false
      }
    },

    {
      name: 'addAttributesToSVGElement',
      params: {
        attribute: {
          fill: 'currentColor'
        }
      }
    },
    {
      ...addViewBox,
      params: {
        overwrite: false
      }
    }
  ]
};
