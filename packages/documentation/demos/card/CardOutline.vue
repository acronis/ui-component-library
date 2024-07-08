<script setup>
  import { BASE_COLORS } from '@/utils/color.ts';
  import Card from '@/components/card/card.vue';
</script>

<template>
  <Card
    v-for="color in BASE_COLORS"
    :key="color"
    variant="outline"
    :color="color"
  >
    <span>{{ color }}</span>
  </card>
</template>
