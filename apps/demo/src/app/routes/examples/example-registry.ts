import type * as React from 'react';

// Auto-discovered gallery of EVERY demo in the shared
// `@constructor-lab/ui-kit-demos` workspace. `import.meta.glob` makes this
// automatic: dropping a new `src/<component>/<Demo>.tsx` file into apps/demos
// surfaces it here with zero wiring — no per-component registry to maintain
// (unlike the curated `component-demos.tsx` map next door).
//
// The demos are the canonical "how you'd actually use this in an app" examples;
// apps/docs keeps its own laconic subset. Glob paths are relative to this file:
// apps/demo/src/app/routes/examples/ -> apps/demos/src/.
const modules = import.meta.glob('../../../../../demos/src/*/*.tsx', {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const sources = import.meta.glob('../../../../../demos/src/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// Folders under demos/src that are support code, not component demo galleries.
// (`lib` is `.ts` only, so the `*.tsx` glob already skips it — listed for clarity.)
const EXCLUDED_FOLDERS = new Set(['icons', 'lib']);

export interface DemoExample {
  /** File base name, e.g. `ButtonVariants`. Unique within a group. */
  id: string;
  /** Humanized title, e.g. `Button Variants`. */
  title: string;
  /** Raw source of the file, shown in the "View Code" panel. */
  code: string;
  /** React components exported by the file (usually one). */
  components: React.ComponentType[];
}

export interface DemoGroup {
  /** Folder slug, e.g. `button-group`. Used as the route param. */
  slug: string;
  /** Humanized label, e.g. `Button Group`. */
  label: string;
  examples: DemoExample[];
}

const PATH_RE = /\/demos\/src\/([^/]+)\/([^/]+)\.tsx$/;

/** `ButtonGroupWithIcons` -> `Button Group With Icons`. */
function humanizeFileName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();
}

/** `button-group` -> `Button Group`. */
function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Runtime-exported React components of a demo module, in export order. */
function componentsOf(mod: Record<string, unknown>): React.ComponentType[] {
  return Object.values(mod).filter(
    (value): value is React.ComponentType => typeof value === 'function'
  );
}

function buildGroups(): DemoGroup[] {
  const bySlug = new Map<string, DemoGroup>();

  for (const [path, mod] of Object.entries(modules)) {
    const match = PATH_RE.exec(path);
    if (!match) continue;
    const [, slug, fileName] = match;
    if (EXCLUDED_FOLDERS.has(slug)) continue;

    const components = componentsOf(mod);
    if (components.length === 0) continue;

    let group = bySlug.get(slug);
    if (!group) {
      group = { slug, label: slugToLabel(slug), examples: [] };
      bySlug.set(slug, group);
    }

    group.examples.push({
      id: fileName,
      title: humanizeFileName(fileName),
      code: sources[path] ?? '',
      components,
    });
  }

  const groups = [...bySlug.values()];
  for (const group of groups) {
    group.examples.sort((a, b) => a.title.localeCompare(b.title));
  }
  groups.sort((a, b) => a.label.localeCompare(b.label));
  return groups;
}

/** Every demo group, sorted by label, each with its examples sorted by title. */
export const demoGroups: DemoGroup[] = buildGroups();

/** Total number of individual demo files across all groups. */
export const totalExampleCount: number = demoGroups.reduce(
  (sum, group) => sum + group.examples.length,
  0
);

export function findDemoGroup(slug: string): DemoGroup | undefined {
  return demoGroups.find((group) => group.slug === slug);
}
