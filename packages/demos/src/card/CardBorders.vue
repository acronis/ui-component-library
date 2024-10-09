<script setup>
  import Card from '@/components/card/card.vue';
  import { BRAND_COLORS, STATUS_COLORS } from '@/utils/color.ts';
</script>

<template>
  <Card
    v-for="color in { ...BRAND_COLORS,
                      ...STATUS_COLORS }"
    :key="color"
    variant="outline"
    :color="color"
    :class="{
      'acv-bg-surface-fixed-primary pa-8': color === BRAND_COLORS.inverted,
    }"
  >
    <span>{{ color }}</span>
  </card>
</template>
