<script setup>
  import AcvSwitch from '@/components/switch/switch.vue';
  import { ref } from 'vue';

  const values = ref([true, true, false, false]);
</script>

<template>
  <AcvSwitch v-model="values[0]">
    On
  </AcvSwitch>
  <AcvSwitch
    v-model="values[1]"
    disabled
  >
    On and disabled
  </AcvSwitch>
  <AcvSwitch v-model="values[2]">
    On
  </AcvSwitch>
  <AcvSwitch
    v-model="values[3]"
    disabled
  >
    Off and disabled
  </AcvSwitch>
</template>
