---
to: packages/ui/src/components/<%= h.changeCase.kebab(name) %>/public.ts
---
export { default as <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %> } from './<%= h.changeCase.camel(name) %>.vue';
export * from './<%= h.changeCase.camel(name) %>.ts';
