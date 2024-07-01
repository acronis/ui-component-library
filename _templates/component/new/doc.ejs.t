---
to: "packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.md"
---

Short description for <%= h.changeCase.pascal(name) %> component...

:::info Figma component anatomy
https://www.figma.com/file/
:::

## Basic usage

<<%= h.changeCase.pascal(name) %>Basic />

::: details Source code
<<< @/demos/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.pascal(name) %>Basic.vue
:::

## Best practices

A <%= h.changeCase.pascal(name) %> should ...

## Related components

- [Button](/components/button/button.doc)
