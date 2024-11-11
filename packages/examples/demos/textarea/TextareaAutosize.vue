<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const textarea1 = ref('');
</script>

<template>
  <div class="qa-input-textarea-autosize">
    <PreviewGroup>
      <Preview
        name="Default"
        span="10"
        align-items="stretch"
        justify-content="flex-start"
      >
        <AcvInput
          v-model="textarea1"
          label="Label"
          type="textarea"
          class="pt-8"
          autosize
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
