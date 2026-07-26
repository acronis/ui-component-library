<script setup>
  import { useSelection } from '@/composables/useSelection.ts';
  import { ref } from 'vue';

  const isMultiEnabled = ref(false);
  const { options, select, value } = useSelection({
    items: ['apple', 'banana', 'orange', 'watermelon'],
    multi: isMultiEnabled,
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
    <AcvCheckbox
      v-model="isMultiEnabled"
      label="Multiple Selection"
      class="mb-3"
    />
    <small class="block">Selected: {{
      isMultiEnabled
        ? value ? [...value].join(', ') : String(value)
        : String(value)
    }}</small>
  </div>
</template>
