<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const number1 = ref('');
  const number2 = ref('');
  const number3 = ref('');
</script>

<template>
  <div class="qa-input-textarea-autosize">
    <PreviewGroup>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model.number="number1"
          type="number"
          label="Number"
        />
      </Preview>
      <Preview
        name="With min, max, step and placeholder"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model.number="number2"
          type="number"
          min="-100"
          max="100"
          step="2"
          label="Number"
          :debounce-process-number="600"
          placeholder="Type number"
        />
      </Preview>
      <Preview
        name="With precision"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model.number="number3"
          type="number"
          :precision="1"
          label="Number"
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
