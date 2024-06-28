<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { vTooltip } from '@/directives/tooltip.ts';
</script>

<template>
  <AcvButton
    v-tooltip="'This is a tooltip'"
  >
    Directive tooltip
  </AcvButton>
</template>
