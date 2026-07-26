import { t } from '@/locale';

// TODO: Eventually use Intl
function toLocaleFixed(value, digits, lang) {
  return value.toFixed(digits).replace('.', t('.', lang));
}

export default function prettySize(size, options = {
  allowFloat: false,
  bits: false,
  isFixed: false,
  precision: 0,
  locale: 'en-US'
}) {
  const defaultOptions = {
    isFixed: false,
    precision: 3,
    locale: 'en-US',
    allowFloat: false,
    bits: false
  };

  options = { ...defaultOptions, ...options };

  if (arguments.length < 1) {
    throw new Error('Missing arguments');
  }
  if (typeof size !== 'number' || Number.isNaN(size) || !Number.isFinite(size)) {
    throw new TypeError('Not a number');
  }
  if (size < 0) {
    throw new Error('Not a positive number');
  }
  if (!options.allowFloat && !Number.isInteger(size)) {
    throw new Error('Not an integer');
  }

  let SIZES, checkSize;
  if (options.bits) {
    SIZES = ['Bits_plural', 'KBits', 'MBits', 'GBits', 'TBits', 'PBits', 'EBits'];
    checkSize = 1000;
  }
  else {
    SIZES = ['Bytes_plural', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    checkSize = 1024;
  }
  let digits = options.isFixed ? options.precision : 0;

  let result = t('<value> <size>', options.locale);

  const _index = (Math.log(size) / Math.log(checkSize)) | 0;
  // Byte cannot be divided further, so no fractional part required
  digits = _index ? digits : 0;
  const fixedValue = toLocaleFixed(size / checkSize ** _index || 0, digits, options.locale);
  const fixedSize = SIZES[_index] || SIZES[0];

  result = result.replace('<value>', fixedValue);
  result = result.replace('<size>', t(fixedSize, options.locale, size));

  return result;
}
