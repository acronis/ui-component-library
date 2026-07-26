<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvList from '@/components/list/list.vue';
  import { ref } from 'vue';

  const items = [
    { title: 'Donut jujubes' },
    { title: 'Sesame snaps' },
    { title: 'I love jelly' },
    { title: 'Cake gummi', disabled: true },
  ];

  const selected = ref(0);
</script>

<template>
  {{ selected }}
  <AcvCard>
    <AcvList
      v-model="selected"
      :items="items"
      variant="light"
      class="a-list-items-pill"
    />
  </AcvCard>
</template>
