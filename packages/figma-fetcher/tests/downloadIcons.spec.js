import { promises as fsPromises } from 'node:fs';
import fetch from 'node-fetch';
import { describe, expect, it, vi } from 'vitest';
import { cleanDirectory, downloadChunk, downloadChunks, downloadIcons, downloadImage } from './downloadIcons';

describe('downloadIcons', () => {
  it('should throw an error if FIGMA_TOKEN is not provided', async () => {
    // process.env.FIGMA_TOKEN = '';
    await expect(downloadIcons()).rejects.toThrow('Token not found, pls add FIGMA_TOKEN to env.local');
  });

  // Add more tests for different scenarios...
});

describe('downloadChunks', () => {
  it('should download all icons in chunks', async () => {
    const icons = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `icon${i}` }));
    vi.spyOn(global, 'downloadChunk').mockImplementation(() => Promise.resolve());

    await downloadChunks(icons);

    expect(downloadChunk).toHaveBeenCalledTimes(10); // 100 icons / 10 icons per chunk
  });

  // Add more tests for different scenarios...
});

describe('downloadChunk', () => {
  it('should download a chunk of icons', async () => {
    const icons = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `icon${i}` }));
    vi.spyOn(global, 'downloadIcon').mockImplementation(() => Promise.resolve());

    await downloadChunk(icons, 0);

    expect(downloadIcon).toHaveBeenCalledTimes(10); // 10 icons in the chunk
  });

  // Add more tests for different scenarios...
});

describe('downloadImage', () => {
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

describe('cleanDirectory', () => {
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

it('downloads all icons in a chunk', async ({ is }) => {
  const icons = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `icon${i}` }));
  const downloadIcon = vi.fn().mockResolvedValue(true);

  await downloadChunk(icons, 0, downloadIcon);

  is(downloadIcon.mock.calls.length, 10); // 10 icons in the chunk
});

it('does not exceed the length of the icons array', async ({ is }) => {
  const icons = Array.from({ length: 5 }, (_, i) => ({ id: i, name: `icon${i}` }));
  const downloadIcon = vi.fn().mockResolvedValue(true);

  // vi.spyOn(global, 'downloadImage').mockImplementation(() => Promise.resolve());

  vi.mock('./downloadIcons.js', async (importOriginal) => {
    const mod = await importOriginal < typeof import('./downloadIcons.js') > ('./downloadIcons.js');
    return {
      ...mod,
      downloadImage: () => Promise.resolve()
    };
  });

  await downloadChunk(icons, 0);

  is(downloadIcon.mock.calls.length, 5); // Only 5 icons in the chunk
});

it('starts where the previous chunk ended', async ({ is }) => {
  const icons = Array.from({ length: 20 }, (_, i) => ({ id: i, name: `icon${i}` }));
  const downloadIcon = vi.fn().mockResolvedValue(true);

  await downloadChunk(icons, 1, downloadIcon);

  const firstIconInChunk = downloadIcon.mock.calls[0][0];
  is(firstIconInChunk, icons[10]); // The first icon in the second chunk should be the 11th icon
});
