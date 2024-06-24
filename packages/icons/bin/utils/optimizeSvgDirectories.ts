import fs from 'node:fs';
import type { Config } from 'svgo';
import { loadConfig, optimize } from 'svgo';
import glob from 'fast-glob';
import chalk from 'chalk';

export async function optimizeSvgDirectories(dir: string) {
  console.info(chalk.blue('Optimizing SVG icons in...', dir));

  const config = await loadConfig();

  const files = await glob(`${dir}/**/*.svg`);

  files.forEach((file) => {
    const data = fs.readFileSync(file, 'utf8');
    const result = optimize(data, config as Config).data
      // .replace(/<svg[^>]*?>/g, '<g fill="currentColor">')
      // .replace(/<\/svg>/g, '<\/g>')
      .replace(/#2668C5/g, 'currentColor');

    fs.writeFileSync(file, result);
  });
}
