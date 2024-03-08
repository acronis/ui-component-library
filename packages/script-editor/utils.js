import isAbsoluteUrl from '@/utils/is-absolute-url';

const getMonacoAssets = (assetsPath) => {
  const isURL = isAbsoluteUrl(assetsPath);
  const mainPath = isURL ? assetsPath : `${window.location.origin}${assetsPath}`;
  const srcPath = `${mainPath}/min`;
  const vsPath = `${srcPath}/vs`;
  return {
    srcPath,
    vsPath,
    loader: `${vsPath}/loader.js`,
    worker: `${vsPath}/base/worker/workerMain.js`
  };
};

export {
  getMonacoAssets
};
