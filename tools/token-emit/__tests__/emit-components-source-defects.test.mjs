import { describe, expect, it } from 'vitest';

import { ComponentsEmitter } from '../helpers/emit-components-builder.mjs';

// The emitter's behaviour on MALFORMED Figma source. Both cases below are real:
// the `Notification` collection carries two duplicate variables (`content/gap 2`,
// `success/icon 2`) whose names contain a space, and Figma gives the first a bare
// number in every brand mode while the default mode holds an alias.
//
// Neither is a repo bug to fix in code — they are Figma fixes — but the pipeline
// must not translate them into a silently wrong value or an unparseable
// stylesheet, and it must say so where someone can act on it.

const snapshotWith = (components, effect = [{ name: 'shadow-md' }]) => ({
  variables: { brand: { components } },
  styles: { effect },
});

const leaf = (over) => ({
  $type: 'dimension',
  $value: '{gap.gap-0}',
  $extensions: { 'com.figma.variableId': 'VariableID:1', ...over.$extensions },
  ...over,
});

const emitterFor = (components, semantics = {}) =>
  new ComponentsEmitter(snapshotWith(components), {
    components: Object.keys(components),
    primitives: { units: { gap: { 0: { $value: { value: 0, unit: 'px' } } } } },
    semantics,
  });

describe('emit — malformed Figma source', () => {
  it('normalizes a bare number in a dimension mode to DTCG px', () => {
    // Before: the number reached `dimension/px`, which read `.value`/`.unit` off
    // it and rendered the string `undefinedundefined` — wrong, and invisible to
    // ajv, the build and the tests.
    const emitter = emitterFor({
      Widget: {
        gap: leaf({
          $extensions: {
            'com.figma.variableId': 'VariableID:1',
            modes: { default: '{gap.gap-0}', telstra: 0 },
          },
        }),
      },
    });
    const out = emitter.build({});
    expect(out.Widget.gap.values).toEqual({
      default: '{units.gap.0}',
      telstra: { value: 0, unit: 'px' },
    });
    expect(emitter.warnings).toEqual([]);
  });

  it('drops — and reports — a bare number on a non-dimension token', () => {
    const emitter = emitterFor({
      Widget: {
        label: leaf({
          $type: 'string',
          $value: 'x',
          $extensions: {
            'com.figma.variableId': 'VariableID:2',
            modes: { default: 'x', telstra: 7 },
          },
        }),
      },
    });
    const out = emitter.build({});
    // The surviving mode keeps the token valid: the schema demands exactly one
    // value carrier, so a hole here would break validation.
    expect(out.Widget.label.values).toEqual({ default: 'x' });
    expect(emitter.warnings).toHaveLength(1);
    expect(emitter.warnings[0]).toContain('bare number 7');
  });

  it('warns at the pull about a name that cannot become a CSS ident', () => {
    const emitter = emitterFor({
      Notification: { content: { 'gap 2': leaf({}) } },
    });
    emitter.build({});
    expect(emitter.warnings).toEqual([
      'Notification/content/gap 2 — name is not CSS-safe; it will be dropped from the CSS output',
    ]);
  });

  it('says nothing for well-formed source', () => {
    const emitter = emitterFor({ Widget: { gap: leaf({}) } });
    emitter.build({});
    expect(emitter.warnings).toEqual([]);
  });

  it('reports a per-mode defect once, not once per mode', () => {
    // Seven brands carrying the same broken value is ONE thing to fix in Figma.
    const emitter = emitterFor({
      Widget: {
        shadow: leaf({
          $type: 'string',
          $value: 'shadow-md',
          $extensions: {
            'com.figma.variableId': 'VariableID:9',
            modes: {
              default: 'shadow-md',
              telstra: 'shadow-md',
              virtuozzo: 'shadow-md',
            },
          },
        }),
      },
    });
    emitter.build({});
    expect(emitter.warnings).toHaveLength(1);
  });
});

// Figma has no shadow or text-style variable type, so those bindings are STRING
// variables holding a NAME. A name is a pointer into Figma, not a CSS value, and
// emitting it verbatim produced a custom property that looks bound and does
// nothing (`--ui-toast-…-shadow: shadow-md`).
describe('emit — values that are pointers, not values', () => {
  it('drops a string that names an effect style, and the token with it', () => {
    const emitter = emitterFor({
      Widget: {
        shadow: leaf({ $type: 'string', $value: 'shadow-md', $extensions: {} }),
      },
    });
    const out = emitter.build({});
    expect(out.Widget.shadow).toBeUndefined();
    expect(emitter.warnings[0]).toContain('names a Figma effect style');
  });

  it('drops a string that names an exported asset', () => {
    const emitter = emitterFor({
      Widget: {
        icon: leaf({
          $type: 'string',
          $value: 'Assets/CircleInfoBlue',
          $extensions: {},
        }),
      },
    });
    const out = emitter.build({});
    expect(out.Widget.icon).toBeUndefined();
    expect(emitter.warnings[0]).toContain('names a Figma asset');
  });

  it('drops a text-style hint that resolves to no semantics token', () => {
    // The real case: `typography.body.heading` was typed into two Figma
    // variables, but the token is `typography.headings.heading`. Emitting the
    // hint verbatim produced a dangling alias, so the title's text style
    // silently disappeared from the CSS instead of anyone being told.
    const emitter = emitterFor(
      {
        Widget: {
          textStyle: leaf({
            $type: 'string',
            $value: 'typography.body.heading',
            $extensions: {},
          }),
        },
      },
      { typography: { headings: { heading: { $value: {} } } } }
    );
    const out = emitter.build({});
    expect(out.Widget.textStyle).toBeUndefined();
    expect(emitter.warnings[0]).toContain('matches no semantics typography');
  });

  it('keeps a text-style hint that does resolve', () => {
    const emitter = emitterFor(
      {
        Widget: {
          textStyle: leaf({
            $type: 'string',
            $value: 'typography.headings.heading',
            $extensions: {},
          }),
        },
      },
      { typography: { headings: { heading: { $value: {} } } } }
    );
    const out = emitter.build({});
    expect(out.Widget.textStyle.$value).toBe('{typography.headings.heading}');
    expect(out.Widget.textStyle.$type).toBe('typography');
    expect(emitter.warnings).toEqual([]);
  });

  it('keeps real string values — they are values, not pointers', () => {
    // `solid`, `underline`, `tabular-nums`, `space-between`, `ew-resize` are all
    // live in the tier today; a blanket "drop strings" rule would break them.
    const strings = [
      'solid',
      'underline',
      'tabular-nums',
      'space-between',
      'ew-resize',
    ];
    const emitter = emitterFor({
      Widget: Object.fromEntries(
        strings.map((v, i) => [
          `k${i}`,
          leaf({ $type: 'string', $value: v, $extensions: {} }),
        ])
      ),
    });
    const out = emitter.build({});
    expect(strings.map((_, i) => out.Widget[`k${i}`].$value)).toEqual(strings);
    expect(emitter.warnings).toEqual([]);
  });
});
