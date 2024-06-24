---
title: Tabs component
lang: en-US
editLink: true
---

# Tabs

Used as an alternative or additional content navigation element within the parent section.
Switching the content occurs without reloading the page.
Do not use tab as a button group.
Tab is a navigation element, not a form element.

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<TabsBasic />

::: details Source code
<<< @/demos/tabs/TabsBasic.vue
:::

## Accessibility ♿️

Provided `AcvTabs` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Related components

- [Button](/components/button/button.doc)

## Props

| Prop name   | Description             | Type   | Values | Default |
| ----------- | ----------------------- | ------ | ------ | ------- |
| title       | Title of the Tabs       | string | -      |         |
| description | Description of the Tabs | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
