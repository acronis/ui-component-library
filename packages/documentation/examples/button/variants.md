# Button

## Variants

Button supports the several predefined types, for different semantic purposes.
Use the `variant` prop to set the variant of the button.
By default, the button is rendered as a solid primary button.

There are 4 variant types available: `solid`, `outline`, `ghost` and `light`.

There are 5 variant color patterns available: `primary`, `secondary`, `success`, `danger`, `warning`, `info` and `inverted` for the dark surfaces.

### Solid

`solid` is a default variant for button.

Button with a solid variant is a button with a solid background color.

Use the `variant` prop to set the variant of the button.

<ButtonVariantSolid />

### Outline

Button with an outline variant is a button with a border and transparent background.
You can use `variant="outline"` to create outlined button.

:::details Customize `border-style` of outlined buttons
To create outlined button with different border style just add relevant class.

e.g. To create outline button with dashed border, add `acv-border-style-dashed` class.
:::

<ButtonVariantOutline />

### Ghost

You can use `variant="ghost"` to create button with a transparent background and without a border.

<ButtonVariantGhost />

### Light

You can use `variant="light"` Button with light semi-opaque background color.

<ButtonVariantLight />
