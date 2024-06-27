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
  const iconIds = icons.map(icon => icon.id).join(',');
  const response = await figmaClient.get(`/images/${config.fileKey}?ids=${iconIds}&format=svg`);

  if (response.data.err) {
    throw new Error(response.data.err);
  }
  const { images } = response.data;

  return icons.map(icon => ({ ...icon, image: images[icon.id] }));
}
