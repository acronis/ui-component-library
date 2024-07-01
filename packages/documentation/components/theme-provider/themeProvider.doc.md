---
title: Theme Provider component
lang: en-US
editLink: true
---

# Theme Provider

ThemeProvider component allows to style a section of your application in a different theme from default

## Basic usage

<ThemeProviderBasic />

::: details Source code
<<< @/demos/theme-provider/ThemeProviderBasic.vue
:::

## Props

| Prop name      | Description                               | Type    | Values | Default |
| -------------- | ----------------------------------------- | ------- | ------ | ------- |
| tag            | Specify custom tag used on a root element | string  | -      | div     |
| theme          | Specify the theme to apply                | string  | -      |         |
| withBackground | Apply selected theme background color     | boolean | -      | true    |

## Slots

| Name    | Description                                                                         | Bindings |
| ------- | ----------------------------------------------------------------------------------- | -------- |
| default | All children elements will have the theme applied<br/>must be a single root element |          |
