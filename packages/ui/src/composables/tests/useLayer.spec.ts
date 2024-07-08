import { describe, expect, it } from 'vitest';
import { toRef } from 'vue';
import { useLayer } from '@/composables/useLayer';

describe('useLayer', () => {
  it('applies default styles and classes for text variant without states', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('blue'),
      propVariant: toRef('light'),
      propStates: toRef(false)
    });
    expect(layerClasses.value).toMatchInlineSnapshot(`
      [
        "acv-layer",
        "light",
        "blue",
        "acv-text-blue",
      ]
    `);
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "var(--acv-color-blue)",
        },
      ]
    `);
  });

  it('applies solid variant styles and classes correctly', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('red'),
      propVariant: toRef('solid'),
      propStates: toRef(true)
    });
    expect(layerClasses.value).toMatchInlineSnapshot(`
      [
        "acv-layer",
        "solid",
        "with-states",
        "red",
        "acv-text-color-white",
        "acv-text-color-red",
      ]
    `);
    // expect(layerClasses.value).toContain('acv-text-color-red');
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "var(--acv-color-red)",
        },
        {
          "background": "var(--acv-layer-color)",
          "color": "var(--acv-color-red-text, var(--acv-color-white))",
        },
      ]
    `); // Background and color styles
    expect(layerStyles.value).toHaveLength(2); // Background and color styles
  });

  it('handles inherit color correctly for outline variant', () => {
    const { layerClasses } = useLayer({
      propColor: toRef('inherit'),
      propVariant: toRef('outline'),
      propStates: toRef(true)
    });
    expect(layerClasses.value).toMatchInlineSnapshot(`
      [
        "acv-layer",
        "outline",
        "with-states",
        "text-inherit",
        "acv-border-width-regular",
        "acv-border-style-solid",
        "acv-border-color-current",
      ]
    `);
  });

  it('generates ghost variant styles with custom color', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('#ff00ff'),
      propVariant: toRef('ghost'),
      propStates: toRef(true)
    });
    expect(layerClasses.value).toContain('ghost');
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "300, 100%, 50%",
        },
        {
          "color": "var(--acv-layer-background-color)",
        },
      ]
    `);
  });

  it('applies default styles and classes for text variant without states 2', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('blue'),
      propVariant: toRef('light'),
      propStates: toRef(false)
    });
    expect(layerClasses.value).toContain('blue');
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "var(--acv-color-blue)",
        },
      ]
    `);
  });

  it('applies solid variant styles and classes correctly 2', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('red'),
      propVariant: toRef('solid'),
      propStates: toRef(true)
    });
    expect(layerClasses.value).toContain('solid');
    expect(layerClasses.value).toContain('acv-text-color-red');
    expect(layerStyles.value).toHaveLength(2); // Background and color styles
  });

  it('handles inherit color correctly for outline variant 2', () => {
    const { layerClasses } = useLayer({
      propColor: toRef('inherit'),
      propVariant: toRef('outline'),
      propStates: toRef(true)
    });
    expect(layerClasses.value).toContain('acv-border-width-regular');
    expect(layerClasses.value).toContain('acv-border-style-solid');
    expect(layerClasses.value).toContain('acv-border-color-current');
  });

  it('generates ghost variant styles with custom color 2', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('#ff00ff'),
      propVariant: toRef('ghost'),
      propStates: toRef(true)
    });
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "300, 100%, 50%",
        },
        {
          "color": "var(--acv-layer-background-color)",
        },
      ]
    `);
    expect(layerClasses.value).toContain('ghost');
  });

  it('applies default styles and classes for text variant without states 3', () => {
    const { layerClasses, layerStyles } = useLayer({
      propColor: toRef('blue'),
      propVariant: toRef('light'),
      propStates: toRef(false)
    });
    expect(layerClasses.value).toContain('acv-text-blue');
    expect(layerStyles.value).toMatchInlineSnapshot(`
      [
        {
          "--acv-layer-color": "var(--acv-color-blue)",
        },
      ]
    `);
  });
});
