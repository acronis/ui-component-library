<script setup>
  import { Accordion, AccordionPanel } from '@acronis-platform/ui-component-library';

  const names = ['First item', 'Second item'];
  const activeName = 'panel1';
</script>

<template>
  <Accordion
    v-model="activeName"
  >
    <AccordionPanel
      v-for="(name, i) in names"
      :id="`panel${i + 1}`"
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
