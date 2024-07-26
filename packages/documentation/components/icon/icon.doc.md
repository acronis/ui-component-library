---
title: Icon component
lang: en-US
editLink: true
---

# Icon

Basic sizes, rules for building and using icons.
Icons can be outlined or bold, it all depends on the specific case.
But, in most cases, we use outline icons.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=206-385&m=dev
:::

## Usage

<IconExample />

<<< @/demos/icon/IconExample.vue

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
<<< @/demos/icon/IconBasic.vue
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

<<< @/demos/icon/IconTreeShaking.vue

## Props

| Prop name      | Description                                          | Type                                                   | Values                                           | Default   |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ | --------- |
| name           | Name of icon (e.g. `check` or `i-check--16`)         | string                                                 | -                                                |           |
| collection     | Name of collection (e.g. `acronis` or `constructor`) | string                                                 | -                                                | 'acronis' |
| state          | Name of state icon (e.g. `i-state-upload-d--16`)     | string                                                 | -                                                |           |
| title          | Title of the icon                                    | string                                                 | -                                                |           |
| fill           | Fill of the icon                                     | string                                                 | -                                                |           |
| scale          | Scale of the icon                                    | number                                                 | -                                                | 1         |
| animation      | Animation of the icon                                | string                                                 | 'spin', 'pulse', 'bounce', 'flash', 'rubberBand' | ''        |
| animateOnHover | Animate of the icon                                  | boolean                                                | -                                                |           |
| animationSpeed | Animation speed of the icon                          | "fast" \| "slow" \| "slower" \| "fastest" \| "slowest" | -                                                | 1         |
| size           | Size of the icon                                     | string \| number                                       | 16, 24, 32, 48, 64, 72, 96                       | 16        |
| flip           | Flip of the icon                                     | "horizontal" \| "vertical" \| "both"                   | -                                                |           |
| color          | Color of the icon                                    | Color \| Array                                         | -                                                |           |
| stateColor     | Color of the state icon                              | Color                                                  | -                                                |           |
| disabled       | Icon is disabled                                     | boolean                                                | -                                                | false     |
| inverse        | Icon is inverted                                     | boolean                                                | -                                                | false     |
| icon           |                                                      | IconProp                                               | -                                                |           |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
