import { figmaClientRequest } from './figmaClient.js';

/**
 * Asynchronously fetches the URLs of the images for the given icons from the Figma API.
 * The function maps over the `icons` array to create a comma-separated string of icon IDs, which is used in the API request.
 * If the API response contains an error, the function throws an error with the error message from the response.
 * If the API request is successful, the function maps over the `icons` array again to add the image URL to each icon object.
 *
 * @async
 * @param {object} config
 * @param {Array} icons - An array of icon objects. Each object should have an `id` property.
 * @returns {Promise<Array>} An array of icon objects, each with an added `image` property containing the URL of the image.
 * @throws Will throw an error if the Figma API request fails.
 */
export async function getFigmaImages(config, icons) {
  console.log('Fetching icon urls');
  const figmaClient = figmaClientRequest(config.token);
  const imagesMap = new Map();

  // Create batches of icon IDs
  const batchSize = 200;
  const batches = [];
  for (let i = 0; i < icons.length; i += batchSize) {
    const batch = icons.slice(i, i + batchSize).map(icon => icon.id).join(',');
    batches.push(batch);
  }

  // Create an array of Promises for each batch request
  const requests = batches.map(iconIds =>
    figmaClient.get(`/images/${config.fileKey}?ids=${iconIds}&format=svg`)
  );

  // Await all requests concurrently
  const responses = await Promise.all(requests);
  responses.forEach((response) => {
    if (response.data.err) {
      console.log('err', response.data.err);
      throw new Error(response.data.err);
    }
    const { images } = response.data;
    Object.entries(images).forEach(([key, value]) => imagesMap.set(key, value));
  });

  return icons.map(icon => ({ ...icon, image: imagesMap.get(icon.id) }));
}
