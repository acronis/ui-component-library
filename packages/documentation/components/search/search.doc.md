---
title: Search component
lang: en-US
editLink: true
---

# Search

Used to find or filter content. Search can be global or local, search across all sections of the interface, within the selected section or a drop-down list with predefined values.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A26
:::

## Basic usage

<SearchBasic />

::: details Source code
<<< @/demos/search/SearchBasic.vue
:::

## Embedded

<SearchEmbedded />

## With autocomplete

<SearchAutocomplete />

## With max length

<SearchMaxLength />

## Props

| Prop name   | Description               | Type   | Values | Default |
| ----------- | ------------------------- | ------ | ------ | ------- |
| title       | Title of the Search       | string | -      |         |
| description | Description of the Search | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
