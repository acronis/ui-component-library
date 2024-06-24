const singleDigitNumbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const sizesMatches = {
  1: 'Variant',
  8: 'ExtraSmall',
  16: 'Small',
  24: 'Medium',
  32: 'Large',
  48: 'ExtraLarge',
  72: 'ExtraExtraLarge',
  96: 'ExtraExtraExtraLarge',
  365: 'XXX',
};

export function renameNumbers(fileName: string) {
  return fileName
    // Replace sizes with their names
    .replace(/\d{1,3}$/g, match => ((sizesMatches as any)[match] || match))
    // Split digits from letters and add underscore between them
    // .replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])|^(\d)/g, '$1$3_$2$4$5')
    // Replace digits at the beginning of the string with their names
    .replace(/^\d/g, match => (singleDigitNumbers as any)[match] || match)
    // Replace all digits with their names
    // .replace(/\d/g, match => (singleDigitNumbers as any)[match] || match)
    .replace(/(^.)|(_)(.)/g, (_, p1, _p2, p3) => (p1 || p3).toUpperCase());
}
