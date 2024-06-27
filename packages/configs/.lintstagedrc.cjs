module.exports = {
  '*.{vue,ts,mts,cts,js,mjs,cjs}': ['eslint --fix'],
  '*.vue': ['stylelint --fix'],
  '*.css': ['prettier --write', 'stylelint --fix --globby-options \'{\"dot\":true}\''],
  '*.{html,yml,yaml,json}': ['prettier --write'],
};
