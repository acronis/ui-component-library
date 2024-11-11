<script setup>
  import { ref } from 'vue';

  const isOpen = ref(false);
  function toggleDetails() {
    isOpen.value = !isOpen.value;
  }
</script>

<template>
  <AcvDetails
    v-model="isOpen"
  >
    <template #body>
      <p>Body</p>

      <AcvButton
        type="ghost"
        @click="toggleDetails"
      >
        Toggle details
      </AcvButton>
    </template>
    <template #details>
      <AcvButton
        type="ghost"
        @click="toggleDetails"
      >
        Details Action
      </AcvButton>
    </template>
  </AcvDetails>
</template>
