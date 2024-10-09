<script setup>
  import AcvButton from '@/components/button/button.vue';
  import Popper from '@/components/popper/popper.vue';
  import { ref } from 'vue';

  const popperVisible = ref(false);
</script>

<template>
  <AcvButton @click="popperVisible = !popperVisible">
    Toggle
  </AcvButton>
  <Popper
    v-model="popperVisible"
    class="popper"
    :offset="6"
    arrow
  >
    <AcvButton>Popper</AcvButton>
    <template #content>
      Lorem ipsum dolor sit amet, consectet adipisicing elit.
    </template>
  </Popper>
</template>

<style scoped>
.acv-popper {
  background-color: hsl(28deg 100% 97%);
  border: 1px solid hsl(0deg 0% 0%);
  padding: 8px;
}
</style>
