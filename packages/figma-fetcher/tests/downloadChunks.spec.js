import { describe, expect, it, vi } from 'vitest';
import { downloadChunk, downloadChunks } from '../src/downloadChunks.js';

// vi.mock('./downloadIcons.js', async () => {
//   const actual = await vi.importActual('./downloadIcons.js');
//
//   return { ...actual, downloadIcon: vi.fn() };
// });

describe.skip('downloadChunks', () => {
  it('should download all icons in chunks', async () => {
    const icons = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `icon${i}` }));
    vi.spyOn(global, 'downloadChunk').mockImplementation(() => Promise.resolve());

    await downloadChunks(icons);

    expect(downloadChunk).toHaveBeenCalledTimes(10); // 100 icons / 10 icons per chunk
  });

  // Add more tests for different scenarios...
});
