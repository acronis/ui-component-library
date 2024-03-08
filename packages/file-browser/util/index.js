// Below works on Chrome but does not work on Safari
// /^[a-zA-Z]:\\(((?![<>:"/\\|?{0,500}]).){1,500}((?<![ .])\\)?){0,500}$/
// AUK-5819 removed '<' in lookbehind for safari https://caniuse.com/js-regexp-lookbehind
export const localFolderPathRegex = /^[a-zA-Z]:\\(((?![<>:"/\\|?{0,500}]).){1,500}((?![ .])\\)?){0,500}$/;

export const FileFilters = {
  all: 'all',
  directory: 'directory',
  file: 'file'
};

export const FileActions = {
  Create: 'create',
  Rename: 'rename',
  Delete: 'delete'
};

export const FileType = {
  removableDrive: 'removableDrive',
  fixedDrive: 'fixedDrive',
  cdromDrive: 'cdromDrive',
  directory: 'directory',
  junction: 'junction',
  regular: 'regular',
  none: 'none'
};

export const fileTypeIconMapper = (fileType) => {
  switch (fileType) {
    case FileType.removableDrive:
    case FileType.fixedDrive:
    case FileType.cdromDrive:
      return 'i-hdd--16';
    case FileType.directory:
    case FileType.junction:
      return 'i-folder--16';
    case FileType.regular:
      return 'i-file--16';
    default:
      return 'i-folder-o--16';
  }
};

export const fileSize = (value, minMeasure) => {
  let bytes = value;

  const names = [
    'global.unit.bytes',
    'global.unit.kb',
    'global.unit.mb',
    'global.unit.gb',
    'global.unit.tb',
    'global.unit.pb',
    'global.unit.eb',
    'global.unit.zb',
    'global.unit.yb'
  ];
  const withMinus = bytes < 0;
  const minusChar = withMinus ? '-' : '';
  const bytesInKilobyte = 1024;
  const minPow = minMeasure ? Math.max(names.indexOf(minMeasure), 0) : 0;
  let precision = 3;
  let pow;
  let num;
  let suffix = '';

  if (withMinus) {
    bytes = -bytes;
  }

  pow = Math.max(Math.floor(Math.log(Math.abs(bytes)) / (Math.log(bytesInKilobyte)) || 0), 0);
  pow = Math.max(pow, minPow);
  num = bytes / (bytesInKilobyte ** pow);
  if (num > 999) { // displaying 0.98 GB instead of 1000 MB
    num /= bytesInKilobyte;
    pow++;
    precision--;
  }
  if (pow > 1) { // MB or bigger
    num = num.toPrecision(precision);
  } else { // bytes and KB
    num = Math.round(num);
  }
  suffix = names[pow];

  return {
    value: `${minusChar}${num}`,
    measureUnit: suffix
  };
};

export const fileSizeTranslatorService = (tt) => {
  const unitMapping = {
    'global.unit.bytes': tt('el.filebrowser.unit.bytes'),
    'global.unit.kb': tt('el.filebrowser.unit.kb'),
    'global.unit.mb': tt('el.filebrowser.unit.mb'),
    'global.unit.gb': tt('el.filebrowser.unit.gb'),
    'global.unit.tb': tt('el.filebrowser.unit.tb'),
    'global.unit.pb': tt('el.filebrowser.unit.pb'),
    'global.unit.eb': tt('el.filebrowser.unit.eb'),
    'global.unit.zb': tt('el.filebrowser.unit.zb'),
    'global.unit.yb': tt('el.filebrowser.unit.yb')
  };

  function getTranslateFileSize(
    size,
    minMeasure = 'global.unit.bytes',
    convertZeroSizeToText = false,
    includeTotal = false,
    totalSize = 0,
    convertedValueForZeroSize = '––'
  ) {
    if (convertZeroSizeToText && size === 0) {
      return convertedValueForZeroSize;
    }

    const measure = fileSize(size, minMeasure);
    const totalMeasure = fileSize(totalSize, minMeasure);
    const suffix = unitMapping[measure.measureUnit]?.toString() || measure.measureUnit;

    return includeTotal
      ? `${measure.value} ${suffix} used of ${totalMeasure.value} ${suffix}`
      : `${measure.value} ${suffix}`;
  }

  return getTranslateFileSize;
};

export const replaceLast = (text, find, replace) => {
  const index = text.lastIndexOf(find);

  if (index >= 0) {
    return text.substring(0, index) + replace + text.substring(index + find.length);
  }

  return text;
};

export const replaceKeys = (sourceKeys, oldKey, newKey) => {
  return sourceKeys.reduce((replacedKeys, sourceKey) => {
    if (sourceKey.startsWith(oldKey)) {
      return replacedKeys.concat(sourceKey.replace(oldKey, newKey));
    }
    return replacedKeys.concat(sourceKey);
  }, []);
};

export function expandNode(node) {
  return new Promise((resolve) => {
    node.expand(() => resolve());
  });
}

export const trimEndsPathSeparators = (path) => {
  return path.replace(/(^[\\/]{1})|([\\/]{1}$)/g, '');
};
