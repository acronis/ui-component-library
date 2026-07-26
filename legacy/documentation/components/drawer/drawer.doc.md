Drawer is a panel that slides in from the edge of the screen.
It can be used to show additional content without taking up space on the main screen.

## Basic usage

`AcvDrawer` component uses `AcvCard` as its base.
Bind `AcvDrawer` with `v-model` to hide and show drawer/card.

All props & slots available in `AcvCard` is available in `AcvDrawer`.

<DrawerBasic />

::: details DrawerBasic
<<< ../../../examples/demos/drawer/DrawerBasic.vue
:::

## Anchor

You can change the position of the drawer by providing the values `left`,`right`,`top` or `bottom` to the `anchor` prop.

<DrawerAnchor />

::: details DrawerAnchor
<<< ../../../examples/demos/drawer/DrawerAnchor.vue{37,45}
:::

## Width

Use width utility classes to provide custom width to drawer.

<DrawerWidth />

::: details DrawerWidth
<<< ../../../examples/demos/drawer/DrawerWidth.vue{13}
:::

## Persistent

You can disable closing drawer on outside click via `persistent` prop.

<DrawerPersistent />

::: details DrawerPersistent
<<< ../../../examples/demos/drawer/DrawerPersistent.vue{14}
:::

## Accessibility

Drawer is accessible by default.
It can be opened and closed using `esc` key.

## Related components

- [Card](/components/card/card.doc)
