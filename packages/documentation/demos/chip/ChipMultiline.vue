<script setup>
  import { Chip } from '@acronis-platform/ui-component-library';

  const text = 'Long text'.repeat(20) + 'Nobreak'.repeat(30);
</script>

<template>
  <Chip>{{ text }}</Chip>
</template>
