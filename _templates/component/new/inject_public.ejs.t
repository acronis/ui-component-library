---
to: packages/ui/src/components/index.ts
inject: true
skip_if: <%= name %>
append: true
---
export * from './<%= h.changeCase.kebab(name) %>/public.ts';
