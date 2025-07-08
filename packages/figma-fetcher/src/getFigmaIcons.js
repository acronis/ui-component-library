import chalk from 'chalk';
import { figmaClientRequest } from './figmaClient.js';
import { findDuplicates, formatName } from './helpers.js';

/**
 * Asynchronously fetches the icons from the Figma API using a two-step approach:
 * 1. First gets the file structure to find page IDs
 * 2. Then fetches only the specific pages we need
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

  // Step 1: Get file structure to find page IDs
  console.log('Fetching Figma file structure...');
  const structureStartTime = new Date().getTime();
  const structureResponse = await figmaClient.get(`/files/${config.fileKey}?depth=1`);

  if (structureResponse.data.err) {
    throw new Error(`Cannot get Figma file structure: ${structureResponse.data.err}`);
  }

  const structureEndTime = new Date().getTime();
  console.log(chalk.cyan.bold(`Finished fetching structure in ${(structureEndTime - structureStartTime) / 1000}s`));

  // Find the pages we need
  const allPages = structureResponse.data.document.children;
  const targetPages = allPages.filter(page => config.pageNames.includes(page.name));

  if (!targetPages.length) {
    throw new Error(`Cannot find pages with names: ${config.pageNames.join(', ')}. Available pages: ${allPages.map(p => p.name).join(', ')}`);
  }

  console.log(`Found ${targetPages.length} target pages: ${targetPages.map(p => p.name).join(', ')}`);

  // Step 2: Fetch only the specific pages we need
  console.log('Fetching specific pages...');
  const pagesStartTime = new Date().getTime();

  const pageIds = targetPages.map(page => page.id).join(',');
  const pagesResponse = await figmaClient.get(`/files/${config.fileKey}/nodes?ids=${pageIds}`);

  if (pagesResponse.data.err) {
    throw new Error(`Cannot get Figma pages: ${pagesResponse.data.err}`);
  }

  const pagesEndTime = new Date().getTime();
  console.log(chalk.cyan.bold(`Finished fetching pages in ${(pagesEndTime - pagesStartTime) / 1000}s\n`));

  // Process the fetched pages
  const pages = Object.values(pagesResponse.data.nodes).map(node => node.document);

  const framesWithIcons = pages.flatMap(page =>
    page.children.filter(c => c.type === 'FRAME' && config.frameNames.includes(c.name))
  );

  if (!framesWithIcons.length) {
    console.log(
      chalk.red.bold(
        'Cannot find',
        chalk.white.bgRed(config.frameNames),
        'Frames in the specified pages, check your settings',
      ),
    );
    return;
  }

  const resultIcons = [];
  const iconsArray = [];

  function findComponents(element) {
    if (element.children) {
      element.children.forEach((child) => {
        if (child.type === 'COMPONENT') {
          iconsArray.push(child);
        }
        else {
          // Recursively search for children in each child element
          findComponents(child);
        }
      });
    }
  }

  framesWithIcons.forEach(frame => findComponents(frame));

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
