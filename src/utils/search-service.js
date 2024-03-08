import { highlighter } from './highlighter';

class SearchService {
  /**
   * @param {Highlighter} highlighter
   */
  constructor(customHighlighter) {
    this.highlighter = customHighlighter || highlighter;
  }

  /**
   * @param {Object[]} data
   * @param {string} key
   * @param {string} value
   */
  search(data, key, value) {
    return value
      ? data
        .filter((item) => item[key].toLowerCase().indexOf(value.toLowerCase()) >= 0)
        .map((item) => ({ ...item, [key]: this.highlighter.highlight(item[key], value) }))
      : [];
  }

  /**
   * @param {Object[]} _data
   * @param {string} _key
   * @param {string} _value
   */
  highlight(_data, _key, _value) {

  }
}

export default SearchService;
