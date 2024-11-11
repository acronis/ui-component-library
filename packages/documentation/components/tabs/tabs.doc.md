Used as an alternative or additional content navigation element within the parent section.
Switching the content occurs without reloading the page.
Do not use tab as a button group.
Tab is a navigation element, not a form element.

## Basic usage

Use `tabs` prop to define the list of tabs.

<TabsBasic />

::: details Source code
<<< ../../../examples/demos/tabs/TabsBasic.vue
:::

## Icons

Use `icon` property to render the icon with the tab title.

## `v-model` Support

Use `value` prop to bind the selected tab.

## Tab panels

Use dynamic slots to define the content of each tab panel.
Template name should be equal to the tab value.

Example: `<template #tabName>`

## Anatomy

The `AcvTabs` component consists of the following elements:

- _Tabs_, set of tab elements, associated with tab panels
- _Tab list_, a set of tab elements, contained in a tablist element
- _Tab_, element in a tablist that represents a tab label and can be activated to display its associated tab panel
- _Tab panel_, element that contains the content associated with a tab

## Implementation

- define the `tabs` prop as an array of strings or objects
- define the `value` prop to bind the selected tab
- define slotted content for each tab panel
- define scoped slot for tab label

## Features

- `tabs` prop to define the list of tabs
- `v-model` support to bind the selected tab
- `icon` property to render the icon with the tab title
- dynamic slots to define the content of each tab panel
- dynamic slot for tab label
- TODO: `closable` property to enable closing tabs
- TODO: `divider` property to enable dividing tabs
- TODO: `scrollable` property to enable scrolling tabs
- TODO: `vertical` property to enable vertical tabs
- TODO: `justify` property to enable justified tabs
- TODO: tab focus management
- TODO: tab keyboard navigation

## Accessibility

Provided `AcvTabs` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Related components

- [Button](/components/button/button.doc)
