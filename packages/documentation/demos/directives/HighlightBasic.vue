<script setup>
  import { ref } from 'vue';
  import { vHighlight } from '@/directives/highlight.ts';
  import Input from '@/components/input/input.vue';

  const keyword = ref('dolor');
  const text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.';
</script>

<template>
  <Input
    v-model="keyword"
    label="Keyword"
  ></Input>
  <div
    v-highlight="keyword"
    class="acv-text acv-text--body-24 mt-16"
  >
    {{ text }}
  </div>
</template>
