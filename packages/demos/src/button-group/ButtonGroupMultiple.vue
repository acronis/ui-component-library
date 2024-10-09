<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvButtonGroup from '@/components/button-group/buttonGroup.vue';
  import { ref } from 'vue';

  const checkboxGroup = ref(['Mon', 'Wed', 'Fri', 'Sun']);
  const items = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
</script>

<template>
  <AcvButtonGroup
    v-model="checkboxGroup"
    role="group"
    aria-label="Basic example"
    selected-type="primary"
    default-type="secondary"
    selection-mode="multiple"
  >
    <AcvButton
      v-for="item in items"
      :key="item"
    >
      {{ item }}
    </AcvButton>
  </AcvButtonGroup>
</template>
