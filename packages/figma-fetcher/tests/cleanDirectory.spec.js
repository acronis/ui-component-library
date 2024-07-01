import { promises as fsPromises } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { cleanDirectory } from '../src/cleanDirectory.js';

describe.skip('cleanDirectory', () => {
  it('should delete the contents of a directory', async () => {
    const directory = './icons';
    vi.spyOn(fsPromises, 'existsSync').mockReturnValue(true);
    vi.spyOn(fsPromises, 'readdir').mockReturnValue(Promise.resolve(['icon1.svg', 'icon2.svg']));
    vi.spyOn(fsPromises, 'rm').mockImplementation(() => Promise.resolve());

    await cleanDirectory(directory);

    expect(fsPromises.existsSync).toHaveBeenCalledWith(directory);
    expect(fsPromises.readdir).toHaveBeenCalledWith(directory);
    expect(fsPromises.rm).toHaveBeenCalledTimes(2); // Two files in the directory
  });

  // Add more tests for different scenarios...
});
