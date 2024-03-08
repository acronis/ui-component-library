---
title: Password
lang: en-US
editLink: true
---

# Password

Used to verify the identity of a user during the authentication process.

## Basic usage

<BasicPassword />

::: details Source code
<<< ../../examples/components/password/Basic.vue
:::

## With score

<ScorePassword />

::: details Source code
<<< ../../examples/components/password/Score.vue
:::

## Responsive score example

<ScorePassword responsiveScore/>

::: details Source code
<<< ../../examples/components/password/Score.vue
:::

## Password keychain

The password entry field can be used with the keychain option. After clicking on the key icon the dropdown with a list of account opens.

[Combobox > Types > Password](../components/combobox)

## Password Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| with-icon | Whether to show suffix icon. | boolean | — | false |
| default-type | `password` - password is hidden, `text` - password is visible. | string | text / password | 'password' |
| description | Description text. | string | — | — |
| is-error | Whether to shown as error state. | boolean | — | — |
| score | Password strength score: 1 - weak, 2 - normal, 3 - strong. | number | — | — |

## Password Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| focus | Triggers when Password focuses. | (event: Event) |
| blur | Triggers when Password blurs. | (event: Event) |
| input | Triggers when Password inputs. | (value: string) |
| change | Triggers when Password value change. | (value: string) |

<script setup>
  import BasicPassword from 'examples/components/password/Basic.vue';
  import ScorePassword from 'examples/components/password/Score.vue';
</script>
