---
title: Link component
lang: en-US
editLink: true
---

# Link

Links are used to embedding actions or pathways to more information in a sentence or used in tables with the possibility to drill down to the deeper level.
In other cases preferable to use ghost buttons.

:::info Figma mockups
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=486-15360
:::

## Basic usage

<LinkBasic/>

## Adding click handlers

:::info
If there are both href and click handler, it would trigger both.
:::

<LinkHandlers/>

## Link with path

If the text content is an invalid windows/mac/linux path, the path would not be hidden, and a warning would appear in the console.

:::info
The `link` has to specify the width of the path.
:::

<LinkWithPath />

## Disabled link

<LinkDisabled />

## Props

| Prop name | Description                         | Type    | Values | Default |
| --------- | ----------------------------------- | ------- | ------ | ------- |
| disabled  | Whether the link should be disabled | boolean | -      |         |

## Events

| Event name | Properties | Description |
| ---------- | ---------- | ----------- |
| close      |            |             |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |
