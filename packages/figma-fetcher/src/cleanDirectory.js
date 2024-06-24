import fs, { promises } from 'node:fs';
import path from 'node:path';

/**
 * Asynchronously deletes the contents of a directory.
 * @param directory
 * @returns {Promise<void>}
 */
export async function cleanDirectory(directory) {
  if (fs.existsSync(directory)) {
    const subDirectories = await promises.readdir(directory);
    await Promise.all(subDirectories.map(dir => promises.rm(path.join(directory, dir), { recursive: true, force: true })));
  }
}
