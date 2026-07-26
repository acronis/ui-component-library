<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const input1 = ref('');
  const input2 = ref('');
  const input3 = ref('Value');
  const input4 = ref('');
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
        />
      </Preview>
      <Preview
        name="Required"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input4"
          label="Label"
          required
        />
      </Preview>
      <Preview
        name="Required indicator for disabled input"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input4"
          label="Label"
          required
          disabled
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
