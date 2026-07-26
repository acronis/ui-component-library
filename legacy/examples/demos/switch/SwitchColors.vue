<script setup>
  import AcvSwitch from '@/components/switch/switch.vue';
  import { ref } from 'vue';

  const value = ref([true, false, true]);
  const colors = ['default', 'primary', 'secondary', 'inverted', 'neutral', 'info', 'success', 'warning', 'critical', 'danger',];
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-5">
    <div
      v-for="color in colors"
      :key="color"
      :class="{
        'acv-bg-nav-primary pa-8': color === 'inverted',
      }"
    >
      <AcvSwitch
        v-model="value[0]"
        :color="color"
      />
      <AcvSwitch
        v-model="value[1]"
        :color="color"
      />
      <AcvSwitch
        v-model="value[2]"
        :color="color"
      />
    </div>
  </div>
</template>
