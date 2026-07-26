<script setup>
  import AcvChip from '@/components/chip/chip.vue';

  const text = 'Long text'.repeat(20) + 'Nobreak'.repeat(30);
</script>

<template>
  <AcvChip>{{ text }}</AcvChip>
</template>
