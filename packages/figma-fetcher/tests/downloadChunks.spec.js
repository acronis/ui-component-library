import { describe, expect, it, vi } from 'vitest';
import * as DownloadChunks from '../src/downloadChunks.js';

// vi.mock('./downloadIcons.js', async () => {
//   const actual = await vi.importActual('./downloadIcons.js');
//
//   return { ...actual, downloadIcon: vi.fn() };
// });

describe('downloadChunks', () => {
  it('should download all icons in chunks', async () => {
    const icons = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `icon${i}` }));
    const onDownloadChunk = vi.spyOn(DownloadChunks, 'downloadChunks').mockResolvedValue(() => Promise.resolve());

    await DownloadChunks.downloadChunks(icons);

    expect(onDownloadChunk).toHaveBeenCalledTimes(10); // 100 icons / 10 icons per chunk
  });

  // Add more tests for different scenarios...
});
