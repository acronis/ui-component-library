Used as navigation on the main sections of the interface.
It is typically organized in a hierarchical structure and can be presented in various formats such as horizontal bars, vertical lists, or dropdown menus.
The primary purpose of a navigation menu is to help users find and access content quickly and efficiently.

## Basic usage

<MenuBasic />

::: details Source code
<<< ../../../examples/demos/menu/MenuBasic.vue
:::

## Menu types

### Primary

Elements of the first level of navigation may contain a second level of navigation.
The second level of navigation is opened by clicking on the parent element.
By default, the first element of the second navigation level will always be active.

<MenuPrimary />

### Secondary

Used to access subsections within the parent section. The link should clearly describe the action and give an unambiguous understanding of the subsection to which the user will go. If the links do not fit
in the same screen, additional navigation appears in the right as arrows with the possibility
of horizontal scrolling

<MenuSecondary />

### Tertiary

Used to access subsections within the parent section.
The link should clearly describe the action and give an unambiguous understanding of the subsection to which the user will go.
If the links do not fit in the same screen, additional navigation appears in the right as arrows with the possibility
of horizontal scrolling

<MenuTertiary />

## Grouping

Use `<acv-menu-group />` to group items inner a submenu.

<MenuWithGroup />

## Disabled items

Use `disabled` attribute to disable an **acv-menu-item**.

<MenuWithDisabledItems />

## Select active menu item

Menu supports `v-model` as the binding index of currently active menu.
Use `model` bindings to control menu selection.

## Accessibility

Provided `AcvMenu` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).

### Keyboard Interaction

- When a menu opens, or when a menubar receives focus, keyboard focus is placed on the first item.
- When a menu item receives focus, the user can:
  - Navigate to the next item with the `Tab` key.
  - Navigate to the previous item with the `Tab + Shift` key.
  - Open a submenu with the `Right Arrow` key.
  - Close a submenu with the `Left Arrow` key.
  - Close the menu with the `Escape` key.
  - Activate/select a menu item with the `Enter` key.
