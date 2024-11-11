<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const input1 = ref('');
  const input2 = ref('');
  const input3 = ref('Value');
  const input4 = ref('');
  const input5 = ref('');
  const input6 = ref('Value');
</script>

<template>
  <div class="qa-input-disabled">
    <PreviewGroup>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input1"
          label="Label"
          disabled
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
          disabled
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
          disabled
        />
      </Preview>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input4"
          label="Label"
          size="small"
          disabled
        />
      </Preview>
      <Preview
        name="With placeholder"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input5"
          label="Label"
          placeholder="Placeholder"
          size="small"
          disabled
        />
      </Preview>
      <Preview
        name="With predefined value"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input6"
          label="Label"
          placeholder="Placeholder"
          size="small"
          disabled
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
