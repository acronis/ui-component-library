<script setup lang="ts">
  import { ref } from 'vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const value = ref<boolean | null>(null);
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
