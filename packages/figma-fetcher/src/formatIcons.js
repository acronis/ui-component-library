import fs, { promises } from 'node:fs';
import path from 'node:path';
import { optimize } from 'svgo';

export async function formatIcons(config) {
  const files = await promises.readdir(config.iconsPath).catch(() => {
    throw new Error('Cannot read icon dir');
  });

  for (const file of files) {
    const filePath = path.join(config.iconsPath, file);
    const stats = await promises.stat(filePath);
    if (stats.isDirectory()) {
      await formatIcons(filePath); // recursive call for subdirectory
    }
    else if (stats.isFile() && path.extname(filePath) === '.svg') {
      const data = await promises.readFile(filePath, 'utf8').catch(() => {
        throw new Error(`Cannot read icon ${filePath}`);
      });

      const newData = optimize(data, {
        plugins: ['preset-default', 'removeDimensions'],
      }).data.replace(/#181818/g, 'currentColor');

      fs.writeFileSync(filePath, newData);
    }
  }
}
