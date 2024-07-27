---
to: "packages/documentation/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.doc.md"
---

A short description of where the <%= h.changeCase.pascal(name) %> component can be used...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Features

- Feature 1
- Feature 2

## Basic usage

<<%= h.changeCase.pascal(name) %>Basic />

::: details Source code
<<< @/demos/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.pascal(name) %>Basic.vue
:::

## Accessibility

Short description of the accessibility features of the <%= h.changeCase.pascal(name) %> component...

## Related components

- [Button](/components/button/button.doc)
