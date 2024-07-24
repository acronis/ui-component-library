import process from 'node:process';
import chalk from 'chalk';
import { downloadChunks } from './downloadChunks.js';
import { getFigmaImages } from './getFigmaImages.js';
import { cleanDirectory } from './cleanDirectory.js';
import { getFigmaIcons } from './getFigmaIcons.js';
import { getConfig } from './helpers.js';

/**
 * Asynchronously fetches the icons from the Figma API.
 * The function starts by logging the start time and making a request to the Figma API to get the file with the provided `FILE_KEY`.
 * If the API response contains an error, the function throws an error with the error message from the response.
 * If the API request is successful, the function finds the page with the name specified in the `exportIconConfig.page` configuration.
 * If the page is not found, the function throws an error.
 * The function then finds the frame with the name specified in the `exportIconConfig.frame` configuration within the found page.
 * If the frame is not found, the function logs an error message and returns.
 * The function then iterates over the children of the found frame, and for each child that is not a 'COMPONENT_SET', it adds the child to the `resultIcons` array.
 * For each child that is a 'COMPONENT_SET', it iterates over its children and adds each one to the `resultIcons` array, with its name modified according to its own name and the name of the parent.
 * The function then maps over the `resultIcons` array to create a new array of icon objects, each with an `id` and a `name` property.
 * The `name` property is the formatted name of the icon, obtained by calling the `formatName` function with the icon's name.
 * The function finally returns the result of calling the `findDuplicates` function with 'name' and the array of icon objects.
 */
export async function downloadIcons(userConfig) {
  const config = { ...getConfig(), ...userConfig };
  // Check if the FIGMA_TOKEN is present in the environment variables
  if (!config.token) {
    // Log an error message and return if the token is not found
    console.log(chalk.red.bold('Token not found, pls add FIGMA_TOKEN to env.local'));
    return;
  }

  try {
    // Fetch the Figma file
    const figmaFile = await getFigmaIcons(config);
    // Extract the icons from the Figma file
    const icons = await getFigmaImages(config, figmaFile);

    console.log(`Api returned ${icons.length} icons\n`);

    // Clean the directory where the icons will be stored
    console.log('Deleting directory contents');
    await Promise.all([cleanDirectory(config.publicFolder), cleanDirectory(config.vueFolder)]);
    // Download the icons in chunks
    await downloadChunks(config, icons);

    // Log a success message when the download is finished
    console.log(chalk.cyan.bold('Download Finished\n'));
  }
  catch (e) {
    // Log the error and exit the process with a failure status code if an error occurs
    console.error(chalk.red.bold(e));
    process.exit(1);
  }
}
