import path from 'node:path';
import { optimize } from 'svgo';
import { escapeRegExp, removeFromName, toPascalCase } from './helpers.js';

/**
 * Asynchronously downloads an image from a given URL and saves it to a specified directory.
 * The directory is determined by the `name` parameter and the `exportIconConfig.iconsPath` configuration.
 * If the `name` contains slashes, it is treated as a path and the image is saved in a subdirectory.
 * The function creates the necessary directories if they do not exist.
 *
 * @async
 * @param {object} config
 * @param {object} icon
 * @throws Will throw an error if the image download fails.
 */
export async function downloadImage(config, icon) {
  const url = icon.image;
  const pathname = removeFromName(icon.name, config.removeFromName);
  const basename = path.basename(pathname);
  const cleanName = toPascalCase(basename);

  try {
    const isContinue = config.onBeforeDownloadIcon(basename);

    if (isContinue === false) {
      return;
    }

    const response = await fetch(url);
    const svgText = await response.text();
    const optimizedSvg = optimize(svgText, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // viewBox is required to resize SVGs with CSS.
              // @see https://github.com/svg/svgo/issues/1128
              removeViewBox: false,
              // keep precision higher for cleaner diagonals
              cleanupNumericValues: { floatPrecision: 4 },
              convertPathData: { floatPrecision: 4 }
            }
          }
        },
        'removeDimensions',
        {
          name: 'prefixIds',
          params: {
            delim: ':',
            prefix: cleanName,
          },
        },
        {
          name: 'addClassesToSVGElement',
          params: {
            classNames: [config.className],
          },
        },
      ],
    });
    const systemColorRegex = new RegExp(escapeRegExp(config.systemColor), 'gi');
    const content = optimizedSvg.data.replace(systemColorRegex, 'currentColor');

    await config.onDownloadedIcon({ content, pathname, cleanName, publicFolder: config.publicFolder, vueFolder: config.vueFolder });
  }
  catch (err) {
    throw new Error(`Failed to download Icon with name -> ${pathname}, and Id -> ${icon.id}`, { cause: err });
  }
}
