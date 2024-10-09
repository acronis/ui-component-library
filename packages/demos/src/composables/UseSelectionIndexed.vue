<script setup>
  import { useSelection } from '@/composables/useSelection.ts';

  const { options, select, value } = useSelection({
    items: [...Array.from({ length: 3 }).keys()],
  });
</script>

<template>
  <div class="flex flex-wrap gap-8 mb-4">
    <AcvButton
      v-for="option in options"
      :key="option.value"
      :variant="option.isSelected ? 'fill' : 'light'"
      @click="select(option.value)"
    >
      Index: {{ option.value }}
    </AcvButton>
  </div>
  <small>Selected: {{ String(value) }}</small>
</template>
