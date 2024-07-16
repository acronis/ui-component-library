---
title: Acv Divider component
lang: en-US
editLink: true
---

# Acv Divider

Used to group content in horizontal or vertical lists,
and also serves as a visual separator between logical blocks within the interface.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=123-8541
:::

## Basic usage

<DividerBasic />

::: details Source code
<<< @/demos/divider/DividerBasic.vue
:::

## With text

You can place text into default dividers slot and use `text-position` property
to align it in a _center_, _left_ or _right_ position.

<DividerVariants />

## Colors

You can use `color` property to highlight the divider with a specific color.

<DividerColors />

## On backgrounds

<DividerBackground />

## Accessibility

Separators must be ignored by the screenreader.
To achieve this, use `aria-hidden="true"` attribute.

It must provide `role=separator` that indicates the element is a divider that
separates and distinguishes sections of content or groups of elements.

Optionally, you can provide `aria-orientation` attribute to describe the separator direction.

## Props

| Prop name    | Description                         | Type                      | Values                                                                    | Default |
| ------------ | ----------------------------------- | ------------------------- | ------------------------------------------------------------------------- | ------- |
| vertical     | Orientation of the Divider          | boolean                   | -                                                                         |         |
| textPosition | Position of the text in the Divider | AcvDividerTextPosition    | -                                                                         |         |
| margin       | Margin of the Divider               | string \| number          | -                                                                         |         |
| color        | Color of the Divider                | ColorBrand \| ColorStatus | 'primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info' | 'brand' |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
