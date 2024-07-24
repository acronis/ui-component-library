import path from 'node:path';
import { optimize } from 'svgo';
import { removeFromName } from './helpers.js';

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
  const nameClean = path.basename(pathname);

  try {
    const isContinue = config.onBeforeDownloadIcon(nameClean);

    if (isContinue === false) {
      return;
    }

    const response = await fetch(url);
    const content = optimize(await response.text(), {
      plugins: [
        'preset-default',
        'removeDimensions',
        {
          name: 'addClassesToSVGElement',
          params: {
            classNames: ['acv-icon'],
          },
        },
      ],
    }).data.replace(/#181818/g, 'currentColor');

    await config.onDownloadedIcon({ content, pathname, publicFolder: config.publicFolder, vueFolder: config.vueFolder });
  }
  catch (err) {
    throw new Error(`Failed to download Icon with name -> ${pathname}`, { cause: err });
  }
}
