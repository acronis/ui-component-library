---
to: "packages/ui/src/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.vue"
---
<script setup lang="ts">
  import type {
    <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Events,
    <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Props,
    <%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Slots
  } from './<%= h.changeCase.camel(name) %>.ts';
  import './<%= h.changeCase.camel(name) %>.css';

  const { title, description } = defineProps<<%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Props>();

  defineEmits<<%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Events>();
  defineSlots<<%= h.pascalPrefix() %><%= h.changeCase.pascal(name) %>Slots>();
</script>

<template>
  <div class="<%= h.prefix() %>-<%= h.changeCase.kebab(name) %>">
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .<%= h.prefix() %>-<%= h.changeCase.kebab(name) %> {
    font-weight: var(--<%= h.prefix() %>-font-weight-strong);
    color: var(--<%= h.prefix() %>-<%= h.changeCase.kebab(name) %>-color);
  }
</style>
