<script setup>
  import { AcvChip } from '@acronis-platform/ui-component-library';

  const text = 'Long text'.repeat(20) + 'Nobreak'.repeat(30);
</script>

<template>
  <AcvChip>{{ text }}</AcvChip>
</template>
