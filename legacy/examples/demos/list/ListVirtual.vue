<script setup>
  import AcvList from '@/components/list/list.vue';

  const items = [
    'Donut jujubes',
    'Sesame snaps',
    'I love jelly',
    'Cake gummi',
  ];
</script>

<template>
  <AcvList v-model="items" />
</template>
