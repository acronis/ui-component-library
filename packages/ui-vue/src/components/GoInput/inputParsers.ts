export type InputParser = (value: string, selection: number) => InputParserResult;

export interface InputParserResult {
  value: string // result value
  selection: number // new caret position. When selection - first part of selection
}

/**
 * Call parsers functions in sequence.
 * Each function can modify the value and must handle caret position after modification
 */
export function parse(parsers: InputParser[], value: string, selection = 0): InputParserResult {
  return parsers.reduce(
    (result: InputParserResult, parser: InputParser) => parser(result.value, result.selection),
    { value, selection } as InputParserResult,
  );
}

/**
 * Create parser result. Parsers are needed to modify input when user is typing.
 * For example use the numberParser to restrict an input for 0-9 symbols only
 *
 * @param newValue value after parser run
 * @param prevSelectionEnd caret position before parser run
 * @param countRemoved count removed symbols BEFORE prevSelectionEnd after parser run
 */
export function getParseResult(
  newValue: string,
  prevSelectionEnd: number,
  countRemoved: number,
): InputParserResult {
  return {
    selection: prevSelectionEnd - countRemoved,
    value: newValue,
  };
}

/**
 * Cuts symbols above maxLength
 * It must be last because it cuts symbols from the end
 */
export function maxLengthParser(maxLength: number): InputParser {
  return (value: string, selection: number) => {
    return getParseResult(value.substring(0, maxLength), selection, 0);
  };
}

/**
 * Change all symbols to uppercase
 */
export function upperCaseParser(): InputParser {
  return (value: string, selection: number) => {
    return getParseResult(value.toUpperCase(), selection, 0);
  };
}

/**
 * Remove symbols that fit notAllowed RegExp
 */
export function notAllowedParser(notAllowed: RegExp): InputParser {
  return (value: string, selection: number) => {
    const newValue = value.replace(notAllowed, '');

    return getParseResult(newValue, selection, value.length - newValue.length);
  };
}

/**
 * Remove all symbols except numbers
 */
export function numberParser(): InputParser {
  return notAllowedParser(/\D/g);
}

/**
 * Parser for urls
 */
export function slugParser(): InputParser {
  return (value: string, selection: number) => {
    const newValue = value.replace(/ /g, '-').toLowerCase();

    return getParseResult(newValue, selection, value.length - newValue.length);
  };
}

/**
 * Parser for email lists.
 */
export function emailListParser(): InputParser {
  return (value: string, selection: number) => {
    const newValue = value.replace(/[,;|\s]+/g, ',');
    return getParseResult(newValue, selection, value.length - newValue.length);
  };
}
