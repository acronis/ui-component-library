Used as navigation on the main sections of the interface.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A19
:::

## Basic usage

<MenuBasic />

::: details Source code
<<< @/demos/menu/MenuBasic.vue
:::

## Vertical usage

Elements of the first level of navigation may contain a second level of navigation.
The second level of navigation is opened by clicking on the parent element.
By default, the first element of the second navigation level will always be active.

<MenuVertical />

## Scroll into expanded submenu

Use `scroll-into-expanded` to automatically scroll into newly expanded submenu, only works when menu is **immediate child** of el-scrollbar.

::: info
When the submenu items height is larger than scroll view height, submenu will be positioned at top.
:::

## Grouping

Use `<acv-menu-group />` to group items inner a submenu.

## Variants

## Horizontal usage

Used to access subsections within the parent section. The link should clearly describe the action and give an unambiguous understanding of the subsection to which the user will go. If the links do not fit
in the same screen, additional navigation appears in the right as arrows with the possibility
of horizontal scrolling

## Disabled items

## Select interception

We support `value` as the binding index of currently active menu. Use `:value` and `@select` bindings to intercept menu change.

## Custom height of Horizontal NavMenu
