---
title: Card component
lang: en-US
editLink: true
---

# Card

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

### Border Colors

<CardBorder />

::: details
<<< @/demos/card/CardBorder.vue
:::

### Background Colors

<CardBackground />

::: details
<<< @/demos/card/CardBackground.vue
:::

## Props

| Prop name       | Description                  | Type   | Values | Default |
| --------------- | ---------------------------- | ------ | ------ | ------- |
| backgroundColor | Background color of the card | union  | -      |         |
| borderColor     | Border color of the card     | string | -      |         |
| textColor       | Text color of the card       | string | -      |         |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| close      |            |             |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
