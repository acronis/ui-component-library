<script setup>
  import { ref } from 'vue';
  import AcvRadio from '@/components/radio/radio.vue';

  const radioStates = [
    '',
    'hover',
    'active',
    'invalid',
    'focus',
    'disabled',
  ];
  const radioValues = [
    'checked',
    'unchecked'
  ];

  const picked = ref(true);

  function getValue(value) {
    switch (value) {
      case 'checked':
        return true;
      case 'unchecked':
        return false;
    }
  }
</script>

<template>
  <div
    v-for="value in radioValues"
    :key="value"
    class="acv-grid-row acv-grid--cols-6 gap-4"
  >
    <div
      v-for="state in radioStates"
      :key="state"
    >
      <AcvFormItem
        v-model="picked"
        :control="AcvRadio"
        :title="`${state} ${value}`"
        title-placement="bottom"
        :value="getValue(value)"
        :class="state"
        :invalid="state === 'invalid'"
        :disabled="state === 'disabled'"
      />
    </div>
  </div>
</template>
