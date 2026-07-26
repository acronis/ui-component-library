<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { HTML_COLORS } from '@/utils/color.ts';

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
    v-for="color in Object.keys(HTML_COLORS)"
    :key="color"
    class="acv-grid-row acv-grid--cols-5 mb-16"
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
