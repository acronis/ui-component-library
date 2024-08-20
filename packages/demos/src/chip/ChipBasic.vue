<script setup>
  import { IconConsole16 } from '@acronis-platform/icons/console';
  import AcvChip from '@/components/chip/chip.vue';
</script>

<template>
  <AcvChip>Text</AcvChip>

  <AcvChip :icon="IconConsole16">
    Text
  </AcvChip>

  <AcvChip show-close>
    Text
  </AcvChip>

  <AcvChip
    :icon="IconConsole16"
    show-close
  >
    Text
  </AcvChip>
</template>
