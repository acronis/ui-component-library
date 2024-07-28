<script setup>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const checkboxStates = [
    '',
    'hover',
    'active',
    'invalid',
    'focus',
    'disabled',
  ];
  const checkboxValues = [
    'checked',
    'unchecked',
    'indeterminate'
  ];

  const valuesMap = {
    checked: true,
    unchecked: false,
    indeterminate: null
  };

  function getValue(value) {
    switch (value) {
      case 'checked':
        return true;
      case 'unchecked':
        return false;
      case 'indeterminate':
        return null;
    }
  }
</script>

<template>
  <div
    v-for="value in checkboxValues"
    :key="value"
    class="acv-grid-row acv-grid--cols-6 gap-4"
  >
    <div
      v-for="state in checkboxStates"
      :key="state"
    >
      <AcvCheckbox
        v-model="valuesMap[value]"
        :value="getValue(value)"
        :class="state"
        :invalid="state === 'invalid'"
        :disabled="state === 'disabled'"
        :label="`${state} ${value}`"
        :icon-class="state"
      />
    </div>
  </div>
</template>
