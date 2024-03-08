import { hasOwn } from '@/utils/util';

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;
/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
export default function () {
  /**
   * template
   *
   * @param {String} string
   * @param {...*} args
   * @return {String}
   */
  function template(string, ...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0]; // eslint-disable-line prefer-destructuring, no-param-reassign
    }

    /* istanbul ignore if */
    if (!args || !args.hasOwnProperty) {
      args = {}; // eslint-disable-line no-param-reassign
    }

    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      /* istanbul ignore if */
      if (string[index - 1] === '{'
        && string[index + match.length] === '}') {
        return i;
      }
      const result = hasOwn(args, i) ? args[i] : null;
      /* istanbul ignore if */
      if (result === null || result === undefined) {
        return '';
      }

      return result;
    });
  }

  return template;
}
