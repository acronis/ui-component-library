<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { NAMED_COLORS } from '@/utils/color.ts';

  const buttonStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];
</script>

<template>
  <div
    v-for="color in Object.keys(NAMED_COLORS)"
    :key="color"
    class="acv-grid-row acv-grid--cols-5 mb-16"
    :class="{ 'acv-bg-nav-primary pa-8': [NAMED_COLORS.transparent, NAMED_COLORS.white].includes(color) }"
  >
    <AcvButton
      v-for="state in buttonStates"
      :key="state + color"
      :class="state"
      :color="color"
    >
      {{ color }} {{ state }}
    </AcvButton>
  </div>
</template>
