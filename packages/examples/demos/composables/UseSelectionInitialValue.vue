<script setup>
  import { useSelection } from '@/composables/useSelection.ts';

  const { options, select, value } = useSelection({
    items: ['apple', 'banana', 'orange', 'watermelon'],
    initialValue: 'banana', // [!code hl]
  });
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-6 mb-4">
      <AcvButton
        v-for="option in options"
        :key="option.value"
        :variant="option.isSelected ? 'fill' : 'light'"
        @click="select(option.value)"
      >
        {{ option.value }}
      </AcvButton>
    </div>
    <small class="block">Selected: {{ value }}</small>
  </div>
</template>
