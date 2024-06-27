import { emptyDir, ensureDir } from 'fs-extra';
import chalk from 'chalk';

export async function checkingDirectories(dir: string) {
  console.info(chalk.blue('Checking directories...', dir));

  await ensureDir(dir);
  await emptyDir(dir);
}
