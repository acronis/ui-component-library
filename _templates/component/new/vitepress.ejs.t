---
to: packages/documentation/.vitepress/configuration/components.ts
inject: true
skip_if: <%= name %>
after: "export const enComponents ="
---
  { text: '<%= h.changeCase.pascal(name) %>', link: '/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.md' },
