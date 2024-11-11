<script setup>
  import AcvTextarea from '@/components/textarea/textarea.vue';
  import { ref } from 'vue';

  const textarea1 = ref('');
  const textarea2 = ref('');
  const textarea3 = ref('Value');
  const textarea4 = ref('');
  const textarea5 = ref('');
  const textarea6 = ref('Value');
</script>

<template>
  <div class="qa-input-textarea-basic">
    <preview-group>
      <preview
        name="Default"
        span="8"
        align-items="stretch"
        justify-content="flex-start"
      >
        <AcvTextarea
          v-model="textarea1"
          label="Label"
          type="textarea"
          class="pt-8"
        />
      </preview>
      <preview
        name="With placeholder"
        span="8"
        align-items="stretch"
        justify-content="flex-start"
      >
        <AcvTextarea
          v-model="textarea2"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          class="pt-8"
        />
      </preview>
      <preview
        name="With predefined value"
        span="8"
        align-items="stretch"
        justify-content="flex-start"
      >
        <AcvTextarea
          v-model="textarea3"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          class="pt-8"
        />
      </preview>
      <preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvTextarea
          v-model="textarea4"
          label="Label"
          type="textarea"
          size="small"
        />
      </preview>
      <preview
        name="With placeholder"
        span="8"
        align-items="stretch"
      >
        <AcvTextarea
          v-model="textarea5"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          size="small"
        />
      </preview>
      <preview
        name="With predefined value"
        span="8"
        align-items="stretch"
      >
        <AcvTextarea
          v-model="textarea6"
          label="Label"
          placeholder="Placeholder"
          type="textarea"
          size="small"
        />
      </preview>
    </preview-group>
  </div>
</template>
