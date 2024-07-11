<script setup>
  import { ref } from 'vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const value = ref(null);
</script>

<template>
  <div class="grid gap-y-3">
    <AcvCheckbox
      v-model="value"
      cycle-indeterminate
    >
      {{ String(value) }}
    </AcvCheckbox>
  </div>
</template>
