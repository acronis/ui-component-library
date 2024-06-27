---
title: Autocomplete component
lang: en-US
editLink: true
---

# Autocomplete

Show hints while user inputs.

## Basic usage

:::tip
Autocomplete component provides input suggestions.
The `fetch-suggestions` attribute is a method that returns suggested input.
In this example, `querySearch(queryString, cb)` returns suggestions to Autocomplete via `cb(data)` when suggestions are ready.
:::

<AutocompleteBasic />

::: details Source code
<<< @/demos/autocomplete/AutocompleteBasic.vue
:::

## Related components

- [Button](/components/button/button.doc)
- [Input](/components/input/input.doc)

## Props

| Prop name   | Description                     | Type   | Values | Default |
| ----------- | ------------------------------- | ------ | ------ | ------- |
| title       | Title of the Autocomplete       | string | -      |         |
| description | Description of the Autocomplete | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
