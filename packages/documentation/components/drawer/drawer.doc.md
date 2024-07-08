---
title: Acv Drawer component
lang: en-US
editLink: true
---

# Acv Drawer

Drawer is a panel that slides in from the edge of the screen.
It can be used to show additional content without taking up space on the main screen.

## Basic usage

`AcvDrawer` component uses `AcvCard` as its base.
Bind `AcvDrawer` with `v-model` to hide and show drawer/card.

All props & slots available in `AcvCard` is available in `AcvDrawer`.

<DrawerBasic />

::: details DrawerBasic
<<< @/demos/drawer/DrawerBasic.vue
:::

## Anchor

You can change the position of the drawer by providing the values `left`,`right`,`top` or `bottom` to the `anchor` prop.

<DrawerAnchor />

::: details DrawerAnchor
<<< @/demos/drawer/DrawerAnchor.vue{37,45}
:::

## Width

Use width utility classes to provide custom width to drawer.

<DrawerWidth />

::: details DrawerWidth
<<< @/demos/drawer/DrawerWidth.vue{13}
:::

## Persistent

You can disable closing drawer on outside click via `persistent` prop.

<DrawerPersistent />

::: details DrawerPersistent
<<< @/demos/drawer/DrawerPersistent.vue{14}
:::

## Accessibility

Drawer is accessible by default.
It can be opened and closed using `esc` key.

## Related components

- [Card](/components/card/card.doc)

## Props

| Prop name       | Description                                                     | Type            | Values                                                                    | Default |
| --------------- | --------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------- | ------- |
| loading         | Set loading state                                               | boolean         | -                                                                         |         |
| imgAlt          | `alt` attribute for image rendered via `img` prop               | string          | -                                                                         |         |
| img             | Render image at the top of the card (_above header_)            | string          | -                                                                         |         |
| padding         |                                                                 | boolean         | -                                                                         |         |
| border          |                                                                 | boolean         | -                                                                         |         |
| round           |                                                                 | boolean         | -                                                                         |         |
| shadow          | Whether the card should have a shadow                           | boolean         | -                                                                         |         |
| textColor       | Layer text color                                                | ColorProp       | -                                                                         |         |
| borderColor     | Layer border color                                              | ColorProp       | -                                                                         |         |
| backgroundColor | Layer background color                                          | ColorProp       | -                                                                         |         |
| color           | Background color                                                | ColorProp       | transparent, primary, secondary, success, warning, danger, info, inverted |         |
| variant         | Layer variant                                                   | LayerVariant    | 'solid' \| 'outline' \| 'ghost' \| 'light'                                | 'solid' |
| states          | Interaction states like hover & active                          | boolean         | -                                                                         | false   |
| modelValue      | Drawer visiblity state                                          | boolean         | -                                                                         | false   |
| persistent      | Persistence of drawer when clicked outside of reference element | boolean         | -                                                                         | false   |
| anchor          | Drawer anchor/position                                          | AcvDrawerAnchor | -                                                                         | 'left'  |

## Events

| Event name        | Properties                                                                                                      | Description                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| update:modelValue | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name | Description | Bindings |
| ---- | ----------- | -------- |
| name |             |          |
