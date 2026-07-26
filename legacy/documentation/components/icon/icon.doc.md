Basic sizes, rules for building and using icons.
Icons can be outlined or bold, it all depends on the specific case.
But, in most cases, we use outline icons.

## Usage

<IconExample />

<<< ../../../examples/demos/icon/IconExample.vue

## Basic usage

All icons in Acronis UI Component Library will, henceforth, be implemented as SVG icons.

:::tip
The naming convention

- `acv-icon` - the base class for the icon
- `acv-icon--size` - the size of the icon
- `acv-icon--color` - the color of the icon
- `acv-icon--bold` - the bold icon

:::

<IconBasic />

::: details Source code
<<< ../../../examples/demos/icon/IconBasic.vue
:::

## Monochrome icons

<IconMonochrome />

## States

<IconStates />

## Disabled

<IconDisabled />

## Sizes

<IconSizes />

## Alignment

<IconAlignment />

## Multicolor icons

<IconMulticolor />

## Tree-shaking

The icons are tree-shakable, so only the icons that are used in the project will be included in the final bundle.

<<< ../../../examples/demos/icon/IconTreeShaking.vue
