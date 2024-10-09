<script setup>
  import Card from '@/components/card/card.vue';
  import { BASE_COLORS, HTML_COLORS } from '@/utils/color.ts';
</script>

<template>
  <Card
    v-for="color in BASE_COLORS"
    :key="color"
    variant="solid"
    :color="color"
  >
    <span>{{ color }}</span>
  </card>
  <Card
    v-for="color in HTML_COLORS"
    :key="color"
    variant="solid"
    :color="color"
  >
    <span>{{ color }}</span>
  </card>
</template>
