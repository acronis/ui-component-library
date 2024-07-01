const componentsPrefix = require('config').get('prefix');

module.exports = {
  helpers: {
    prefix: () => componentsPrefix,
    pascalPrefix: () => componentsPrefix[0].toUpperCase() + componentsPrefix.slice(1)
  }
};
