<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { vTooltip } from '@/directives/tooltip.ts';
</script>

<template>
  <AcvButton
    v-tooltip="{
      placement: 'right',
      content: 'This is a tooltip',
      modelValue: true,
    }"
  >
    Hover me
  </AcvButton>
</template>
