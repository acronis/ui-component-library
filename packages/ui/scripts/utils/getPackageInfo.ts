import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const endsWithPkgRE = /[\\/]package\.json$/;

export async function getPackageInfo(pkgDir: string, errorIfPrivate = false) {
  if (endsWithPkgRE.test(pkgDir)) {
    pkgDir = dirname(pkgDir);
  }

  const pkgPath = resolve(pkgDir, 'package.json');

  if (!existsSync(pkgPath)) {
    throw new Error(`Cannot find package.json from '${pkgDir}'`);
  }

  const rawPkg = readFileSync(pkgPath, 'utf-8');
  const pkg = JSON.parse(rawPkg) as ProjectManifest;

  if (errorIfPrivate && pkg.private) {
    throw new Error(`Package from '${pkgDir}' is private`);
  }

  return {
    pkgDir,
    pkgPath,
    pkg,
    rawPkg
  };
}
