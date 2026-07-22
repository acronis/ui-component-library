// CLI home. Parses the requested platform keys / filters and dispatches to the
// token build domain (`./tokens`) in dependency order (css reads dtcg). The
// shared platform-key axes and output locations live in `./platforms`; all
// translation logic lives in that domain, not here.
//
// A platform key is `${filter}-${output}`, the CLI selector. Usage:
//   tsx src/index.ts                 all filters, all outputs
//   tsx src/index.ts pd-css          one platform (runs its dtcg dep first)
//   tsx src/index.ts --filter=web    restrict to one filter

import {
  ALL_FILTERS,
  type Filter,
  filtersFor,
  type Output,
  OUTPUTS,
  type PlatformKey,
} from './platforms';
import { buildCss, buildDtcg } from './tokens';

// ── CLI ────────────────────────────────────────────────────────────────────────

/** One requested build target, split into its two axes. */
type Pair = { filter: Filter; output: Output };

const validKeys = (): PlatformKey[] =>
  OUTPUTS.flatMap((o) => filtersFor(o).map((f): PlatformKey => `${f}-${o}`));

function parseKey(key: string): Pair {
  // Neither a filter (pd/web) nor an output (dtcg/css) contains a dash, so the
  // last dash is always the boundary between them.
  const dash = key.lastIndexOf('-');
  if (dash <= 0 || dash === key.length - 1) {
    throw new Error(
      `Unknown platform: ${key}. Known: ${validKeys().join(', ')}.`
    );
  }
  const filter = key.slice(0, dash) as Filter;
  const output = key.slice(dash + 1) as Output;
  if (!OUTPUTS.includes(output) || !filtersFor(output).includes(filter)) {
    throw new Error(
      `Unknown platform: ${key}. Known: ${validKeys().join(', ')}.`
    );
  }
  return { filter, output };
}

interface ParsedArgs {
  pairs: Pair[];
}

/** Turn `process.argv` into the build pairs to run. */
function parseArgs(args: string[]): ParsedArgs {
  const filterArg = args
    .find((a) => a.startsWith('--filter='))
    ?.slice('--filter='.length) as Filter | undefined;
  if (filterArg && !ALL_FILTERS.includes(filterArg)) {
    throw new Error(
      `Unknown filter: ${filterArg}. Known: ${ALL_FILTERS.join(', ')}.`
    );
  }
  const filters = filterArg ? [filterArg] : ALL_FILTERS;

  const requestedKeys = args.filter((a) => !a.startsWith('-'));
  const pairs = requestedKeys.length
    ? requestedKeys.map(parseKey).filter((p) => filters.includes(p.filter))
    : OUTPUTS.flatMap((o) =>
        filtersFor(o)
          .filter((f) => filters.includes(f))
          .map((f): Pair => ({ filter: f, output: o }))
      );

  return { pairs };
}

async function main(): Promise<void> {
  const { pairs } = parseArgs(process.argv.slice(2));

  // css reads the dtcg files, so build dtcg first for any filter needing it.
  const dtcgFilters = new Set<Filter>();
  for (const { filter, output } of pairs) {
    if (output === 'dtcg' || output === 'css') dtcgFilters.add(filter);
  }
  for (const filter of dtcgFilters) buildDtcg(filter);
  for (const { filter, output } of pairs)
    if (output === 'css') await buildCss(filter);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
