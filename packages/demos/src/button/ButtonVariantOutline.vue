<script setup>
  import { BUTTON_COLOR } from '@/components/button/button.ts';
  import AcvButton from '@/components/button/button.vue';

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
    v-for="color in Object.keys(BUTTON_COLOR)"
    :key="color"
    class="acv-grid-row acv-grid--cols-5 mb-16"
    :class="{ 'acv-bg-nav-primary pa-8': color === BUTTON_COLOR.inverted }"
  >
    <AcvButton
      v-for="(state, index) in buttonStates"
      :key="state + color"
      :class="state"
      :color="color"
      variant="outline"
    >
      {{ index === 0 ? color : '' }} {{ state }}
    </AcvButton>
  </div>
</template>
