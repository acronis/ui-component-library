Basic sizes, rules for building and using icons. Work with the terminal and Gulp tasks. Icons can be outline or bold, it all depends on the specific case. But, in most cases, they use outline icons.

:::info Figma mockups
https://www.figma.com/file/YDRlEkpDc1qcapabYuK5ID/Glyphs?node-id=0%3A1
:::

## Usage

```javascript
import { Icon } from '@acronis-platform/vue';
// or
import Icon from '@acronis-platform/components/Icon/Icon.vue';
```

## Basic usage

All icons in UI Kit will, henceforth, be implemented as SVG icons.

:::tip
The naming convention

- `acv-icon` - the base class for the icon
- `acv-icon--size` - the size of the icon
- `acv-icon--color` - the color of the icon
- `acv-icon--bold` - the bold icon
:::

<IconBasic />

::: details Source code
<<< @/demos/icons/IconBasic.vue
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

```javascript
// Tree-shaking import
import { cog } from '@acronis-platform/icons/acronis';
```

If your tooling does not support tree-shaking, you can import the icons directly from the package:

```javascript
// Tree-shaking deep import example
import { cog } from '@acronis-platform/icons/acronis/cog';
```
