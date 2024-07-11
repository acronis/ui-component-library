---
title: Container component
lang: en-US
editLink: true
---

# Container

Containers are the basic element of layout system.
They align the content within given viewport.

## Basic usage

<ContainerBasic />

::: details Source code
<<< @/demos/container/ContainerBasic.vue
:::

## Responsive

By default, the container is fluid.
It fills the entire width of the viewport.
You can you responsive containers, which are 100% width until specific breakpoint is reached.

<ContainerResponsive />

## Direction

<ContainerDirection />

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name       | Description                                                         | Type                       | Values                                                                    | Default    |
| --------------- | ------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------- | ---------- |
| textColor       | Layer text color                                                    | ColorProp                  | -                                                                         |            |
| borderColor     | Layer border color                                                  | ColorProp                  | -                                                                         |            |
| backgroundColor | Layer background color                                              | ColorProp                  | -                                                                         |            |
| color           | Background color                                                    | ColorProp                  | transparent, primary, secondary, success, warning, danger, info, inverted | 'white'    |
| fluid           | Set container 100% wide, spanning the entire width of the viewport. | boolean                    | -                                                                         |            |
| xxl             | Set container 100% wide until XX-large breakpoint.                  | boolean                    | -                                                                         |            |
| xl              | Set container 100% wide until X-large breakpoint.                   | boolean                    | -                                                                         |            |
| lg              | Set container 100% wide until large breakpoint.                     | boolean                    | -                                                                         |            |
| md              | Set container 100% wide until medium breakpoint.                    | boolean                    | -                                                                         |            |
| sm              | Set container 100% wide until small breakpoint.                     | boolean                    | -                                                                         |            |
| xs              | Set container 100% wide until extra small breakpoint.               | boolean                    | -                                                                         |            |
| direction       | Direction for child elements                                        | "horizontal" \| "vertical" | horizontal, vertical                                                      | 'vertical' |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
