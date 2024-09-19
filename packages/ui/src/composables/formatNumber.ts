export function formatNumber(number: number, options?: Intl.NumberFormatOptions) {
  return getNumberFormatter(options)(number);
}

export function getNumberFormatter(options?: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  });

  return (number: number) => formatter.format(number);
}

export function getTruncatedString(value: number) {
  const format = getNumberFormatter({ useGrouping: false });
  if (value >= 999999) {
    return `${format(value / 1000000)}m`;
  }

  if (value >= 999) {
    return `${format(value / 1000)}k`;
  }

  return format(value);
}
