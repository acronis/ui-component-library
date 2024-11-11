<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const input1 = ref('');
  const input2 = ref('');
  const input3 = ref('Value');
</script>

<template>
  <div class="qa-input-basic">
    <PreviewGroup>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input1"
          label="Label"
          size="small"
        />
      </Preview>
      <Preview
        name="With placeholder"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input2"
          label="Label"
          placeholder="Placeholder"
          size="small"
        />
      </Preview>
      <Preview
        name="With predefined value"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input3"
          label="Label"
          placeholder="Placeholder"
          size="small"
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
