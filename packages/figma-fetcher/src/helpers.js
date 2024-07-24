import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import dotenv from 'dotenv';

export function getConfig() {
  const envConfig = { ...getEnvConfig('.env'), ...getEnvConfig('.env.local') };

  return {
    token: envConfig.FIGMA_FETCHER_FIGMA_TOKEN,
    fileKey: envConfig.FIGMA_FETCHER_FILE_KEY,
    frameNames: envConfig.FIGMA_FETCHER_FRAME_NAMES,
    pageName: envConfig.FIGMA_FETCHER_PAGE_NAME,
    removeFromName: ['style=', 'type=', 'status='],
    publicFolder: 'public',
    vueFolder: 'vue',
  };
}

function getEnvConfig(file) {
  const fullPath = path.resolve(file);

  if (fs.existsSync(fullPath)) {
    return dotenv.parse(fs.readFileSync(fullPath));
  }

  return {};
}

export function formatName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s*\/\s*/g, '/')
    .replaceAll(' ', '-');
}

export function removeFromName(name, texts) {
  let newName = name;
  texts.forEach(text => (newName = newName.replace(text, '')));
  return newName;
}

export function findDuplicates(propertyName, arr) {
  const seen = new Set();

  return arr.map((current) => {
    if (seen.has(current[propertyName])) {
      console.log(chalk.bgRed.bold(`Duplicate icon name: ${current[propertyName]}. Please fix figma file`));
      current[propertyName] = `${current[propertyName]}-duplicate-name`;
    }
    seen.add(current[propertyName]);
    return current;
  });
}

/**
 * Splits an array into smaller sub-arrays of a given size.
 *
 * @param {Array} arr - The original array.
 * @param {number} size - The size of the sub-arrays.
 * @returns {Array} - The resulting array of sub-arrays.
 */
export function chunk(arr, size) {
  return arr.reduce((chunks, value, i) => {
    if (i % size === 0) {
      chunks.push(arr.slice(i, i + size));
    }

    return chunks;
  }, []);
}
