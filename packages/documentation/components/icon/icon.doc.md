---
title: Icon component
lang: en-US
editLink: true
---

# Icon

Basic sizes, rules for building and using icons. Work with the terminal and Gulp tasks. Icons can be outline or bold, it all depends on the specific case. But, in most cases, they use outline icons.

:::info Figma mockups
https://www.figma.com/file/YDRlEkpDc1qcapabYuK5ID/Glyphs?node-id=0%3A1
:::

## Usage

```javascript
import { Icon } from "@acronis-platform/vue";
// or
import Icon from "@acronis-platform/components/Icon/Icon.vue";
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
import { cog } from "@acronis-platform/icons/acronis";
```

If your tooling does not support tree-shaking, you can import the icons directly from the package:

```javascript
// Tree-shaking deep import example
import { cog } from "@acronis-platform/icons/acronis/cog";
```

## Props

| Prop name      | Description                                          | Type     | Values                                           | Default   |
| -------------- | ---------------------------------------------------- | -------- | ------------------------------------------------ | --------- |
| name           | Name of icon (e.g. `check` or `i-check--16`)         | string   | -                                                |           |
| collection     | Name of collection (e.g. `acronis` or `constructor`) | string   | -                                                | 'acronis' |
| state          | Name of state icon (e.g. `i-state-upload-d--16`)     | string   | -                                                |           |
| title          | Title of the icon                                    | string   | -                                                |           |
| fill           | Fill of the icon                                     | string   | -                                                |           |
| scale          | Scale of the icon                                    | number   | -                                                | 1         |
| animation      | Animation of the icon                                | string   | 'spin', 'pulse', 'bounce', 'flash', 'rubberBand' | ''        |
| animateOnHover | Animate of the icon                                  | boolean  | -                                                |           |
| animationSpeed | Animation speed of the icon                          | union    | -                                                | 1         |
| size           | Size of the icon                                     | union    | 16, 24, 32, 48, 64, 72, 96                       | 16        |
| flip           | Flip of the icon                                     | union    | -                                                |           |
| color          | Color of the icon                                    | union    | -                                                |           |
| stateColor     | Color of the state icon                              | Color    | -                                                |           |
| disabled       | Icon is disabled                                     | boolean  | -                                                | false     |
| inverse        | Icon is inverted                                     | boolean  | -                                                | false     |
| icon           |                                                      | IconProp | -                                                |           |

## Events

| Event name | Properties                                | Description                            |
| ---------- | ----------------------------------------- | -------------------------------------- |
| close      | **payload** `string` - The first argument | Triggered when the component is closed |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
