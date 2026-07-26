import { hasOwn } from '@/utils/util.ts';

const RE_NARGS = /(%?)\{(\w+)\}/g;
/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */
export default function () {
  /**
   * template
   *
   * @param {string} string
   * @param {...*} args
   * @return {string}
   */
  function template(string, ...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0];
    }

    if (!args || !args.hasOwnProperty) {
      args = [];
    }

    return string.replace(RE_NARGS, (match, _prefix, i, index) => {
      if (string[index - 1] === '{'
        && string[index + match.length] === '}') {
        return i;
      }
      const result = hasOwn(args, i) ? args[i] : null;

      if (result === null || result === undefined) {
        return '';
      }

      return result;
    });
  }

  return template;
}
