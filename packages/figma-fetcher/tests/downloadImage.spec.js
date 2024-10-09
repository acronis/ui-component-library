import { promises as fsPromises } from 'node:fs';
import fetch from 'node-fetch';
import { describe, expect, it, vi } from 'vitest';
import { downloadImage } from '../src/downloadImage.js';

describe.skip('downloadImage', () => {
  it('should download an image and save it to the specified directory', async () => {
    const url = 'http://example.com/icon.svg';
    const name = 'icon';
    vi.spyOn(fetch, 'default').mockImplementation(() => Promise.resolve({ body: 'image data' }));
    vi.spyOn(fsPromises, 'mkdir').mockImplementation(() => Promise.resolve());
    vi.spyOn(fsPromises, 'createWriteStream').mockImplementation(() => ({ pipe: vi.fn() }));

    await downloadImage(url, name);

    expect(fetch.default).toHaveBeenCalledWith(url);
    expect(fsPromises.mkdir).toHaveBeenCalled();
    expect(fsPromises.createWriteStream).toHaveBeenCalled();
  });

  // Add more tests for different scenarios...
});
