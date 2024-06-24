import chalk from 'chalk';
import { figmaClientRequest } from './figmaClient.js';
import { findDuplicates, formatName } from './helpers.js';

/**
 * Asynchronously fetches the icons from the Figma API.
 * The function starts by logging the start time and making a request to the Figma API to get the file with the provided `FILE_KEY`.
 * If the API response contains an error, the function throws an error with the error message from the response.
 * If the API request is successful, the function finds the page with the name specified in the `exportIconConfig.page` configuration.
 * If the page is not found, the function throws an error.
 * The function then finds the frame with the name specified in the `process.env.FRAME_NAME` configuration within the found page.
 * If the frame is not found, the function logs an error message and returns.
 * The function then iterates over the children of the found frame, and for each child that is not a 'COMPONENT_SET', it adds the child to the `resultIcons` array.
 * For each child that is a 'COMPONENT_SET', it iterates over its children and adds each one to the `resultIcons` array, with its name modified according to its own name and the name of the parent.
 * The function then maps over the `resultIcons` array to create a new array of icon objects, each with an `id` and a `name` property.
 * The `name` property is the formatted name of the icon, obtained by calling the `formatName` function with the icon's name.
 * The function finally returns the result of calling the `findDuplicates` function with 'name' and the array of icon objects.
 *
 * @async
 * @returns {Promise<Array | undefined>} An array of icon objects, each with an `id` and a `name` property. The `name` property is the formatted name of the icon.
 * @throws Will throw an error if the Figma API request fails or if the specified page or frame is not found.
 */
export async function getFigmaIcons(config) {
  const figmaClient = figmaClientRequest(config.token);

  if (!config.fileKey) {
    console.log(chalk.red.bold('File not found, pls add FILE_KEY to env.local'));
    return;
  }

  console.log('Fetching Figma file (this might take a while depending on the figma file size)');
  const startTime = new Date().getTime();
  const response = await figmaClient.get(`/files/${config.fileKey}`);
  if (response.data.err) {
    throw new Error(`Cannot get Figma file: ${response.data.err}`);
  }
  const endTime = new Date().getTime();
  console.log(chalk.cyan.bold(`Finished fetching Figma in ${(endTime - startTime) / 1000}s\n`));
  const page = response.data.document.children.find(c => c.name === config.iconsPage);

  if (!page) {
    throw new Error('Cannot find Icons Page, check your settings');
  }

  const framesWithIcons = page.children.filter(c => c.type === 'FRAME' && config.frameNames.includes(c.name));
  console.log(framesWithIcons);
  if (!framesWithIcons) {
    console.log(
      chalk.red.bold(
        'Cannot find',
        chalk.white.bgRed(config.frameNames),
        'Frames in this Page, check your settings',
      ),
    );
    return;
  }
  const resultIcons = [];
  const iconsArray = [];
  framesWithIcons.map(frame => frame.children.find(c => c.type === 'GROUP' && c.name === 'Icons')).forEach((group) => {
    iconsArray.push(...group.children);
  });

  iconsArray.forEach((icon) => {
    if (icon.name.startsWith('_')) {
      return;
    }

    if (icon.type === 'COMPONENT_SET') {
      icon.children.forEach((child) => {
        resultIcons.push({
          ...child,
          name: `${icon.name}${
                        child.name.toLowerCase() === 'style=mono' ? '' : `-${child.name.toLowerCase()}`
                    }`,
        });
      });
    }
    else {
      resultIcons.push(icon);
    }
  });

  const icons = resultIcons.map((icon) => {
    return { id: icon.id, name: formatName(icon.name) };
  });

  return findDuplicates('name', icons);
}
