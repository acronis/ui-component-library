const { resolve } = require('node:path');

module.exports = {
  root: true,
  extends: [
    '@acronis-platform/configs/.stylelintrc.cjs',
  ],
  rules: {
    'csstools/value-no-unknown-custom-properties': [null, {
      importFrom: [
        resolve(__dirname, 'src/styles/variables/fonts.css'),
        resolve(__dirname, 'src/styles/variables/palette.css'),
        resolve(__dirname, 'src/styles/variables/dimension.css'),
        resolve(__dirname, 'src/styles/variables/borders.css'),
        resolve(__dirname, 'src/styles/variables/spacing.css'),
        resolve(__dirname, 'src/styles/variables/schemes.css'),
        resolve(__dirname, 'src/styles/variables/typography.css'),
        resolve(__dirname, 'src/styles/variables/typography.css'),
        resolve(__dirname, 'src/styles/themes/acronis-light.pcss'), // TODO: pcss not work
        resolve(__dirname, 'src/components/Link/link.css'),
        resolve(__dirname, 'src/components/loader/loader.css'),
        resolve(__dirname, 'src/components/button/button.css'),
        resolve(__dirname, 'src/components/table/table.css'),
        resolve(__dirname, 'src/components/alert/alert.css'),
        resolve(__dirname, 'src/components/card/card.css'),
        resolve(__dirname, 'src/components/markup-table/markupTable.css'),
      ],
      resolver: {
        extensions: ['.css'], // => default to ['.css']
        paths: ['./src/styles/variables', './static/css'], // => paths to look for files, default to []
        moduleDirectories: ['src/components'] // => modules folder to look for files, default to ['node_modules']
      }
    }]
  },
  ignoreFiles: ['dist/**/*', 'tests/unit/coverage/**/*'],
};
