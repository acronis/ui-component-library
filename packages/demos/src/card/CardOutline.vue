<script setup>
  import Card from '@/components/card/card.vue';
  import { BASE_COLORS } from '@/utils/color.ts';
</script>

<template>
  <Card
    v-for="color in BASE_COLORS"
    :key="color"
    variant="outline"
    :color="color"
    :class="{
      'acv-bg-surface-fixed-primary pa-8': color === BASE_COLORS.inverted,
    }"
  >
    <span>{{ color }}</span>
  </card>
</template>
