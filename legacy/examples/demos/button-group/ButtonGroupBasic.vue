<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvButtonGroup from '@/components/button-group/buttonGroup.vue';
  import { ref } from 'vue';

  const selected = ref('Middle');
</script>

<template>
  <AcvButtonGroup
    v-model="selected"
    role="group"
    aria-label="Basic example"
    selected-type="primary"
    default-type="secondary"
  >
    <AcvButton type="secondary">
      Left
    </AcvButton>
    <AcvButton>Middle</AcvButton>
    <AcvButton type="secondary">
      Right
    </AcvButton>
  </AcvButtonGroup>
</template>
