<script setup>
  import { ref } from 'vue';

  import AcvInput from '@/components/input/input.vue';

  const inputPrefixValue = ref('');
</script>

<template>
  <div class="qa-input-mask">
    <PreviewGroup>
      <Preview
        name="Business phone"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="inputPrefixValue"
          label="Business phone"
          prefix-value="+"
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
