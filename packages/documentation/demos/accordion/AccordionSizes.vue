<script setup>
  import Accordion from '@/components/accordion/accordion.vue';
  import AccordionPanel from '@/components/accordion/accordionPanel.vue';
  import Divider from '@/components/divider/divider.vue';

  const names = ['First item', 'Second item'];
  const activeName = '1';
</script>

<template>
  <Accordion
    v-model="activeName"
    size="small"
  >
    <AccordionPanel
      v-for="(name, i) in names"
      :id="`${i + 1}`"
      :key="`${i + 1}`"
    >
      <template #label>
        {{ name }}
      </template>
      <p class="my-16 mx-24">
        <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab architecto atque corporis culpa expedita nostrum numquam, porro quas repellat repellendus rerum similique tempore temporibus, vitae.</span>
      </p>
    </AccordionPanel>
  </Accordion>
  <Divider />
  <Accordion
    v-model="activeName"
    size="medium"
  >
    <AccordionPanel
      v-for="(name, i) in names"
      :id="`${i + 1}`"
      :key="`${i + 1}`"
    >
      <template #label>
        {{ name }}
      </template>
      <p class="my-16 mx-24">
        <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab architecto atque corporis culpa expedita nostrum numquam, porro quas repellat repellendus rerum similique tempore temporibus, vitae.</span>
      </p>
    </AccordionPanel>
  </Accordion>
  <Accordion
    v-model="activeName"
    size="large"
  >
    <AccordionPanel
      v-for="(name, i) in names"
      :id="`${i + 1}`"
      :key="`${i + 1}`"
    >
      <template #label>
        {{ name }}
      </template>
      <p class="my-16 mx-24">
        <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab architecto atque corporis culpa expedita nostrum numquam, porro quas repellat repellendus rerum similique tempore temporibus, vitae.</span>
      </p>
    </AccordionPanel>
  </Accordion>
</template>
