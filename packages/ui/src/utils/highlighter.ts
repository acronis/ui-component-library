class Highlighter {
  tags: string[] | string;

  /**
   * @param {string[]|string} tags if string, pass class name
   */
  constructor(tags: string[] | string) {
    this.tags = tags;
  }

  /**
   * @param {string} text
   * @param {string} value
   */
  highlight(text, value) {
    if (!text || !value) {
      return text ? [{ value: text }] : text;
    }

    const lowerText = text.toLowerCase();
    const lowerValue = value.toLowerCase();
    let index = lowerText.indexOf(lowerValue);
    const subString = text.substring(index, index + value.length);

    if (Array.isArray(this.tags)) {
      return index >= 0 ? text.replace(subString, `${this.tags[0]}${subString}${this.tags[1]}`) : text;
    }

    let startIndex = 0;
    const highlightXssSafeArr: any[] = [];
    while (index > -1) {
      if (index > startIndex) {
        highlightXssSafeArr.push({ value: text.substring(startIndex, index) });
      }
      startIndex = index + value.length;
      highlightXssSafeArr.push({ value: text.substring(index, startIndex), className: this.tags });
      index = lowerText.indexOf(lowerValue, startIndex);
    }
    if (text.length > startIndex) {
      highlightXssSafeArr.push({ value: text.substring(startIndex, text.length) });
    }
    return highlightXssSafeArr;

    return text;
  }
}

const highlighter = new Highlighter(['<span class="acv-text--highlighting">', '</span>']);
const xssSafeHighlighter = new Highlighter('acv-text--highlighting');

export default Highlighter;
export { highlighter, xssSafeHighlighter };
