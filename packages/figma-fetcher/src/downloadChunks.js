import { downloadImage } from './downloadImage.js';

const chunkSize = 10; // 10 requests in chunk
const chunksCount = 3; // 3 chunks in parallel

/**
 * This function is responsible for downloading chunks of icons. It manages the download process by dividing the icons into chunks and downloading them concurrently.
 * It uses the Promise.race method to wait for the fastest promise to resolve and then filters out the resolved promises from the array of download promises.
 * This process continues until all icons have been downloaded.
 *
 * @async
 * @param {object} config
 * @param {Array} icons - An array of icon objects to be downloaded. Each object should have an `id` and a `name` property.
 * @throws Will throw an error if the download of any icon fails.
 */
export async function downloadChunks(config, icons) {
  // An array to hold the promises for the download of each chunk of icons.
  let downloadPromises = [];

  // A counter to keep track of the current chunk being processed.
  let currentChunk = 0;

  // Loop over the icons array, processing chunks of icons until all icons have been processed.
  while (currentChunk < icons.length) {
    // Push the promise for the download of the current chunk of icons to the downloadPromises array.
    downloadPromises.push(downloadChunk(config, icons, currentChunk));

    // Increment the currentChunk counter by the size of each chunk.
    currentChunk += chunkSize;

    // If the number of download promises has reached the maximum number of chunks that can be processed concurrently,
    // wait for the fastest promise to resolve and then filter out the resolved promises from the downloadPromises array.
    if (downloadPromises.length >= chunksCount) {
      await Promise.race(downloadPromises);
      downloadPromises = downloadPromises.filter(p => typeof p.isPending === 'function' && p.isPending());
    }
  }

  // Wait for all remaining download promises to resolve before the function returns.
  await Promise.all(downloadPromises);
}

export async function downloadChunk(config, icons, chunk) {
  const from = chunk;
  const to = Math.min(chunk + chunkSize, icons.length);
  const iconsChunk = icons.slice(from, to);

  console.log(`Downloading, chunk: ${chunk}, chunkSize: ${iconsChunk.length}, from ${from} to ${to}`);
  await Promise.all(iconsChunk.map(icon => downloadImage(config, icon)));

  return chunk;
}
