import path from 'node:path';
import { promises } from 'node:fs';
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
  const directory = path.dirname(path.join(config.iconsPath, pathname));
  const nameClean = path.basename(pathname);

  await promises.mkdir(directory, { recursive: true });

  try {
    const imagePath = path.join(directory, `${nameClean}.svg`);
    const response = await fetch(url);
    const content = optimize(await response.text(), {
      plugins: [
        'preset-default',
        'removeDimensions',
        {
          name: 'addClassesToSVGElement',
          params: {
            classNames: ['ui-icon'],
          },
        },
      ],
    }).data.replace(/#181818/g, 'currentColor');

    await promises.writeFile(imagePath, content, 'utf8');

    config.onDownloadedIcon({ content, pathname });
  }
  catch (err) {
    throw new Error(`Failed to download Icon with name -> ${pathname}`, { cause: err });
  }
}
