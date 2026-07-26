<script setup>
  import AcvSwitch from '@/components/switch/switch.vue';
  import { ref } from 'vue';

  const value = ref([true, false, true]);
  const sizes = ref(['small', 'medium', 'large']);
</script>

<template>
  <div
    v-for="size in sizes"
    :key="size"
    class="w-full
    flex
    justify-center
    gap-5"
  >
    <AcvSwitch
      v-model="value[0]"
      :size="size"
    />
    <AcvSwitch
      v-model="value[1]"
      :size="size"
      color="tertiary"
    />
    <AcvSwitch
      v-model="value[2]"
      :size="size"
      color="error"
    />
  </div>
</template>
