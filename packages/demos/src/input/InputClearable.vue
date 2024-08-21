<script setup>
  import { ref } from 'vue';

  import AcvInput from '@/components/input/input.vue';

  const input1 = ref('');
</script>

<template>
  <div class="qa-input-clearable">
    <AcvInput
      v-model="input1"
      label="Label"
      clearable
    />
  </div>
</template>
