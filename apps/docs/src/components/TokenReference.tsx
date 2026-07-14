import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * A scannable reference of every `--ui-*` custom property `@constructor-lab/tokens`
 * ships, read at build time. Primitives (the raw value / theme layer) live in
 * `css/primitives.css`; the semantic tier in `css/semantics.css`; each component
 * tier in `css/components/<Component>.css`. Values are shown as authored — most
 * semantic/component tokens are `var(--…)` references onto primitives — and the
 * reference chain is resolved to a concrete color for the swatch preview.
 */

interface Token {
  name: string;
  value: string;
}

interface TokenGroup {
  label: string;
  tokens: Token[];
}

/** `process.cwd()` is `apps/docs/` at build time; the tokens package is at root. */
const CSS_DIR = resolve(process.cwd(), '..', '..', 'packages/tokens/css');

/** Extract `--ui-*` declarations (name + value, as authored) in source order. */
function parseTokens(css: string): Token[] {
  const seen = new Set<string>();
  const out: Token[] = [];
  // Match `--ui-name: value;` allowing nested parens (var(), light-dark, gradients).
  const re = /(--ui-[a-z0-9-]+)\s*:\s*([^;]+);/g;
  for (const m of css.matchAll(re)) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, value: m[2].trim() });
  }
  return out;
}

/** Read a css file if present, else empty string. */
const read = (file: string): string => {
  try {
    return readFileSync(file, 'utf-8');
  } catch {
    return '';
  }
};

/**
 * Resolve a token value to a paintable color: follow `var(--…)` refs through the
 * name→value map, and pick the light side of a `light-dark(l, d)` pair. Returns
 * null for gradients / non-color values.
 */
function resolveColor(
  value: string,
  map: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 12) return null;
  const v = value.trim();
  const ref = v.match(/^var\(\s*(--ui-[a-z0-9-]+)\s*\)$/i);
  if (ref) {
    const target = map.get(ref[1]);
    return target ? resolveColor(target, map, depth + 1) : null;
  }
  const ld = v.match(/^light-dark\(\s*(.+?)\s*,\s*(.+)\)$/);
  if (ld) return resolveColor(ld[1], map, depth + 1);
  if (v === 'transparent') return 'transparent';
  if (/^(rgb|rgba|hsl|hsla|oklch|#)/.test(v)) return v;
  return null;
}

function buildGroups(): {
  groups: TokenGroup[];
  resolve: (v: string) => string | null;
} {
  const primitives = parseTokens(read(resolve(CSS_DIR, 'primitives.css')));
  const semantic = parseTokens(read(resolve(CSS_DIR, 'semantics.css')));

  // One file per component under css/components/ (discovered, not hardcoded).
  const componentsDir = resolve(CSS_DIR, 'components');
  const componentFiles = readdirSync(componentsDir)
    .filter((entry) => entry.endsWith('.css'))
    .sort();

  const componentGroups: TokenGroup[] = [];
  for (const file of componentFiles) {
    const tokens = parseTokens(read(resolve(componentsDir, file)));
    if (tokens.length)
      componentGroups.push({ label: file.replace(/\.css$/, ''), tokens });
  }

  // A global name→value map (across every tier) resolves var() reference chains.
  const map = new Map<string, string>();
  for (const group of [
    primitives,
    semantic,
    ...componentGroups.map((g) => g.tokens),
  ])
    for (const t of group) if (!map.has(t.name)) map.set(t.name, t.value);

  const groups: TokenGroup[] = [];
  if (primitives.length)
    groups.push({ label: 'Primitives', tokens: primitives });
  if (semantic.length) groups.push({ label: 'Semantic', tokens: semantic });
  groups.push(...componentGroups);

  return { groups, resolve: (v) => resolveColor(v, map) };
}

export function TokenReference() {
  const { groups, resolve: resolveSwatch } = buildGroups();

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
            {group.label}{' '}
            <span className="font-normal">({group.tokens.length})</span>
          </h3>
          <div className="overflow-x-auto rounded-lg border border-fd-border">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-fd-border bg-fd-muted/50">
                  <th className="px-3 py-2 font-medium text-fd-muted-foreground">
                    Token
                  </th>
                  <th className="px-3 py-2 font-medium text-fd-muted-foreground">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.tokens.map((token) => {
                  const color = resolveSwatch(token.value);
                  return (
                    <tr
                      key={token.name}
                      className="border-b border-fd-border last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-3 py-1.5 font-mono text-fd-foreground">
                        {token.name}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-fd-muted-foreground">
                        <span className="flex items-center gap-2">
                          {color && (
                            <span
                              aria-hidden
                              className="inline-block size-3.5 shrink-0 rounded border border-fd-border"
                              style={{ background: color }}
                            />
                          )}
                          <span className="break-all">{token.value}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
