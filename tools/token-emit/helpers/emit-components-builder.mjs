// tools/token-emit/helpers/emit-components-builder.mjs
// Builds tiers/components.json from a normalized figma-snapshot.json.
// Filters by a COMPONENTS allowlist, maps PascalCase component names to
// camelCase keys, and preserves hand-authored $extensions.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TreeUtils } from './utils-tree.mjs';
import { DtcgFormatter } from './utils-dtcg-formatter.mjs';
import { AliasTranslator } from './emit-alias-translator.mjs';

// A Figma name segment that survives into a CSS ident (custom property or class).
// Anything else — a space above all — makes the declaration unparseable.
const CSS_SAFE_SEGMENT = /^[A-Za-z0-9_-]+$/;

// Figma "units" collection sections → our `units.<section>` group.
const UNIT_SECTIONS = new Set(['gap', 'size', 'radius', 'stroke']);

const OUT_PATH = fileURLToPath(
  new URL('../../../packages/tokens/tiers/components.json', import.meta.url)
);
const PRIMITIVES_PATH = fileURLToPath(
  new URL('../../../packages/tokens/tiers/primitives.json', import.meta.url)
);
const SEMANTICS_PATH = fileURLToPath(
  new URL('../../../packages/tokens/tiers/semantics.json', import.meta.url)
);

// Full component list from the snapshot — kept as a reference for callers
// that want to pass an explicit subset. The default is null (= emit everything).
export const DEFAULT_COMPONENTS = [
  'AlertRibbon',
  'Avatar',
  'Breadcrumb',
  'Button',
  'ButtonGroup',
  'ButtonIcon',
  'ButtonIconInput',
  'ButtonMenu',
  'Calendar',
  'CardFilter',
  'Carousel',
  'Chat',
  'Checkbox',
  'Chip',
  'Dialog',
  'Footer',
  'InputDatePicker',
  'InputOTP',
  'InputPassword',
  'InputSearch',
  'InputSelect',
  'InputText',
  'InputTextArea',
  'Link',
  'Loading',
  'Notification',
  'Popover',
  'Radio',
  'Resizable',
  'SegmentControl',
  'SidebarPrimary',
  'SidebarSecondary',
  'Switch',
  'Table',
  'Tag',
  'Timeline',
  'Timer',
  'Toast',
  'Tooltip',
];

// No case transformation: Figma segment names are preserved exactly as-is.
// Components and SubComponents are PascalCase in Figma; everything else is camelCase.
// The emitter must not change casing at any level.

export class ComponentsEmitter {
  #snapshot;
  #primitives;
  #semantics;
  #allowlist;
  #aliasTranslator;
  #validTypoRefs; // Set<string> of known "{typography.G.N}" refs
  #typoFallback; // Map<dottedLeaf, canonicalRef> for hyphen-as-dot mismatches
  #effectStyleNames; // Set<string> of the file's effect-style names (shadow-sm/md/lg)
  #seenWarnings; // Set<string> so one defect reported across N modes warns once

  // `primitives`/`semantics` are injectable for tests; entry scripts pass nothing
  // and they read the committed tiers (alias-resolution + typography sources).
  constructor(
    snapshot,
    { components = DEFAULT_COMPONENTS, primitives, semantics } = {}
  ) {
    this.#snapshot = snapshot;
    this.#primitives =
      primitives ?? JSON.parse(fs.readFileSync(PRIMITIVES_PATH, 'utf8'));
    this.#semantics =
      semantics ?? JSON.parse(fs.readFileSync(SEMANTICS_PATH, 'utf8'));
    this.#allowlist = new Set(components);
    /** Source-data problems worth a human's attention, printed by the entry script. */
    this.warnings = [];
    /** Dedupe key set: a per-mode defect is ONE source problem, not seven. */
    this.#seenWarnings = new Set();
    this.#aliasTranslator = new AliasTranslator(this.#primitives);
    this.#buildTypoIndex();
    // Figma has no shadow variable type, so an effect style can only be
    // referenced by NAME from a string variable. Knowing the names lets the
    // emitter tell such a pointer apart from a real string value (`solid`,
    // `underline`, `tabular-nums`, …) — see #rejectNonValue.
    this.#effectStyleNames = new Set(
      (snapshot.styles?.effect ?? []).map((s) => s.name)
    );
  }

  /**
   * Pure: build the components tier from the snapshot's allowlisted components
   * (no I/O). `prev` supplies the hand-authored `$extensions` to preserve.
   * Testable in isolation; `emit()` wraps it with the file read/write.
   */
  build(prev = {}) {
    const out = { $schema: '../schemas/tier.schema.json' };
    // Preserve hand-authored $extensions (e.g. com.acronis.tailwindRoles).
    if (prev.$extensions) out.$extensions = prev.$extensions;

    const componentsNode = this.#snapshot.variables?.brand?.components;
    if (!componentsNode)
      throw new Error('Snapshot missing brand.components subtree.');

    for (const [figmaName, subtree] of Object.entries(componentsNode)) {
      if (figmaName.startsWith('$')) continue;
      if (!this.#allowlist.has(figmaName)) continue;

      out[figmaName] = this.#emitComponent(figmaName, subtree);
    }

    // Attach the hand-authored $extensions before sorting so its key lands in
    // alphabetical position, then restore its content verbatim afterwards
    // (sortNode would otherwise reorder its hand-curated internals).
    if (prev.$extensions) out.$extensions = prev.$extensions;
    const root = TreeUtils.sortNode(out);
    if (prev.$extensions) root.$extensions = prev.$extensions;
    return root;
  }

  emit() {
    const prev = fs.existsSync(OUT_PATH)
      ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'))
      : {};
    const root = this.build(prev);
    fs.writeFileSync(OUT_PATH, DtcgFormatter.serialize(root));
    return root;
  }

  get outputPath() {
    return OUT_PATH;
  }

  #emitComponent(figmaName, subtree) {
    const result = {};
    this.#walk(subtree, result, 0, [figmaName]);
    return result;
  }

  #walk(node, out, depth = 0, path = []) {
    if (!node || typeof node !== 'object') return;

    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (!v || typeof v !== 'object') continue;

      // A Figma variable name has to survive into a CSS custom-property name.
      // One containing a space — typically a duplicate Figma made for you, like
      // `gap 2` — becomes `--ui-…-gap 2`, which postcss cannot parse; that
      // failure is not scoped to the token or even its file, it fails the whole
      // stylesheet. The CSS builder skips such names, but by then the signal is
      // buried in a build log, so surface it HERE, at the pull, where the fix
      // (rename or delete it in Figma) actually lives.
      if (!CSS_SAFE_SEGMENT.test(k)) {
        this.#warn(
          `${[...path, k].join('/')} — name is not CSS-safe; it will be dropped from the CSS output`
        );
      }

      if ('$value' in v || '$extensions' in v) {
        // Leaf token. Figma segment names are already camelCase — use as-is.
        // A leaf whose every value is a pointer into Figma rather than a value
        // yields nothing renderable, so it is left out entirely (see
        // #rejectNonValue) instead of emitted as a dead custom property.
        const built = this.#buildLeaf(v, [...path, k].join('/'));
        if (built !== undefined) out[k] = built;
      } else {
        // Group. Figma segment names are already camelCase — use as-is.
        out[k] = {};
        this.#walk(v, out[k], depth + 1, [...path, k]);
      }
    }
  }

  #buildLeaf(leaf, path = '') {
    const value = this.#rejectNonValue(this.#translateValue(leaf.$value), path);

    const token = {};
    if (leaf.$type) token.$type = leaf.$type;

    // Build extensions.
    const ext = {};
    const figmaExt = leaf.$extensions?.['figma-console-mcp'] ?? {};
    const cleanExt = leaf.$extensions ?? {};
    const id = figmaExt.variableId ?? cleanExt['com.figma.variableId'];
    if (id) ext['com.figma.variableId'] = id;

    const scopes = cleanExt['com.figma.scopes'] ?? figmaExt.scopes;
    if (scopes) ext['com.figma.scopes'] = scopes;
    if (cleanExt['com.figma.hiddenFromPublishing'])
      ext['com.figma.hiddenFromPublishing'] = true;

    // Multi-mode values.
    const modes = cleanExt.modes ?? {};
    const lastSynced = figmaExt.lastSyncedValue ?? {};
    const allModes = { ...modes };
    for (const [modeKey, modeData] of Object.entries(lastSynced)) {
      if ('reference' in modeData) allModes[modeKey] = modeData.reference;
      else if ('literal' in modeData) allModes[modeKey] = modeData.literal;
    }

    if (Object.keys(allModes).length > 0) {
      const translatedValues = {};
      for (const [modeKey, modeRef] of Object.entries(allModes)) {
        // kebab-case per schema `Modes` pattern; fold spaces and underscores.
        const normalizedKey = modeKey.toLowerCase().replace(/[\s_]+/g, '-');
        const normalized = this.#rejectNonValue(
          this.#normalizeModeValue(this.#translateValue(modeRef), leaf.$type),
          path
        );
        // A dropped mode must not leave an `undefined` hole: the schema requires
        // exactly one value carrier, and an empty `values` with no `$value`
        // would satisfy neither.
        if (normalized !== undefined)
          translatedValues[normalizedKey] = normalized;
      }
      if (Object.keys(translatedValues).length > 0)
        token.values = translatedValues;
    }

    // A leaf carries exactly one value carrier: per-mode `values` (the brand
    // axis) when modes exist, else a single `$value`. Figma exports both a
    // default `$value` and a `modes` map, so prefer `values` and drop the
    // redundant `$value` to satisfy the schema's one-carrier rule.
    if (!token.values) {
      // Every value was rejected — there is no token to emit. Returning it with
      // `$value: undefined` would serialize a carrier-less token that fails ajv.
      if (value === undefined) return undefined;
      token.$value = value;
    }

    // A token whose value references a typography composite is itself typography
    // (Figma stores it in a string Variable, so its source $type is "string").
    // Correct it so the CSS builder emits a `.typography-*` utility class.
    const sample = token.values ? Object.values(token.values)[0] : token.$value;
    if (typeof sample === 'string' && sample.startsWith('{typography.'))
      token.$type = 'typography';

    token.platforms = ['PD'];
    if (Object.keys(ext).length > 0) token.$extensions = ext;
    return token;
  }

  /**
   * Bring a per-mode value into the shape the downstream CSS transforms expect.
   *
   * Figma hands a brand mode a **bare number** where the default mode has an
   * alias — `{ default: '{gap.gap-0}', deep_sky_itkontoret: 0 }`. Left alone it
   * reached `dimension/px`, which reads `.value` / `.unit` off it and rendered
   * the string `undefinedundefined`: a silently wrong value that passes ajv, the
   * build, and every test. A dimension's bare number is px, so give it the DTCG
   * `{ value, unit }` form the primitives already use. Any other type carrying a
   * number is not something we can guess at, so it is reported and dropped
   * rather than guessed.
   */
  #normalizeModeValue(value, $type) {
    if (typeof value !== 'number') return value;
    if ($type === 'dimension') return { value, unit: 'px' };
    this.#warn(
      `a ${$type ?? 'untyped'} token has the bare number ${value} in one mode — dropped (only dimensions can be read as px)`
    );
    return undefined;
  }

  /**
   * Reject a value that is a *pointer to something in Figma* rather than a value
   * this pipeline can render. Figma has no shadow or text-style variable type, so
   * designers express those bindings as STRING variables holding a name — and a
   * name is not a CSS value:
   *
   *   - `shadow-md` names an effect style. Emitted verbatim it became
   *     `--ui-toast-global-container-shadow: shadow-md`: a dead custom property
   *     that reads like a bound shadow. The shadow itself is bridged from the
   *     `palette.shadow.*` primitives instead (see the Tailwind bridge).
   *   - `Assets/CircleInfoBlue` names an exported asset (an icon instance).
   *   - `{typography.body.heading}` is a text-style hint that resolves to NO
   *     semantics token — a typo in the Figma variable. Emitting it produced a
   *     dangling alias, so the style silently vanished from the output instead of
   *     anyone hearing about it.
   *
   * Legitimate string values — `solid`, `underline`, `none`, `tabular-nums`,
   * `space-between`, `ew-resize` — are values, not pointers, and pass through.
   */
  /** Record a source problem once, however many modes carry it. */
  #warn(message) {
    if (this.#seenWarnings.has(message)) return;
    this.#seenWarnings.add(message);
    this.warnings.push(message);
  }

  #rejectNonValue(value, path) {
    if (typeof value !== 'string') return value;

    if (this.#effectStyleNames.has(value)) {
      this.#warn(
        `${path} — value "${value}" names a Figma effect style, not a CSS value; dropped (bind the palette.shadow.* primitives instead)`
      );
      return undefined;
    }

    if (value.startsWith('Assets/')) {
      this.#warn(
        `${path} — value "${value}" names a Figma asset, not a CSS value; dropped (icons are supplied by the component)`
      );
      return undefined;
    }

    if (value.startsWith('{typography.') && !this.#validTypoRefs.has(value)) {
      this.#warn(
        `${path} — text-style hint "${value.slice(1, -1)}" matches no semantics typography token; dropped (fix the hint in Figma)`
      );
      return undefined;
    }

    return value;
  }

  // Translate a single component value to our alias/literal form:
  //   "{semantics.colors.text.onSurface.primary}" → "{colors.text.onSurface.primary}"
  //   "{components.Button._global.container.radius}" → "{Button._global.container.radius}"
  //   "{gap.gap-4}" / "{stroke.width-1}"          → "{units.gap.4}" / "{units.stroke.1}"
  //   "{Base}" / "{Blue.Blue-3}"                   → palette ref (via AliasTranslator)
  //   "typography.link.default" / "body.accent"    → "{typography.link.default}" / "{typography.body.accent}"
  //   "underline" / "none" / "solid"               → kept verbatim (enum literal)
  #translateValue(value) {
    // Transparent rule: a fully-transparent literal color (alpha 0) becomes the
    // CSS keyword `transparent` — its RGB channels are meaningless.
    if (value && typeof value === 'object' && value.alpha === 0)
      return 'transparent';
    if (typeof value !== 'string') return value;
    if (value.startsWith('{')) return this.#translateAlias(value);
    // A bare dotted string is a typography reference; a bare word is an enum literal.
    if (value.includes('.')) {
      if (value.startsWith('typography.')) {
        const directRef = `{${value}}`;
        if (this.#validTypoRefs.has(directRef)) return directRef;
        // Figma variable bindings sometimes store the leaf name with hyphens
        // replaced by dots and the group prefix dropped (e.g. the style
        // "headings/title-accent" → "typography.title.accent"). Use the
        // dotted-leaf index to find the canonical path.
        const path = value.slice('typography.'.length);
        return this.#typoFallback.get(path) ?? directRef;
      }
      return `{typography.${value}}`;
    }
    return value;
  }

  #buildTypoIndex() {
    this.#validTypoRefs = new Set();
    this.#typoFallback = new Map();
    const typo = this.#semantics.typography ?? {};
    for (const [group, sub] of Object.entries(typo)) {
      if (group.startsWith('$') || typeof sub !== 'object') continue;
      for (const [name, leaf] of Object.entries(sub)) {
        if (name.startsWith('$') || !leaf || typeof leaf !== 'object') continue;
        const fullRef = `{typography.${group}.${name}}`;
        this.#validTypoRefs.add(fullRef);
        // Index names that contain hyphens under their dotted form so that
        // "typography.title.accent" resolves to "{typography.headings.title-accent}".
        const dottedLeaf = name.replace(/-/g, '.');
        if (dottedLeaf !== name) this.#typoFallback.set(dottedLeaf, fullRef);
      }
    }
  }

  #translateAlias(alias) {
    // Semantic / component self references: strip the redundant tier prefix.
    const prefixed = alias.match(
      /^\{(?:brand\.)?(semantics|components)\.(.+)\}$/
    );
    if (prefixed) return `{${prefixed[2].replace(/\s+/g, '-')}}`;

    const inner = alias.slice(1, -1);
    const section = inner.split('.')[0];

    // Units: "{gap.gap-4}" → "{units.gap.4}" (strip the section-name key prefix).
    if (UNIT_SECTIONS.has(section)) {
      const rest = inner.slice(section.length + 1);
      const key = rest.replace(/^[^-]+-/, '');
      return `{units.${section}.${key}}`;
    }

    // Orphan/library + palette references go through the shared translator.
    try {
      return this.#aliasTranslator.translate(alias);
    } catch {
      return alias;
    }
  }
}
