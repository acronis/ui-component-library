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

const snapshotWith = (components) => ({
  variables: { brand: { components } },
});

const leaf = (over) => ({
  $type: 'dimension',
  $value: '{gap.gap-0}',
  $extensions: { 'com.figma.variableId': 'VariableID:1', ...over.$extensions },
  ...over,
});

const emitterFor = (components) =>
  new ComponentsEmitter(snapshotWith(components), {
    components: Object.keys(components),
    primitives: { units: { gap: { 0: { $value: { value: 0, unit: 'px' } } } } },
    semantics: {},
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
});
