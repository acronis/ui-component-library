<script setup>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import { ref } from 'vue';

  const data = ref([]);
</script>

<template>
  <div class="grid grid-rows-2 gap-y-3">
    <AcvCheckbox
      v-model="data"
      value="apple"
      label="Apple"
    />

    <AcvCheckbox
      v-model="data"
      value="banana"
      label="Banana"
    />

    <AcvCheckbox
      v-model="data"
      value="watermelon"
      label="Watermelon"
    />

    <AcvCheckbox
      v-model="data"
      value="orange"
      disabled
      label="Orange"
    />

    <p>Selected: {{ data }}</p>
  </div>
</template>
