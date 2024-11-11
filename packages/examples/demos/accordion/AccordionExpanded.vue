<script setup>
  import Accordion from '@/components/accordion/accordion.vue';
  import AccordionPanel from '@/components/accordion/accordionPanel.vue';

  const names = ['First item', 'Second item'];
  const activeName = '1';
</script>

<template>
  <Accordion
    v-model="activeName"
    multiple
    expanded
  >
    <AccordionPanel
      v-for="(name, i) in names"
      :id="`${i + 1}`"
      :key="`${i + 1}`"
      :title="name"
    >
      <template #label>
        Panel {{ i }}
      </template>
      <p class="my-16 mx-24">
        <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab architecto atque corporis culpa expedita nostrum numquam, porro quas repellat repellendus rerum similique tempore temporibus, vitae.</span>
      </p>
    </AccordionPanel>
  </Accordion>
</template>
