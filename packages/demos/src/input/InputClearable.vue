<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

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
