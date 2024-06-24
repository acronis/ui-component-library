---
title: Script Editor component
lang: en-US
editLink: true
---

# Script Editor

Open source browser based or inline IDE component.
If you spend any time managing and writing code, you are probably using one of a handful of modern editors such as Atom, Sublime Text, Visual Studio, or Visual Studio Code.
These all provide a first class editing experience on the desktop – one that we quickly become familiar and comfortable with.Replicating this experience in a web browser has never been straightforward.

## Basic usage

<ScriptEditorBasic />

::: details Source code
<<< @/demos/script-editor/ScriptEditorBasic.vue
:::

## Props

| Prop name   | Description                     | Type   | Values | Default |
| ----------- | ------------------------------- | ------ | ------ | ------- |
| title       | Title of the ScriptEditor       | string | -      |         |
| description | Description of the ScriptEditor | string | -      |         |

## Events

| Event name | Properties                                                                                                      | Description                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| close      | **eventName** `string` - The name of the event<br/>**visible** `string` - The visibility state of the component | Triggered when the component is closed |

## Slots

| Name        | Description                  | Bindings |
| ----------- | ---------------------------- | -------- |
| default     | The default slot content     |          |
| description | The description slot content |          |
