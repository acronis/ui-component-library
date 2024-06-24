// eslint-disable-next-line import/no-extraneous-dependencies
const componentsPrefix = require('config').get('prefix');

const toKebabCase = str => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());

// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'Components must have a name.';
      }

      const fileName = toKebabCase(value);
      if (!fileName.includes('-')) {
        return 'Component names should contain at least two words to avoid conflicts with existing and future HTML elements.';
      }

      if (
        value.slice(0, componentsPrefix.length).toLowerCase()
        !== componentsPrefix
      ) {
        return `Wrong prefix, must be '${componentsPrefix}'`;
      }

      return true;
    }
  }
];
