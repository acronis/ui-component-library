<script setup>
  import AcvButton from '@/components/button/button.vue';
  import { vLoading } from '@/directives/loading.ts';
  import { ref } from 'vue';

  const loading = ref(false);
</script>

<template>
  <AcvButton
    @click="loading = !loading"
  >
    Toggle loading directive
  </AcvButton>
  <div class="acv-grid acv-grid--cols-2">
    <div
      v-loading="loading"
      class="item"
    />
    <div
      v-loading="{
        background: 'blue',
        title: 'This is title',
        description: 'Description',
        size: 'x-large',
        modelValue: loading,
        color: 'red',
        textColor: 'white',
        opacity: 1,
      }"
      class="item"
    />
  </div>
</template>

<style scoped>
.item {
  width:256px;
  height:256px;
  position: relative;
  background-color: var(--acv-color-neutral);
}
</style>
