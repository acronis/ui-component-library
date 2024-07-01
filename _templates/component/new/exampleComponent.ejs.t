---
to: packages/documentation/demos/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.pascal(name) %>Basic.vue
---
<script setup>
  import <%= h.changeCase.pascal(name) %> from '@/components/<%= h.changeCase.kebab(name) %>/<%= h.changeCase.camel(name) %>.vue';
</script>

<template>
  <<%= h.changeCase.pascal(name) %> />
</template>
