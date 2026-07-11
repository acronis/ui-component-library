import * as React from 'react';
import { tokens } from '@spec-lab/tokens/js';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Search,
  Stack,
  Tag,
} from '@spec-lab/ui-react';

// The token gallery is DERIVED from the generated `@spec-lab/tokens/js` map
// (name -> `var(--ui-*)`), so it never goes stale when tokens are added,
// removed, or renamed. We never hand-type a token list here. Each token's live
// value is resolved at runtime from the document so swatches and printed values
// track the active [data-theme] / [data-brand] exactly.

// Every token name is `ui-<category>-…`; the category is the second segment.
function categoryOf(key: string): string {
  return key.split('-')[1] ?? 'other';
}

// A resolved computed value is a paintable color when it starts with a color
// function / hex, a `light-dark()` pair (how the semantic tiers resolve), a
// `color-mix()`, or is a gradient (which `background: var(--…)` also paints).
function isColorValue(value: string): boolean {
  const v = value.trim().toLowerCase();
  return /^(#|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color\(|light-dark\(|color-mix\(|(linear|radial|conic)-gradient\()/.test(
    v
  );
}

// Lead with the semantic vocabulary, then give the fresh `chart` palette a
// prominent slot, then the per-component tiers (alphabetical). The two huge raw
// tiers (`palette`, `units`) are deferred to a collapsed section at the end so
// they don't drown the useful groups.
const LEAD_CATEGORIES = [
  'background',
  'text',
  'border',
  'glyph',
  'focus',
  'gradients',
  'link',
  'chart',
];
const DEFERRED_CATEGORIES = ['palette', 'units'];

type ResolvedToken = { key: string; cssVar: string; value: string };
type TokenGroup = {
  category: string;
  colors: ResolvedToken[];
  others: ResolvedToken[];
};

const ALL_KEYS = Object.keys(tokens).sort();

function resolveAll(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const styles = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (const key of ALL_KEYS) {
    out[key] = styles.getPropertyValue(`--${key}`).trim();
  }
  return out;
}

function useResolvedTokens(): Record<string, string> {
  const [resolved, setResolved] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const recompute = () => setResolved(resolveAll());
    recompute();

    // Re-resolve the printed values when the theme/brand attributes flip so the
    // displayed values (not just the CSS-driven swatches) follow dark mode.
    const observer = new MutationObserver(recompute);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-brand', 'class'],
    });
    return () => observer.disconnect();
  }, []);

  return resolved;
}

function buildGroups(
  resolved: Record<string, string>,
  filter: string
): TokenGroup[] {
  const needle = filter.trim().toLowerCase();
  const byCategory = new Map<string, TokenGroup>();

  for (const key of ALL_KEYS) {
    if (needle && !key.toLowerCase().includes(needle)) continue;
    const category = categoryOf(key);
    let group = byCategory.get(category);
    if (!group) {
      group = { category, colors: [], others: [] };
      byCategory.set(category, group);
    }
    const value = resolved[key] ?? '';
    const entry: ResolvedToken = { key, cssVar: `--${key}`, value };
    if (value && isColorValue(value)) group.colors.push(entry);
    else group.others.push(entry);
  }

  const rank = (category: string) => {
    const lead = LEAD_CATEGORIES.indexOf(category);
    if (lead !== -1) return lead;
    const deferred = DEFERRED_CATEGORIES.indexOf(category);
    if (deferred !== -1) return 10000 + deferred;
    return 1000; // component tiers, alphabetical within
  };

  return [...byCategory.values()].sort((a, b) => {
    const diff = rank(a.category) - rank(b.category);
    return diff !== 0 ? diff : a.category.localeCompare(b.category);
  });
}

function ColorSwatch({ token }: { token: ResolvedToken }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <div
        className="size-12 shrink-0 rounded-md border border-border"
        style={{ background: `var(${token.cssVar})` }}
      />
      <div className="min-w-0 flex-1">
        <code className="block truncate text-xs font-semibold text-foreground">
          {token.cssVar}
        </code>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {token.value}
        </span>
      </div>
    </div>
  );
}

function DimensionChip({ token }: { token: ResolvedToken }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-muted/40 px-3 py-2">
      <code className="truncate text-xs font-semibold text-foreground">
        {token.cssVar}
      </code>
      <span className="truncate text-xs text-muted-foreground">
        {token.value || '—'}
      </span>
    </div>
  );
}

function GroupSection({ group }: { group: TokenGroup }) {
  const total = group.colors.length + group.others.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl capitalize">
          {group.category}
          <Tag variant="neutral" size="sm">
            {total}
          </Tag>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack gap="lg">
          {group.colors.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.colors.map((token) => (
                <ColorSwatch key={token.key} token={token} />
              ))}
            </div>
          )}
          {group.others.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.others.map((token) => (
                <DimensionChip key={token.key} token={token} />
              ))}
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

const TAILWIND_BG = [
  'bg-background',
  'bg-foreground',
  'bg-primary',
  'bg-primary-foreground',
  'bg-secondary',
  'bg-secondary-foreground',
  'bg-destructive',
  'bg-destructive-foreground',
  'bg-muted',
  'bg-muted-foreground',
  'bg-accent',
  'bg-accent-foreground',
];
const TAILWIND_TEXT = [
  'text-foreground',
  'text-primary',
  'text-secondary',
  'text-destructive',
  'text-muted-foreground',
];
const TAILWIND_BORDER = [
  'border-border',
  'border-input',
  'border-ring',
  'border-primary',
  'border-destructive',
];

const CSS_USAGE = `/* In CSS — consume the token directly (values are full colors,
   never wrapped in hsl()). */
.my-component {
  background: var(--ui-background-surface-primary);
  color: var(--ui-text-on-surface-primary);
  border: 1px solid var(--ui-border-on-surface-border);
}

/* Alpha blend with color-mix (there is no hsl(var() / a) form). */
.my-component-hover {
  background: color-mix(in srgb, var(--ui-background-neutral-hover) 12%, transparent);
}`;

const TAILWIND_USAGE = `/* In JSX/TSX — the shadcn-name bridge maps these onto --ui-* tokens. */
<div className="bg-primary text-primary-foreground p-4 rounded-md">
  Primary surface
</div>

<div className="bg-muted text-muted-foreground border border-border">
  Muted panel
</div>`;

const REACT_USAGE = `/* In React — inline style referencing a --ui-* token. */
<div
  style={{
    background: 'var(--ui-background-surface-primary)',
    color: 'var(--ui-text-on-surface-primary)',
    borderRadius: 'var(--ui-units-radius-medium)',
  }}
>
  Custom component
</div>`;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed text-foreground">
      <code>{code}</code>
    </pre>
  );
}

export function DesignTokensDemo() {
  const resolved = useResolvedTokens();
  const [filter, setFilter] = React.useState('');

  const groups = React.useMemo(
    () => buildGroups(resolved, filter),
    [resolved, filter]
  );

  const leadGroups = groups.filter(
    (g) => !DEFERRED_CATEGORIES.includes(g.category)
  );
  const deferredGroups = groups.filter((g) =>
    DEFERRED_CATEGORIES.includes(g.category)
  );

  const totalTokens = ALL_KEYS.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <Stack gap="xl">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Design Tokens</h2>
          <p className="mt-2 text-muted-foreground">
            Live reference for the shipped{' '}
            <code className="text-foreground">@spec-lab/tokens</code>{' '}
            <code className="text-foreground">--ui-*</code> custom properties.
            The gallery is derived from the generated token map ({totalTokens}{' '}
            tokens) and each value is resolved from the running document, so it
            tracks the active theme and brand.
          </p>
        </div>

        <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="max-w-md">
            <Search
              aria-label="Filter tokens"
              placeholder="Filter tokens by name…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              onClear={() => setFilter('')}
            />
          </div>
        </div>

        {leadGroups.length === 0 && deferredGroups.length === 0 && (
          <p className="text-muted-foreground">
            No tokens match <code className="text-foreground">{filter}</code>.
          </p>
        )}

        <Stack gap="lg">
          {leadGroups.map((group) => (
            <GroupSection key={group.category} group={group} />
          ))}
        </Stack>

        {deferredGroups.map((group) => (
          <details
            key={group.category}
            className="rounded-lg border border-border"
            // When filtering, open the raw tiers so matches are visible.
            open={filter.trim().length > 0}
          >
            <summary className="flex cursor-pointer items-center gap-3 p-4 text-xl font-semibold capitalize text-foreground">
              {group.category}
              <Tag variant="neutral" size="sm">
                {group.colors.length + group.others.length}
              </Tag>
              <span className="text-sm font-normal text-muted-foreground">
                raw primitives — expand to browse
              </span>
            </summary>
            <div className="border-t border-border p-4">
              <Stack gap="lg">
                {group.colors.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {group.colors.map((token) => (
                      <ColorSwatch key={token.key} token={token} />
                    ))}
                  </div>
                )}
                {group.others.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {group.others.map((token) => (
                      <DimensionChip key={token.key} token={token} />
                    ))}
                  </div>
                )}
              </Stack>
            </div>
          </details>
        ))}

        <div>
          <h3 className="mb-4 text-2xl font-semibold text-foreground">
            Tailwind Utility Classes
          </h3>
          <p className="mb-6 text-muted-foreground">
            The shadcn-name bridge (
            <code className="text-foreground">
              @spec-lab/tokens/css/tailwind-theme.css
            </code>
            ) maps a small shared vocabulary onto <code>--ui-*</code> tokens.
            These are the names that actually resolve.
          </p>
          <Stack gap="lg">
            <div>
              <h4 className="mb-3 text-lg font-medium text-foreground">
                Background colors
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {TAILWIND_BG.map((className) => (
                  <div
                    key={className}
                    className="rounded-lg border border-border p-3"
                  >
                    <div className={`mb-2 h-16 w-full rounded ${className}`} />
                    <code className="text-xs text-muted-foreground">
                      {className}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-medium text-foreground">
                Text colors
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {TAILWIND_TEXT.map((className) => (
                  <div
                    key={className}
                    className="rounded-lg border border-border p-3"
                  >
                    <p className={`mb-2 text-2xl font-bold ${className}`}>Aa</p>
                    <code className="text-xs text-muted-foreground">
                      {className}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-medium text-foreground">
                Border colors
              </h4>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {TAILWIND_BORDER.map((className) => (
                  <div
                    key={className}
                    className="rounded-lg border border-border p-3"
                  >
                    <div
                      className={`mb-2 h-16 w-full rounded border-4 ${className}`}
                    />
                    <code className="text-xs text-muted-foreground">
                      {className}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </Stack>
        </div>

        <div>
          <h3 className="mb-4 text-2xl font-semibold text-foreground">
            Usage Examples
          </h3>
          <Stack gap="md">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">CSS variable usage</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={CSS_USAGE} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tailwind class usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={TAILWIND_USAGE} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  React inline-style usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={REACT_USAGE} />
              </CardContent>
            </Card>
          </Stack>
        </div>
      </Stack>
    </section>
  );
}
