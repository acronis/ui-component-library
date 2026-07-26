import { describe, expect, it } from 'vitest';
import { downloadIcons } from '../src/downloadIcons';

describe.skip('downloadIcons', () => {
  it('should throw an error if FIGMA_TOKEN is not provided', async () => {
    // process.env.FIGMA_TOKEN = '';
    await expect(downloadIcons()).rejects.toThrow('Token not found, pls add FIGMA_TOKEN to env.local');
  });
});
