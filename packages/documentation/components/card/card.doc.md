---
title: ACV Card component
lang: en-US
editLink: true
---

# ACV Card

Used to group information into logical blocks.
Any content (text blocks, form elements, buttons, collapses, icons, and illustrations) can be located inside the card.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=587-56795
:::

## Basic usage

<CardBasic />

::: details Source code
<<< @/demos/card/CardBasic.vue
:::

## Variants

<CardVariants />

### Border Colors

<CardBorders />

::: details
<<< @/demos/card/CardBorders.vue
:::

### Background Colors

<CardBackground />

::: details
<<< @/demos/card/CardBackground.vue
:::

## Props

| Prop name       | Description                                          | Type         | Values                                                                    | Default |
| --------------- | ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------- | ------- |
| states          | Interaction states like hover & active               | boolean      | -                                                                         | false   |
| variant         | Layer variant                                        | LayerVariant | 'solid' \| 'outline' \| 'ghost' \| 'light'                                | 'solid' |
| color           | Background color                                     | ColorProp    | transparent, primary, secondary, success, warning, danger, info, inverted |         |
| backgroundColor | Layer background color                               | ColorProp    | -                                                                         |         |
| borderColor     | Layer border color                                   | ColorProp    | -                                                                         |         |
| textColor       | Layer text color                                     | ColorProp    | -                                                                         |         |
| shadow          | Whether the card should have a shadow                | boolean      | -                                                                         | true    |
| round           |                                                      | boolean      | -                                                                         | true    |
| border          |                                                      | boolean      | -                                                                         | true    |
| padding         |                                                      | boolean      | -                                                                         | true    |
| img             | Render image at the top of the card (_above header_) | string       | -                                                                         |         |
| imgAlt          | `alt` attribute for image rendered via `img` prop    | string       | -                                                                         |         |
| loading         | Set loading state                                    | boolean      | -                                                                         |         |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| close      |            |             |

## Slots

| Name    | Description              | Bindings |
| ------- | ------------------------ | -------- |
| loading |                          |          |
| default | The default slot content |          |
