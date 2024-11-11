<script setup>
  import Spinner from '@/components/spinner/spinner.vue';
  import { BRAND_COLORS, STATUS_COLORS } from '@/utils/color.ts';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-4">
    <div
      v-for="color in { ...BRAND_COLORS,
                        ...STATUS_COLORS }"
      :key="color"
      class="acv-grid-col"
      :class="{
        'acv-bg-surface-fixed-primary pa-8': color === BRAND_COLORS.inverted,
      }"
    >
      <Spinner
        size="large"
        :color="color"
      />
    </div>
  </div>
</template>
