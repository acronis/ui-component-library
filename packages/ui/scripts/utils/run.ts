import type { Options } from 'execa';
import { execa } from 'execa';

export async function run(bin: string, args: string[], opts: Options = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts });
}
