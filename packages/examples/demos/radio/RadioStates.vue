<script setup>
  import AcvFormLabel from '@/components/form-label/formLabel.vue';
  import AcvRadio from '@/components/radio/radio.vue';
  import { ref } from 'vue';

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
      <AcvFormLabel
        :label="`${state} ${value}`"
        placement="top"
        :class="state"
      >
        <AcvRadio
          v-model="picked"
          :value="getValue(value)"
          :invalid="state === 'invalid'"
          :disabled="state === 'disabled'"
        />
      </AcvFormLabel>
    </div>
  </div>
</template>
