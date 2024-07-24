<script setup lang="ts">
  import { emit as emitFigma, on } from '@create-figma-plugin/utilities';
  import { nextTick, ref, watch } from 'vue';
  import Loading from './Loading.vue';

  const stats = ref(null);
  const isLoading = ref(true);

  const stop = watch(isLoading, (value) => {
    if (value) {
      emitFigma('GET_STATS');
    }
  }, { immediate: true });

  nextTick(() => stop());

  on('SET_STATS', (res) => {
    stats.value = res;

    isLoading.value = false;
  });
</script>

<template>
  <div class="stats m-small">
    <Loading v-if="isLoading" />
    <pre v-else>{{ stats }}</pre>
  </div>
</template>
