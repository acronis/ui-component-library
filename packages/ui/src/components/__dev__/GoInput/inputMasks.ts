import type { InputParser } from '@/components/__dev__/GoInput/inputParsers.ts';
import { getParseResult } from '@/components/__dev__/GoInput/inputParsers.ts';

export const MASK_SYMBOL = '*';

export interface Mask {
  mask: string
  allowedSymbols: string
}

export function getInviteCodeMask() {
  return createMask('***-***-***', '\\da-zA-Z');
}

/**
 * @param mask string where * is a mask symbol
 * @param allowedSymbols regex pattern of symbols witch are allowed to be in the mask
 */
export function createMask(mask: string, allowedSymbols: string): Mask {
  return { mask, allowedSymbols };
}

/**
 * Create mask parser
 */
export function getMaskParser(mask: Mask): InputParser {
  return (value: string, selection = 0) => {
    const countRemoved = selection - getValueByMask(value.substring(0, selection), mask).length;

    return getParseResult(getValueByMask(value, mask), selection, countRemoved);
  };
}

export function cleanValueByMask(value: string, mask: Mask) {
  return value.replace(new RegExp(`[^${mask.allowedSymbols}]`, 'g'), '');
}

export function getValueByMask(value: string, mask: Mask) {
  const allowedSymbols = cleanValueByMask(value, mask);
  let counter = 0;
  let skipCounter = 0; // count not-*-symbols passed
  let result = '';

  for (const symbol of mask.mask) {
    const isReplace = symbol === MASK_SYMBOL;

    // don't show right part of mask
    if (allowedSymbols.length <= counter) {
      // if user type symbols that in mask(for example "-") - then type it
      if (!isReplace && symbol === value.charAt(counter + skipCounter)) {
        result += symbol;
        skipCounter++;
        continue;
      }

      break;
    }

    result += isReplace ? allowedSymbols[counter] : symbol;

    isReplace ? counter++ : skipCounter++;
  }

  return result;
}
