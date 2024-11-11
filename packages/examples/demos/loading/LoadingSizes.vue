<script setup>
  import AcvLoading from '@/components/loading/loading.vue';
  import { ref } from 'vue';
  import phaethon from '../../__mocks__/data.phaethon.txt?raw';

  const loading = ref(true);
</script>

<template>
  <div class="acv-grid acv-grid--cols-4">
    <div class="item">
      <AcvLoading
        v-model="loading"
        size="small"
      />
      {{ phaethon }}
    </div>
    <div class="item">
      <AcvLoading
        v-model="loading"
        size="medium"
      />
      {{ phaethon }}
    </div>
    <div class="item">
      <AcvLoading
        v-model="loading"
        size="large"
      />
      {{ phaethon }}
    </div>
    <div class="item">
      <AcvLoading
        v-model="loading"
        size="x-large"
      />
      {{ phaethon }}
    </div>
  </div>
</template>

<style scoped>
  .acv-grid {
    .item {
      width: 128px;
      height: 128px;
      position: relative;
      overflow: clip;
      padding: 8px;
    }
  }
</style>
