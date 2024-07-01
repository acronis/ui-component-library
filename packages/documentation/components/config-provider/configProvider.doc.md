---
title: Acv Config Provider component
lang: en-US
editLink: true
---

# Acv Config Provider

ConfigProvider is a component that allows you to set the default values for the components in the application.

## Basic usage

<ConfigProviderBasic />

::: details Source code
<<< @/demos/config-provider/ConfigProviderBasic.vue
:::

## Props

| Prop name | Description                                                                                                                       | Type        | Values | Default |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | ------- |
| props     | Components default props.<br/>Similar to what you pass to `propsDefaults` while initializing Acronis UI Component Library plugin. | NonNullable | -      |         |

## Slots

| Name    | Description                                                               | Bindings |
| ------- | ------------------------------------------------------------------------- | -------- |
| default | The default slot content to render components affected by provided config |          |
