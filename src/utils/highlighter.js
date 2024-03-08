class Highlighter {
  /**
   * @param {string[]|string} tags if string, pass class name
   */
  constructor(tags) {
    this.tags = tags;
  }

  /**
   * @param {string} text
   * @param {string} value
   */
  highlightAsRawHtmlStr(text, value) {
    if (!text || !value) {
      return text;
    }

    const index = text.toLowerCase().indexOf(value.toLowerCase());
    const subString = text.substr(index, value.length);

    return index >= 0 ? text.replace(subString, `${this.tags[0]}${subString}${this.tags[1]}`) : text;
  }

  highlightAsXssSafeArr(text, value) {
    if (!text || !value) {
      return [{ value: text }];
    }

    let startIndex = 0;
    let index = text.toLowerCase().indexOf(value.toLowerCase());
    const highlightXssSafeArr = [];

    while (index > -1) {
      if (index > startIndex) {
        highlightXssSafeArr.push({ value: text.substring(startIndex, index) });
      }
      startIndex = index + value.length;
      highlightXssSafeArr.push({ value: text.substring(index, startIndex), className: this.tags });
      index = text.toLowerCase().indexOf(value.toLowerCase(), startIndex);
    }
    if (text.length > startIndex) {
      highlightXssSafeArr.push({ value: text.substring(startIndex, text.length) });
    }

    return highlightXssSafeArr;
  }

  highlight(text, value) {
    if (typeof this.tags === 'string') {
      return this.highlightAsXssSafeArr(text, value);
    }
    if (Array.isArray(this.tags)) {
      return this.highlightAsRawHtmlStr(text, value);
    }
    return text;
  }
}


const highlighter = new Highlighter(['<span class="el-text--highlighting">', '</span>']);
const xssSafeHighlighter = new Highlighter('el-text--highlighting');

export default Highlighter;
export { highlighter, xssSafeHighlighter };
