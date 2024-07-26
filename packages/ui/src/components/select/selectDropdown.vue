<script setup>
  import AcvCard from '@/components/card/card.vue';
</script>

<template>
  <AcvCard
    :padding="false"
    class="acv-select-dropdown"
    role="listbox"
  >
    <slot />
  </AcvCard>
</template>

<style scoped>
 .acv-select-dropdown {
   max-height: 300px;
   overflow-y: scroll;
   top: 8px;
   left: 0;
   width: 300px;
   border: 1px solid var(--acv-color-primary);
   border-radius: 0.4rem;
   background-color: var(--acv-color-white);
   box-shadow: 0 0 4px var(--acv-color-primary-light);
   z-index: var(--acv-z-index-normal);
 }
</style>
