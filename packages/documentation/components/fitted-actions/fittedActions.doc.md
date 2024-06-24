---
title: Fitted Actions component
lang: en-US
editLink: true
---

# Fitted Actions

Layout for displaying sets of ghosts buttons(actions) there overflowed actions are rendered in dropdown

## Basic usage

<FittedActionsBasic />

::: details Source code
<<< @/demos/fitted-actions/FittedActionsBasic.vue
:::

## Single

<FittedActionsSingle />

::: details Source code
<<< @/demos/fitted-actions/FittedActionsSingle.vue
:::

## Reversed

<FittedActionsReversed />

::: details Source code
<<< @/demos/fitted-actions/FittedActionsReversed.vue
:::

## Minimum

<FittedActionsMinimum />

::: details Source code
<<< @/demos/fitted-actions/FittedActionsMinimum.vue
:::

## Maximum

<FittedActionsMaximum />

::: details Source code
<<< @/demos/fitted-actions/FittedActionsMaximum.vue
:::

## Without Dropdown

<FittedActionsWithoutDropdown />

## Props

| Prop name    | Description                | Type       | Values | Default |
| ------------ | -------------------------- | ---------- | ------ | ------- |
| actions      | List of actions to display | Array      | -      |         |
| item         |                            | FittedItem | -      |         |
| showDropdown | Show the dropdown          | boolean    | -      | true    |
