<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const textarea1 = ref('');
  const textarea2 = ref('');
  const textarea3 = ref('Value');
  const textarea4 = ref('');
  const textarea5 = ref('');
  const textarea6 = ref('Value');
</script>

<template>
  <div class="qa-input-textarea-disabled">
    <PreviewGroup>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="textarea1"
          label="Label"
          type="textarea"
          disabled
        />
      </Preview>
      <Preview
        name="With placeholder"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="textarea2"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          disabled
        />
      </Preview>
      <Preview
        name="With predefined value"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="textarea3"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          disabled
        />
      </Preview>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="textarea4"
          label="Label"
          type="textarea"
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
          v-model="textarea5"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
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
          v-model="textarea6"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          size="small"
          disabled
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
