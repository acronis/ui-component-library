import { describe, expect, it, vi } from 'vitest';
import { downloadChunk } from '../src/downloadChunks.js';

describe.skip('downloadChunk', () => {
  it('should download a chunk of icons', async () => {
    const icons = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `icon${i}` }));
    const downloadIcon = vi.fn().mockResolvedValue(true);

    vi.spyOn(global, 'downloadIcon').mockImplementation(() => Promise.resolve());

    await downloadChunk(icons, 0, downloadIcon);

    expect(downloadIcon).toHaveBeenCalledTimes(10); // 10 icons in the chunk
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
});
