// Inline relative `declare module` augmentations into the bundled .d.ts.
//
// PLTFRM-93014. Each `data-grid-config/<group>.ts` declares its slice of the
// public prop surface by augmenting the registry's interfaces:
//
//   declare module './registry' {
//     interface DataGridGroupedConfigMap<TData> {
//       selection: false | DataGridSelectionConfig<TData>;
//     }
//   }
//
// tsup's `dts` flattens every declaration into one file per entry but copies
// those blocks across verbatim. In the flattened file there is no `./registry`
// to resolve to — and TypeScript *silently ignores* an augmentation of a module
// it cannot resolve, so all 19 of them evaporated. `DataGridGroupedConfigMap`
// stayed empty, and every config key (`selection`, `sorting`, `rowInteraction`,
// …) fell off `DataGridProps`: 21 unknown-prop errors for a consumer whose
// runtime worked fine, because dist/index.js reads all of them.
//
// Once flattened, the augmentation target sits in the *same* module as the
// augmentation. So the indirection is not just broken, it is unnecessary:
// unwrapping each block leaves bare `interface` declarations that merge with the
// empty originals through ordinary same-file declaration merging.
//
// This edits by exact AST node positions rather than by regex — the blocks carry
// doc comments containing unbalanced braces (`${columnId}:${value}`), which
// defeats brace counting — and re-parses afterwards to prove the result still
// parses and that no relative augmentation survived.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(packageRoot, 'dist');

/** Every `.d.ts` under dist, at any depth (one per tsup entry, plus chunks). */
function declarationFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...declarationFiles(path));
    else if (entry.endsWith('.d.ts')) found.push(path);
  }
  return found;
}

const isRelativeAugmentation = (statement) =>
  ts.isModuleDeclaration(statement) &&
  ts.isStringLiteral(statement.name) &&
  statement.name.text.startsWith('.');

/** The augmentation blocks in `text`, as replacements to apply. */
function findAugmentations(fileName, text) {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  return source.statements.filter(isRelativeAugmentation).map((statement) => ({
    specifier: statement.name.text,
    start: statement.getStart(source),
    end: statement.getEnd(),
    // The ModuleBlock spans `{ … }`; its interior is the merged declarations,
    // doc comments and all.
    body: text
      .slice(statement.body.getStart(source) + 1, statement.body.getEnd() - 1)
      .trim(),
  }));
}

let inlined = 0;
const touched = [];

for (const file of declarationFiles(distDir)) {
  const original = readFileSync(file, 'utf8');
  const augmentations = findAugmentations(file, original);
  if (augmentations.length === 0) continue;

  // Back to front, so each splice leaves earlier offsets valid.
  let text = original;
  for (const { start, end, body } of [...augmentations].reverse()) {
    text = `${text.slice(0, start)}${body}${text.slice(end)}`;
  }

  // Prove the edit: it must still parse, and nothing relative may remain.
  const reparsed = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  if (reparsed.parseDiagnostics?.length) {
    const [first] = reparsed.parseDiagnostics;
    throw new Error(
      `${relative(packageRoot, file)}: inlining produced unparsable output — ` +
        ts.flattenDiagnosticMessageText(first.messageText, ' ')
    );
  }
  const survivors = reparsed.statements.filter(isRelativeAugmentation);
  if (survivors.length > 0) {
    throw new Error(
      `${relative(packageRoot, file)}: ${survivors.length} relative ` +
        `\`declare module\` block(s) survived inlining ` +
        `(${survivors.map((s) => s.name.text).join(', ')})`
    );
  }

  writeFileSync(file, text);
  inlined += augmentations.length;
  touched.push(`${relative(packageRoot, file)} (${augmentations.length})`);
}

// Zero is not "nothing to do" — the augmentations exist in src, so zero means
// the dts step changed shape and this script is now looking in the wrong place.
// Failing the build is the point: the alternative is shipping broken types
// again, which is invisible until a consumer tries to pass a config prop.
if (inlined === 0) {
  throw new Error(
    'inline-dts-augmentations: found no relative `declare module` blocks in dist/**/*.d.ts. ' +
      'Either the dts bundler now resolves them itself (then delete this script and its guard ' +
      'test) or the output moved (then fix the path). Not shipping unverified types — see ' +
      'PLTFRM-93014.'
  );
}

console.log(
  `inline-dts-augmentations: inlined ${inlined} block(s) — ${touched.join(', ')}`
);
