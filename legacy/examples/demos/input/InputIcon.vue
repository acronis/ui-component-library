<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const input1 = ref('');
</script>

<template>
  <div class="qa-input-icon">
    <PreviewGroup>
      <Preview
        name="Date"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input1"
          label="Date"
          suffix-icon="i-calendar-o--16"
          size="normal"
        />
      </Preview>
      <Preview
        name="Search"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          v-model="input1"
          placeholder="Search"
          suffix-icon="i-search-o--16"
          size="small"
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
